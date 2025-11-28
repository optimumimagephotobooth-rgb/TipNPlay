import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import './CreateEvent.css'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE')

function CreateEventForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const cardElement = elements.getElement(CardElement)
      
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (stripeError) {
        setError(stripeError.message)
        setLoading(false)
        return
      }

      // Here you would typically send the paymentMethod.id to your backend
      // to create a payment intent and process the $6.00 fee
      console.log('Payment method created:', paymentMethod.id)
      
      // For now, we'll just show a success message
      alert('Payment processed successfully! Your event will be created.')
      
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="create-event-form">
      <div className="form-group">
        <label>Card Details</label>
        <div className="card-element-wrapper">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#fff',
                  '::placeholder': {
                    color: '#888',
                  },
                },
                invalid: {
                  color: '#fa755a',
                },
              },
            }}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={!stripe || loading}
      >
        {loading ? 'Processing...' : 'Pay $6.00'}
      </button>
    </form>
  )
}

function CreateEvent() {
  return (
    <div className="create-event-page">
      <div className="container">
        <div className="create-event-content">
          <h1>Create Your Event</h1>
          <p className="subtitle">Set up a tipping event for your next gig. $6.00 one-time fee.</p>
          
          <Elements stripe={stripePromise}>
            <CreateEventForm />
          </Elements>
        </div>
      </div>
    </div>
  )
}

export default CreateEvent

