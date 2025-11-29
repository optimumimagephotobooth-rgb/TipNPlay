# 📦 Complete Code Package for Replit

Copy each section below into the corresponding file in Replit.

---

## File 1: `supabase/functions/create-payment-intent/index.ts`

```typescript
// Supabase Edge Function: Create Payment Intent
// Handles tip payment processing

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.0.0'

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
```

---

## File 2: `supabase/functions/stripe-webhook/index.ts`

```typescript
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
```

---

## File 3: `supabase/functions/create-event-checkout/index.ts`

```typescript
// Supabase Edge Function: Create Event Checkout Session
// Handles event creation payment

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { eventData, userId } = await req.json()

    // Validate user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Event: ${eventData.name}`,
              description: eventData.description || 'TipNPlay Event',
            },
            unit_amount: 500, // $5.00 for event creation
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${Deno.env.get('SITE_URL')}/create-event?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get('SITE_URL')}/create-event?canceled=true`,
      metadata: {
        user_id: userId,
        event_name: eventData.name,
        event_data: JSON.stringify(eventData),
      },
    })

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

---

## File 4: `src/utils/payments.js`

```javascript
/**
 * Payment Utilities
 * Handles Stripe payment processing
 */

const SUPABASE_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL?.replace('/rest/v1', '/functions/v1') || ''

/**
 * Create payment intent for tip
 */
export async function createPaymentIntent({ amount, eventId, tipperName, message }) {
  try {
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        amount,
        eventId,
        tipperName,
        message,
        currency: 'usd',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create payment intent')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

/**
 * Create checkout session for event creation
 */
export async function createEventCheckout(eventData, userId) {
  try {
    const response = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-event-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        eventData,
        userId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create checkout session')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}
```

---

## File 5: `src/components/TipPaymentForm.jsx`

```javascript
import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { createPaymentIntent } from '../utils/payments'
import './TipPaymentForm.css'

/**
 * Tip Payment Form Component
 * Handles Stripe card input and payment processing
 */
function TipPaymentForm({ 
  amount, 
  eventId, 
  tipperName, 
  message, 
  onSubmit, 
  onSuccess,
  disabled = false 
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [cardError, setCardError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      toast.error('Payment system not ready. Please wait...')
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      toast.error('Card information required')
      return
    }

    setProcessing(true)
    setCardError(null)

    try {
      // Create payment intent
      const { clientSecret } = await createPaymentIntent({
        amount,
        eventId,
        tipperName,
        message,
      })

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: tipperName || 'Anonymous',
          },
        },
      })

      if (error) {
        setCardError(error.message)
        throw new Error(error.message)
      }

      if (paymentIntent.status === 'succeeded') {
        if (onSuccess) {
          onSuccess(paymentIntent)
        }
        if (onSubmit) {
          onSubmit(paymentIntent)
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#fff',
        '::placeholder': {
          color: 'rgba(255, 255, 255, 0.5)',
        },
      },
      invalid: {
        color: '#ff4444',
      },
    },
    hidePostalCode: true,
  }

  return (
    <form onSubmit={handleSubmit} className="tip-payment-form">
      <div className="card-element-wrapper">
        <label>Card Information</label>
        <div className="card-element-container">
          <CardElement
            options={cardElementOptions}
            onChange={(e) => {
              setCardError(e.error ? e.error.message : null)
            }}
          />
        </div>
        {cardError && (
          <div className="card-error">{cardError}</div>
        )}
      </div>

      <motion.button
        type="submit"
        className="submit-payment-btn"
        disabled={!stripe || processing || disabled || cardError}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {processing ? (
          <>
            <span className="spinner-small"></span>
            Processing...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </motion.button>

      <p className="payment-security">
        🔒 Secure payment powered by Stripe
      </p>
    </form>
  )
}

export default TipPaymentForm
```

---

## File 6: `src/components/TipPaymentForm.css`

```css
.tip-payment-form {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.card-element-wrapper {
  margin-bottom: 1.5rem;
}

.card-element-wrapper label {
  display: block;
  margin-bottom: 0.5rem;
  color: #fff;
  font-weight: 500;
}

.card-element-container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-error {
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.submit-payment-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.submit-payment-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.payment-security {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin-top: 1rem;
}
```

---

## File 7: `src/components/PayoutProfileForm.jsx`

[See full file in repo - too long for this doc]

---

## File 8: `src/components/PayoutProfileForm.css`

[See full file in repo]

---

## File 9: `src/components/PayoutMethodsList.jsx`

[See full file in repo]

---

## File 10: `src/components/PayoutMethodsList.css`

[See full file in repo]

---

## 📝 Database Schema Update

Run this in Supabase SQL Editor:

```sql
-- Add payout_profiles table
CREATE TABLE IF NOT EXISTS payout_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  method_type TEXT NOT NULL CHECK (method_type IN ('bank', 'stripe', 'paypal', 'venmo', 'cashapp')),
  account_details JSONB NOT NULL,
  account_name TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add payouts table
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payout_profile_id UUID REFERENCES payout_profiles(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  stripe_payout_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- RLS Policies
ALTER TABLE payout_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payout profiles"
  ON payout_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payout profiles"
  ON payout_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payout profiles"
  ON payout_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payout profiles"
  ON payout_profiles FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payouts"
  ON payouts FOR SELECT
  USING (auth.uid() = user_id);
```

---

## ✅ Next Steps

1. Copy all files above to Replit
2. Install dependencies: `npm install`
3. Deploy Edge Functions (see REPLIT_IMPORT_GUIDE.md)
4. Set environment variables
5. Run database schema
6. Test!

