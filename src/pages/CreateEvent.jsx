import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import QRCodeDisplay from '../components/QRCodeDisplay'
import QRCodeModal from '../components/QRCodeModal'
import ViralShare from '../components/ViralShare'
import { createEventCheckout } from '../utils/payments'
import { supabase, eventsTable } from '../lib/supabase'
import { sanitizeInput } from '../utils/sanitize'
import { trackEventCreation } from '../utils/analytics'
import { Toaster } from 'react-hot-toast'
import { notifySuccess, notifyError, guidedToast } from '../utils/toast'
import './CreateEvent.css'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE')

function CreateEventForm() {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(1) // 1: Event details, 2: Payment, 3: Success
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    event_date: '',
    event_time: '',
    end_time: '',
    primary_color: '#FFD700',
    secondary_color: '#000000',
    tip_presets: [1, 5, 10, 25],
    thank_you_message: 'Thank you for your tip! 🎉'
  })
  const [createdEvent, setCreatedEvent] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEventData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleColorChange = (colorType, color) => {
    setEventData(prev => ({
      ...prev,
      [colorType]: color
    }))
  }

  const handlePresetChange = (index, value) => {
    const newPresets = [...eventData.tip_presets]
    newPresets[index] = parseFloat(value) || 0
    setEventData(prev => ({
      ...prev,
      tip_presets: newPresets
    }))
  }

  const handleNext = () => {
    if (step === 1) {
      if (!eventData.name || !eventData.event_date) {
        notifyError('Please fill in all required fields')
        return
      }
      setStep(2)
    }
  }

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
        notifyError(stripeError.message)
        setLoading(false)
        return
      }

      // Sanitize and create event in database
      const eventPayload = {
        name: sanitizeInput(eventData.name),
        description: sanitizeInput(eventData.description || ''),
        event_date: eventData.event_date,
        event_time: eventData.event_time,
        end_time: eventData.end_time,
        custom_colors: {
          primary: eventData.primary_color,
          secondary: eventData.secondary_color
        },
        tip_presets: eventData.tip_presets,
        thank_you_message: sanitizeInput(eventData.thank_you_message || ''),
        created_at: new Date().toISOString()
      }

      const { data, error: dbError } = await supabase
        .from(eventsTable)
        .insert([eventPayload])
        .select()
        .single()

      let finalEvent = data

      if (dbError) {
        finalEvent = {
          id: `event_${Date.now()}`,
          ...eventPayload,
        }
      } else {
        trackEventCreation(data.id, data.name)
      }

      setCreatedEvent(finalEvent)

      // In production, process $6.00 payment here
      console.log('Payment method created:', paymentMethod.id)
      
      notifySuccess('Event created successfully!')
      guidedToast('Share your new TipNPlay link with guests', {
        type: 'success',
        actionLabel: 'View Tip Page',
        onAction: () => navigate(`/tip/${finalEvent.id}`),
      })
      setStep(3)
      
    } catch (err) {
      setError('An error occurred. Please try again.')
      notifyError('Error creating event')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const tipUrl = createdEvent ? `${window.location.origin}/tip/${createdEvent.id}` : ''

  if (step === 3 && createdEvent) {
    return (
      <div className="success-step">
        <Toaster />
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h2>Event Created Successfully!</h2>
          <p>Your tipping page is ready. Share the link or QR code below.</p>
          
          <div className="event-link-section">
            <label>Your Tipping Page URL:</label>
            <div className="link-container">
              <input type="text" value={tipUrl} readOnly />
              <button 
              onClick={() => {
                navigator.clipboard.writeText(tipUrl)
                notifySuccess('Link copied! Share with your crowd!')
              }}
                className="copy-btn"
              >
                Copy
              </button>
            </div>
          </div>

          <ViralShare
            url={tipUrl}
            title={`Support ${createdEvent.name || 'this event'}!`}
            description={`Join ${createdEvent.name || 'this event'} and show your support! 🎉`}
            eventName={createdEvent.name}
            showQR={true}
            onShare={(platform) => {
              // Track share analytics
              console.log(`Shared to ${platform}`)
            }}
          />

          <div className="qr-section">
            <QRCodeDisplay
              value={tipUrl}
              size={250}
              title="Share Your Tipping Page"
              showDownload={true}
              eventName={createdEvent.name || createdEvent.id}
              customColors={{
                fgColor: eventData.primary_color || '#000000',
                bgColor: '#FFFFFF'
              }}
            />
          </div>

          <div className="success-actions">
            <button 
              onClick={() => navigate(`/tip/${createdEvent.id}`)}
              className="btn btn-primary"
            >
              View Tipping Page
            </button>
            <button 
              onClick={() => navigate('/dj-dashboard')}
              className="btn btn-secondary"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Toaster />
      <div className="create-event-steps">
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Event Details</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Payment</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Success</div>
        </div>

        {step === 1 && (
          <div className="event-details-step">
            <h2>Event Details</h2>
            
            <div className="form-group">
              <label>Event Name *</label>
              <input
                type="text"
                name="name"
                value={eventData.name}
                onChange={handleInputChange}
                placeholder="e.g., Summer Festival 2024"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={eventData.description}
                onChange={handleInputChange}
                placeholder="Tell your audience about this event..."
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Event Date *</label>
                <input
                  type="date"
                  name="event_date"
                  value={eventData.event_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  name="event_time"
                  value={eventData.event_time}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  name="end_time"
                  value={eventData.end_time}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tip Amount Presets</label>
              <div className="presets-grid">
                {eventData.tip_presets.map((preset, index) => (
                  <input
                    key={index}
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={preset}
                    onChange={(e) => handlePresetChange(index, e.target.value)}
                    placeholder="0.00"
                  />
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Primary Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    value={eventData.primary_color}
                    onChange={(e) => handleColorChange('primary_color', e.target.value)}
                  />
                  <input
                    type="text"
                    value={eventData.primary_color}
                    onChange={(e) => handleColorChange('primary_color', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Secondary Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    value={eventData.secondary_color}
                    onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                  />
                  <input
                    type="text"
                    value={eventData.secondary_color}
                    onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Thank You Message</label>
              <input
                type="text"
                name="thank_you_message"
                value={eventData.thank_you_message}
                onChange={handleInputChange}
                placeholder="Thank you for your tip! 🎉"
              />
            </div>

            <button onClick={handleNext} className="btn btn-primary">
              Continue to Payment
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="payment-step">
            <h2>Payment</h2>
            <p className="payment-info">One-time setup fee: $6.00</p>

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

            <div className="payment-actions">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary"
              >
                Back
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!stripe || loading}
              >
                {loading ? 'Processing...' : 'Pay $6.00 & Create Event'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

function CreateEvent() {
  return (
    <div className="create-event-page">
      <div className="container">
        <div className="create-event-content">
          <Elements stripe={stripePromise}>
            <CreateEventForm />
          </Elements>
        </div>
      </div>
    </div>
  )
}

export default CreateEvent
