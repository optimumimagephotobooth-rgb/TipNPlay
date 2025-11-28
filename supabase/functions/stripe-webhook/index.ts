// Supabase Edge Function: Stripe Webhook Handler
// Processes Stripe webhook events

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const eventId = paymentIntent.metadata.event_id

        // Update tip status to completed
        await supabaseClient
          .from('tips')
          .update({
            status: 'completed',
          })
          .eq('payment_intent_id', paymentIntent.id)

        // Update event total tips
        const { data: tip } = await supabaseClient
          .from('tips')
          .select('amount, event_id')
          .eq('payment_intent_id', paymentIntent.id)
          .single()

        if (tip) {
          // Update event stats (could use a database function for this)
          const { data: event } = await supabaseClient
            .from('events')
            .select('id')
            .eq('id', tip.event_id)
            .single()

          // Send real-time notification
          await supabaseClient.channel(`event:${tip.event_id}`)
            .send({
              type: 'broadcast',
              event: 'new_tip',
              payload: {
                amount: tip.amount,
                tipper_name: paymentIntent.metadata.tipper_name,
                message: paymentIntent.metadata.message,
              },
            })
        }

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Update tip status to failed
        await supabaseClient
          .from('tips')
          .update({
            status: 'failed',
          })
          .eq('payment_intent_id', paymentIntent.id)

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

