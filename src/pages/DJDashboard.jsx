import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { supabase, eventsTable, tipsTable } from '../lib/supabase'
import QRCodeDisplay from '../components/QRCodeDisplay'
import QRCodeModal from '../components/QRCodeModal'
import AnimatedButton from '../components/AnimatedButton'
import FadeIn from '../components/FadeIn'
import TipNotifications from '../components/TipNotifications'
import { notifySuccess } from '../utils/toast'
import './DJDashboard.css'

function DJDashboard() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [stats, setStats] = useState({ total: 0, count: 0, today: 0 })
  const [showQRModal, setShowQRModal] = useState(false)
  const [recentTips, setRecentTips] = useState([])

  useEffect(() => {
    loadDashboard()
  }, [])

  useEffect(() => {
    if (selectedEvent) {
      loadEventStats(selectedEvent.id)
    }
  }, [selectedEvent])

  const loadDashboard = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/login')
        return
      }

      // Load events
      const { data: eventsData, error: eventsError } = await supabase
        .from(eventsTable)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (eventsError) throw eventsError

      setEvents(eventsData || [])
      
      if (eventsData && eventsData.length > 0) {
        setSelectedEvent(eventsData[0])
      }

      // Load all-time stats
      const { data: tipsData } = await supabase
        .from(tipsTable)
        .select('amount, created_at, event_id')
        .in('event_id', eventsData?.map(e => e.id) || [])

      if (tipsData) {
        const total = tipsData.reduce((sum, tip) => sum + parseFloat(tip.amount || 0), 0)
        const today = new Date().toDateString()
        const todayTips = tipsData.filter(tip => 
          new Date(tip.created_at).toDateString() === today
        )
        const todayTotal = todayTips.reduce((sum, tip) => sum + parseFloat(tip.amount || 0), 0)

        setStats({
          total: total,
          count: tipsData.length,
          today: todayTotal
        })

        // Recent tips
        setRecentTips(tipsData.slice(-5).reverse())
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadEventStats = async (eventId) => {
    try {
      const { data } = await supabase
        .from(tipsTable)
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) {
        setRecentTips(data)
      }
    } catch (error) {
      console.error('Error loading event stats:', error)
    }
  }

  const getTipUrl = (eventId) => {
    return `${window.location.origin}/tip/${eventId}`
  }

  const copyLink = (eventId) => {
    navigator.clipboard.writeText(getTipUrl(eventId))
    notifySuccess('Link copied! Share it with your audience 🎉')
  }

  if (loading) {
    return (
      <div className="dj-dashboard-loading">
        <div className="loading-spinner-large"></div>
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dj-dashboard-simple">
      {/* Hero Stats Section */}
      <FadeIn>
        <div className="dashboard-hero">
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-label">Total Earned</div>
                <div className="stat-value">${stats.total.toFixed(2)}</div>
              </div>
            </div>
            <div className="hero-stat">
              <div className="stat-icon">🎁</div>
              <div className="stat-content">
                <div className="stat-label">Total Tips</div>
                <div className="stat-value">{stats.count}</div>
              </div>
            </div>
            <div className="hero-stat highlight">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <div className="stat-label">Today</div>
                <div className="stat-value">${stats.today.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Quick Actions */}
      <FadeIn delay={0.1}>
        <div className="quick-actions">
          <AnimatedButton
            to="/create-event"
            variant="primary"
            className="action-btn primary-action"
          >
            ➕ Create New Event
          </AnimatedButton>
          <AnimatedButton
            to="/live-stream-setup"
            variant="primary"
            className="action-btn live-stream-btn"
          >
            🎥 Live Stream Setup
          </AnimatedButton>
          {selectedEvent && (
            <>
              <AnimatedButton
                onClick={() => copyLink(selectedEvent.id)}
                variant="secondary"
                className="action-btn"
              >
                📋 Copy Link
              </AnimatedButton>
              <AnimatedButton
                onClick={() => setShowQRModal(true)}
                variant="secondary"
                className="action-btn"
              >
                📱 Show QR Code
              </AnimatedButton>
            </>
          )}
        </div>
      </FadeIn>

      {/* Events Grid */}
      <FadeIn delay={0.2}>
        <div className="events-section-simple">
          <h2>Your Events</h2>
          {events.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎵</div>
              <h3>No events yet</h3>
              <p>Create your first event to start accepting tips!</p>
              <AnimatedButton
                to="/create-event"
                variant="primary"
                className="empty-action"
              >
                Create Your First Event
              </AnimatedButton>
            </div>
          ) : (
            <div className="events-grid-simple">
              {events.map(event => (
                <div
                  key={event.id}
                  className={`event-card-simple ${selectedEvent?.id === event.id ? 'active' : ''}`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="event-header-simple">
                    <h3>{event.name}</h3>
                    <span className="event-date-simple">
                      {format(new Date(event.created_at || Date.now()), 'MMM dd')}
                    </span>
                  </div>
                  <div className="event-actions-simple">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        copyLink(event.id)
                      }}
                      className="btn-icon"
                      title="Copy link"
                    >
                      🔗
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedEvent(event)
                        setShowQRModal(true)
                      }}
                      className="btn-icon"
                      title="Show QR code"
                    >
                      📱
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/tip/${event.id}`)
                      }}
                      className="btn-icon"
                      title="View page"
                    >
                      👁️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeIn>

      {/* Selected Event Details */}
      {selectedEvent && (
        <FadeIn delay={0.3}>
          <div className="event-details-simple">
            <div className="details-header">
              <h2>{selectedEvent.name}</h2>
              <div className="share-buttons-simple">
                <button
                  onClick={() => {
                    const url = getTipUrl(selectedEvent.id)
                    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out my tipping page: ${url}`)}`, '_blank')
                  }}
                  className="share-btn whatsapp"
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => {
                    const url = getTipUrl(selectedEvent.id)
                    navigator.clipboard.writeText(url)
                    notifySuccess('Link copied! Share anywhere 🚀')
                  }}
                  className="share-btn copy"
                >
                  Copy Link
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div className="qr-section-simple">
              <QRCodeDisplay
                value={getTipUrl(selectedEvent.id)}
                size={200}
              />
              <p className="qr-hint">Scan to tip instantly!</p>
            </div>

            {/* Recent Tips */}
            {recentTips.length > 0 && (
              <div className="recent-tips-simple">
                <h3>Recent Tips 💝</h3>
                <div className="tips-list">
                  {recentTips.map(tip => (
                    <div key={tip.id} className="tip-item">
                      <div className="tip-amount">${parseFloat(tip.amount || 0).toFixed(2)}</div>
                      <div className="tip-info">
                        <div className="tip-name">{tip.tipper_name || 'Anonymous'}</div>
                        {tip.message && <div className="tip-message">"{tip.message}"</div>}
                        <div className="tip-time">{format(new Date(tip.created_at), 'MMM dd, h:mm a')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FadeIn>
      )}

      {/* Upgrade Prompt - Only show if user has events */}
      {events.length > 0 && (
        <FadeIn delay={0.4}>
          <div className="upgrade-prompt">
            <div className="upgrade-content">
              <div className="upgrade-badge-top">✨ PRO</div>
              <h3>🚀 Unlock More Features</h3>
              <p>You're doing great! Upgrade to get:</p>
              <ul className="upgrade-list">
                <li>✅ Unlimited events (no limits!)</li>
                <li>✅ Advanced analytics & reports</li>
                <li>✅ Custom branding & themes</li>
                <li>✅ Email notifications</li>
                <li>✅ Priority support</li>
              </ul>
              <AnimatedButton
                variant="primary"
                className="upgrade-btn"
                onClick={() => {
                  notifySuccess('Redirecting to upgrade... 🎉')
                  // In production, redirect to payment/subscription page
                }}
              >
                Upgrade Now - Starting at $9.99/mo
              </AnimatedButton>
              <p className="upgrade-social-proof">Join 1000+ DJs already using TipNPlay Pro!</p>
            </div>
          </div>
        </FadeIn>
      )}

      {/* QR Modal */}
      {showQRModal && selectedEvent && (
        <QRCodeModal
          value={getTipUrl(selectedEvent.id)}
          eventName={selectedEvent.name}
          onClose={() => setShowQRModal(false)}
        />
      )}

      {/* Tip Notifications (TikTok-style) */}
      {selectedEvent && (
        <TipNotifications
          eventId={selectedEvent.id}
          onTipReceived={(notification) => {
            // Refresh stats when tip received
            loadDashboard()
          }}
        />
      )}
    </div>
  )
}

export default DJDashboard
