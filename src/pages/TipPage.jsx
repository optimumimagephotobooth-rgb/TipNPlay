import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import confetti from 'canvas-confetti'
import toast, { Toaster } from 'react-hot-toast'
import { supabase, eventsTable, tipsTable } from '../lib/supabase'
import SocialProof from '../components/SocialProof'
import ViralShare from '../components/ViralShare'
import LiveReactions from '../components/LiveReactions'
import TipStreak from '../components/TipStreak'
import TipLeaderboard from '../components/TipLeaderboard'
import TipGoals from '../components/TipGoals'
import TrendingBadge from '../components/TrendingBadge'
import { celebrateTip } from '../components/TipAnimations'
import { sanitizeInput } from '../utils/sanitize'
import { trackTip } from '../utils/analytics'
import './TipPage.css'

// Cache for event data (5 minutes)
const eventCache = new Map()
const CACHE_DURATION = 5 * 60 * 1000

function TipPageContent() {
  const stripe = useStripe()
  const elements = useElements()
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tipping, setTipping] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [customAmount, setCustomAmount] = useState('')
  const [tipperName, setTipperName] = useState('')
  const [tipperMessage, setTipperMessage] = useState('')
  const [totalTips, setTotalTips] = useState(0)
  const [tipCount, setTipCount] = useState(0)
  const [recentTips, setRecentTips] = useState([])
  const [tipsLoading, setTipsLoading] = useState(true)

  const presetAmounts = useMemo(() => [1, 5, 10, 25, 50, 100], [])

  // Optimized event loading with caching
  const loadEvent = useCallback(async () => {
    // Check cache first
    const cached = eventCache.get(eventId)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setEvent(cached.data)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from(eventsTable)
        .select('*')
        .eq('id', eventId)
        .single()

      if (error) throw error
      
      // Cache the result
      eventCache.set(eventId, { data, timestamp: Date.now() })
      setEvent(data)
    } catch (error) {
      console.error('Error loading event:', error)
      // Fallback to demo event if Supabase not configured
      const fallbackEvent = {
        id: eventId,
        name: 'Live DJ Set',
        description: 'Support the DJ with a tip!',
        custom_colors: { primary: '#FFD700', secondary: '#000' },
        tip_presets: [1, 5, 10, 25]
      }
      setEvent(fallbackEvent)
      eventCache.set(eventId, { data: fallbackEvent, timestamp: Date.now() })
    } finally {
      setLoading(false)
    }
  }, [eventId])

  // Optimized tips loading
  const loadTips = useCallback(async () => {
    setTipsLoading(true)
    try {
      const { data, error } = await supabase
        .from(tipsTable)
        .select('amount, created_at, tipper_name, message')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      
      if (data && data.length > 0) {
        const total = data.reduce((sum, tip) => sum + parseFloat(tip.amount || 0), 0)
        setTotalTips(total)
        setTipCount(data.length)
        setRecentTips(data.slice(0, 5))
      }
    } catch (error) {
      console.error('Error loading tips:', error)
      // Don't show error to user, just use empty state
    } finally {
      setTipsLoading(false)
    }
  }, [eventId])

  // Real-time subscription setup
  useEffect(() => {
    loadEvent()
    loadTips()
    
    // Subscribe to real-time tip updates (only if Supabase configured)
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co') {
      const tipsChannel = supabase
        .channel(`tips:${eventId}`)
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: tipsTable, 
            filter: `event_id=eq.${eventId}` 
          },
          (payload) => {
            const newTip = payload.new
            const tipAmount = parseFloat(newTip.amount || 0)
            setTotalTips(prev => prev + tipAmount)
            setTipCount(prev => prev + 1)
            setRecentTips(prev => [newTip, ...prev.slice(0, 4)])
            triggerConfetti(tipAmount)
            toast.success(`New tip: $${tipAmount.toFixed(2)}! 🎉`)
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(tipsChannel)
      }
    }
  }, [eventId, loadEvent, loadTips])

  const triggerConfetti = useCallback((amount) => {
    // Use enhanced celebration based on tip amount
    celebrateTip(amount || 0)
  }, [])

  // Form submission - payment handled by TipPaymentForm
  const handleTip = (e) => {
    e.preventDefault()
    // Amount validation happens before showing payment form
  }

  const amount = selectedAmount || parseFloat(customAmount) || 0

  // Use event's custom tip presets if available
  const displayPresets = useMemo(() => {
    return event?.tip_presets && Array.isArray(event.tip_presets) && event.tip_presets.length > 0
      ? event.tip_presets
      : presetAmounts
  }, [event, presetAmounts])

  if (loading) {
    return (
      <div className="tip-page">
        <Toaster />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading event...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="tip-page">
        <Toaster />
        <div className="error-container">
          <h2>Event Not Found</h2>
          <p>The event you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  const primaryColor = event.custom_colors?.primary || '#FFD700'
  const secondaryColor = event.custom_colors?.secondary || '#000'

  return (
    <div className="tip-page" style={{ '--primary-color': primaryColor, '--secondary-color': secondaryColor }}>
      <Toaster position="top-center" />
      <div className="tip-container">
        <div className="event-header">
          <div className="event-header-top">
            <h1>{sanitizeInput(event.name)}</h1>
            <TrendingBadge isTrending={tipCount > 10 || totalTips > 100} />
          </div>
          {event.description && <p className="event-description">{sanitizeInput(event.description)}</p>}
        </div>

        {/* Live Reactions Overlay */}
        <LiveReactions eventId={eventId} />

        {/* Simple Stats */}
        <div className="tip-stats-simple">
          <div className="stat-simple">
            <span className="stat-icon">💰</span>
            <div>
              <div className="stat-label-simple">Total</div>
              <div className="stat-value-simple">${totalTips.toFixed(2)}</div>
            </div>
          </div>
          <div className="stat-simple">
            <span className="stat-icon">🎁</span>
            <div>
              <div className="stat-label-simple">Tips</div>
              <div className="stat-value-simple">{tipCount}</div>
            </div>
          </div>
        </div>

        {/* Simple Instructions */}
        <div className="tip-instructions">
          <p>💡 <strong>Super Easy:</strong> Select amount → Enter name (optional) → Tap tip!</p>
        </div>

        <form onSubmit={handleTip} className="tip-form-simple">
          {/* Amount Selection - Big, Clear Buttons */}
          <div className="amount-selection-simple">
            <label className="section-label">💰 Choose Amount</label>
            <div className="preset-amounts-simple">
              {displayPresets.map((amount, index) => (
                <button
                  key={`${amount}-${index}`}
                  type="button"
                  className={`preset-btn-simple ${selectedAmount === amount ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedAmount(amount)
                    setCustomAmount('')
                  }}
                  disabled={tipping}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <div className="custom-amount-simple">
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Or enter custom $ amount"
                value={customAmount}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
                    setCustomAmount(value)
                    setSelectedAmount(null)
                  }
                }}
                disabled={tipping}
                className="custom-input-simple"
              />
            </div>
          </div>

          {/* Optional Info - Collapsed by Default */}
          <details className="optional-info">
            <summary>💬 Add name or message (optional)</summary>
            <div className="tipper-info-simple">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={tipperName}
                onChange={(e) => setTipperName(e.target.value)}
                maxLength={50}
                disabled={tipping}
              />
              <textarea
                placeholder="Leave a message (optional)"
                value={tipperMessage}
                onChange={(e) => setTipperMessage(e.target.value)}
                rows="2"
                maxLength={200}
                disabled={tipping}
              />
            </div>
          </details>

          {/* Big Submit Button */}
          <button 
            type="submit" 
            className="tip-submit-btn-simple"
            disabled={tipping || (!selectedAmount && !customAmount)}
          >
            {tipping ? (
              <>
                <span className="spinner-small"></span>
                Processing...
              </>
            ) : (
              <>
                <span className="tip-icon-large">💝</span>
                Send ${(selectedAmount || parseFloat(customAmount) || 0).toFixed(2)} Tip
              </>
            )}
          </button>

          {/* Security Note */}
          <p className="security-note">
            🔒 Secure payment powered by Stripe
          </p>
        </form>

        {!tipsLoading && (
          <>
            {/* Gamification Features */}
            <TipStreak eventId={eventId} />
            <TipGoals currentAmount={totalTips} />
            <TipLeaderboard eventId={eventId} limit={5} />

            <SocialProof
              recentTips={recentTips}
              totalTips={totalTips}
              tipCount={tipCount}
              showLiveCounter={true}
            />

            <ViralShare
              url={`${window.location.origin}/tip/${eventId}`}
              title={`Support ${event?.name || 'this event'}!`}
              description={`Join ${event?.name || 'this event'} and show your support! 🎉`}
              eventName={event?.name}
              showQR={false}
              onShare={(platform) => {
                console.log(`Shared to ${platform}`)
              }}
            />

            {/* Become a DJ CTA */}
            <div className="become-dj-cta">
              <div className="become-dj-icon">🎵</div>
              <h3>Want to Accept Tips Too?</h3>
              <p>Create your own tipping page in seconds - it's free!</p>
              <a
                href={`${window.location.origin}/signup`}
                className="become-dj-btn"
              >
                Sign Up Free - Start Earning
              </a>
              <p className="become-dj-note">Join 1000+ DJs already using TipNPlay!</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Wrap with Stripe Elements provider
function TipPage() {
  return (
    <Elements stripe={stripePromise}>
      <TipPageContent />
    </Elements>
  )
}

export default TipPage
