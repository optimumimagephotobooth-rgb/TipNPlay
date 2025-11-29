// Supabase Edge Function: Create Payment Intent
// Handles tip payment processing

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.0.0'
import { rateLimitMiddleware, getClientIdentifier, checkRateLimit } from '../_shared/rateLimiter.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Rate limiting: 10 requests per minute per IP
  const rateLimitResponse = rateLimitMiddleware(req, 10, 60000)
  if (rateLimitResponse) {
    return new Response(rateLimitResponse.body, {
      ...rateLimitResponse,
      headers: { ...corsHeaders, ...rateLimitResponse.headers },
    })
  }

  try {
    const { amount, eventId, tipperName, message, currency = 'usd' } = await req.json()

    // Validate input
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!eventId) {
      return new Response(
        JSON.stringify({ error: 'Event ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get event from Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: event, error: eventError } = await supabaseClient
      .from('events')
      .select('*, user_id, users!inner(stripe_account_id)')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return new Response(
        JSON.stringify({ error: 'Event not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        event_id: eventId,
        tipper_name: tipperName || 'Anonymous',
        message: message || '',
      },
      // If DJ has Stripe Connect account, use it
      ...(event.users?.stripe_account_id && {
        application_fee_amount: Math.round(amount * 100 * 0.05), // 5% platform fee
        on_behalf_of: event.users.stripe_account_id,
        transfer_data: {
          destination: event.users.stripe_account_id,
        },
      }),
    })

    // Save tip record in Supabase (pending status)
    const { error: tipError } = await supabaseClient
      .from('tips')
      .insert({
        event_id: eventId,
        amount: amount,
        tipper_name: tipperName || null,
        message: message || null,
        payment_intent_id: paymentIntent.id,
        status: 'pending',
      })

    if (tipError) {
      console.error('Error saving tip:', tipError)
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

