import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
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
      const { createPaymentIntent } = await import('../utils/payments')
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

