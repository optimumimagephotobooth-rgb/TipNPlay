import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, eventsTable } from '../lib/supabase'
import LiveStreamOverlay from '../components/LiveStreamOverlay'
import AnimatedButton from '../components/AnimatedButton'
import FadeIn from '../components/FadeIn'
import toast from 'react-hot-toast'
import './LiveStreamSetup.css'

/**
 * SUPER SIMPLE Live Stream Setup
 * One-click setup for TikTok/Instagram Live
 */
function LiveStreamSetup() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/login')
        return
      }

      const { data, error } = await supabase
        .from(eventsTable)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setEvents(data || [])
      
      // Auto-select first event
      if (data && data.length > 0) {
        setSelectedEvent(data[0])
      }
    } catch (error) {
      console.error('Error loading events:', error)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const getTipUrl = (eventId) => {
    return `${window.location.origin}/tip/${eventId}`
  }

  const handleQuickStart = () => {
    if (!selectedEvent) {
      toast.error('Please create an event first')
      navigate('/create-event')
      return
    }

    // Copy tip link automatically
    const tipLink = getTipUrl(selectedEvent.id)
    navigator.clipboard.writeText(tipLink)
    
    // Show overlay
    setShowOverlay(true)
    
    toast.success('Tip link copied! Share it in your live chat 🎉', {
      duration: 5000,
    })
  }

  if (loading) {
    return (
      <div className="live-stream-setup">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="live-stream-setup">
      <FadeIn>
        <div className="setup-header-simple">
          <h1>🎥 Go Live in 30 Seconds</h1>
          <p>Accept tips during your TikTok/Instagram Live streams</p>
        </div>
      </FadeIn>

      {events.length === 0 ? (
        <FadeIn delay={0.1}>
          <div className="no-events-simple">
            <div className="no-events-icon">🎵</div>
            <h2>Create Your First Event</h2>
            <p>It takes just 30 seconds!</p>
            <AnimatedButton
              to="/create-event"
              variant="primary"
              className="big-button"
            >
              ➕ Create Event Now
            </AnimatedButton>
          </div>
        </FadeIn>
      ) : (
        <>
          {/* ONE-CLICK QUICK START */}
          <FadeIn delay={0.1}>
            <div className="quick-start-card">
              <div className="quick-start-header">
                <h2>⚡ Quick Start</h2>
                <span className="time-badge">30 seconds</span>
              </div>
              
              {selectedEvent && (
                <div className="selected-event-display">
                  <div className="event-name-badge">
                    🎵 {selectedEvent.name}
                  </div>
                </div>
              )}

              <div className="quick-start-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <strong>Start your TikTok/Instagram Live</strong>
                    <span>Open TikTok or Instagram and go live</span>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <strong>Click "Start Overlay" below</strong>
                    <span>Tip link is copied automatically!</span>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <strong>Share the link in your chat</strong>
                    <span>Paste it in your live stream chat</span>
                  </div>
                </div>
              </div>

              <AnimatedButton
                onClick={handleQuickStart}
                variant="primary"
                className="big-button quick-start-btn"
                disabled={!selectedEvent}
              >
                {showOverlay ? '✅ Overlay Active!' : '🚀 Start Overlay'}
              </AnimatedButton>

              {selectedEvent && (
                <div className="tip-link-display">
                  <p className="tip-link-label">Your Tip Link (auto-copied):</p>
                  <div className="tip-link-box-simple">
                    <code>{getTipUrl(selectedEvent.id)}</code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getTipUrl(selectedEvent.id))
                        toast.success('Link copied again! 📋')
                      }}
                      className="copy-btn-small"
                      title="Copy again"
                    >
                      📋
                    </button>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Event Selector (Only if multiple events) */}
          {events.length > 1 && (
            <FadeIn delay={0.2}>
              <div className="event-selector-simple">
                <label>Using a different event?</label>
                <select
                  value={selectedEvent?.id || ''}
                  onChange={(e) => {
                    const event = events.find(ev => ev.id === e.target.value)
                    setSelectedEvent(event)
                  }}
                  className="event-select-simple"
                >
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
                </select>
              </div>
            </FadeIn>
          )}

          {/* Help Section */}
          <FadeIn delay={0.3}>
            <div className="help-section">
              <h3>💡 Need Help?</h3>
              <div className="help-items">
                <div className="help-item">
                  <strong>Where does the overlay appear?</strong>
                  <p>It appears on your screen (not in the stream). Position it where viewers can see it!</p>
                </div>
                <div className="help-item">
                  <strong>How do viewers tip?</strong>
                  <p>They click the link you share in chat, then tip on the page that opens.</p>
                </div>
                <div className="help-item">
                  <strong>Can I move the overlay?</strong>
                  <p>Yes! Drag it anywhere on your screen. It stays in place.</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </>
      )}

      {/* Live Stream Overlay */}
      {showOverlay && selectedEvent && (
        <LiveStreamOverlay
          eventId={selectedEvent.id}
          eventName={selectedEvent.name}
          position="bottom-right"
        />
      )}
    </div>
  )
}

export default LiveStreamSetup
