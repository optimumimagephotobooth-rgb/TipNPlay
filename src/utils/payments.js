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
 * Confirm payment with Stripe
 */
export async function confirmPayment(paymentIntentId, paymentMethod) {
  try {
    const { loadStripe } = await import('@stripe/stripe-js')
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

    if (!stripe) {
      throw new Error('Stripe not loaded')
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      paymentIntentId,
      {
        payment_method: paymentMethod,
      }
    )

    if (error) {
      throw new Error(error.message)
    }

    return paymentIntent
  } catch (error) {
    console.error('Error confirming payment:', error)
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

/**
 * Process tip payment
 */
export async function processTipPayment({ amount, eventId, tipperName, message, cardElement }) {
  try {
    // Create payment intent
    const { clientSecret, paymentIntentId } = await createPaymentIntent({
      amount,
      eventId,
      tipperName,
      message,
    })

    // Confirm payment with Stripe
    const { loadStripe } = await import('@stripe/stripe-js')
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

    if (!stripe) {
      throw new Error('Stripe not loaded')
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: tipperName || 'Anonymous',
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    return {
      success: true,
      paymentIntent,
      paymentIntentId,
    }
  } catch (error) {
    console.error('Error processing payment:', error)
    throw error
  }
}

