import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { useParams } from 'react-router-dom'
import confetti from 'canvas-confetti'
import toast, { Toaster } from 'react-hot-toast'
import { supabase, eventsTable, tipsTable } from '../lib/supabase'
import './TipPage.css'

// Cache for event data (5 minutes)
const eventCache = new Map()
const CACHE_DURATION = 5 * 60 * 1000

function TipPage() {
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
            setTotalTips(prev => prev + parseFloat(newTip.amount || 0))
            setTipCount(prev => prev + 1)
            setRecentTips(prev => [newTip, ...prev.slice(0, 4)])
            triggerConfetti()
            toast.success(`New tip: $${parseFloat(newTip.amount).toFixed(2)}! 🎉`)
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(tipsChannel)
      }
    }
  }, [eventId, loadEvent, loadTips])

  const triggerConfetti = useCallback(() => {
    // Use requestAnimationFrame for smooth animation
    requestAnimationFrame(() => {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#25D366', '#FF6B6B'],
        disableForReducedMotion: true // Respect user preferences
      })
    })
  }, [])

  const handleTip = async (e) => {
    e.preventDefault()
    
    const amount = selectedAmount || parseFloat(customAmount)
    if (!amount || amount <= 0) {
      toast.error('Please select or enter a tip amount')
      return
    }

    if (amount < 0.01) {
      toast.error('Minimum tip amount is $0.01')
      return
    }

    setTipping(true)

    try {
      const tipData = {
        event_id: eventId,
        amount: amount.toFixed(2),
        tipper_name: tipperName.trim() || 'Anonymous',
        message: tipperMessage.trim() || null,
        created_at: new Date().toISOString(),
        status: 'completed'
      }

      // Try to save to database
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co') {
        const { error } = await supabase
          .from(tipsTable)
          .insert([tipData])

        if (error) throw error
      }

      // Update local state immediately (optimistic update)
      setTotalTips(prev => prev + amount)
      setTipCount(prev => prev + 1)
      setRecentTips(prev => [tipData, ...prev.slice(0, 4)])
      
      triggerConfetti()
      toast.success(`Thank you for your $${amount.toFixed(2)} tip! 🎉`, {
        duration: 4000,
        icon: '🎉'
      })

      // Reset form
      setSelectedAmount(null)
      setCustomAmount('')
      setTipperName('')
      setTipperMessage('')

      // In production, process Stripe payment here
      // await processStripePayment(amount, tipData)
      
    } catch (error) {
      console.error('Error processing tip:', error)
      toast.error('Error processing tip. Please try again.')
      // Revert optimistic update
      setTotalTips(prev => prev - amount)
      setTipCount(prev => prev - 1)
    } finally {
      setTipping(false)
    }
  }

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
          <h1>{event.name}</h1>
          {event.description && <p className="event-description">{event.description}</p>}
        </div>

        <div className="tip-stats">
          <div className="stat">
            <div className="stat-label">Total Tips</div>
            <div className="stat-value">${totalTips.toFixed(2)}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Tip Count</div>
            <div className="stat-value">{tipCount}</div>
          </div>
        </div>

        <form onSubmit={handleTip} className="tip-form">
          <div className="amount-selection">
            <label>Select Amount</label>
            <div className="preset-amounts">
              {displayPresets.map((amount, index) => (
                <button
                  key={`${amount}-${index}`}
                  type="button"
                  className={`preset-btn ${selectedAmount === amount ? 'active' : ''}`}
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
            <div className="custom-amount">
              <label>Or enter custom amount</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={customAmount}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
                    setCustomAmount(value)
                    setSelectedAmount(null)
                  }
                }}
                disabled={tipping}
              />
            </div>
          </div>

          <div className="tipper-info">
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
              rows="3"
              maxLength={200}
              disabled={tipping}
            />
          </div>

          <button 
            type="submit" 
            className="tip-submit-btn"
            disabled={tipping || (!selectedAmount && !customAmount)}
          >
            {tipping ? (
              <>
                <span className="spinner-small"></span>
                Processing...
              </>
            ) : (
              `Send Tip $${(selectedAmount || parseFloat(customAmount) || 0).toFixed(2)}`
            )}
          </button>
        </form>

        {tipsLoading ? (
          <div className="recent-tips">
            <h3>Recent Tips</h3>
            <div className="loading-tips">Loading tips...</div>
          </div>
        ) : recentTips.length > 0 ? (
          <div className="recent-tips">
            <h3>Recent Tips</h3>
            <div className="tips-list">
              {recentTips.map((tip, index) => (
                <div key={tip.id || index} className="tip-item">
                  <div className="tip-item-header">
                    <span className="tipper-name">{tip.tipper_name || 'Anonymous'}</span>
                    <span className="tip-amount">${parseFloat(tip.amount || 0).toFixed(2)}</span>
                  </div>
                  {tip.message && <div className="tip-message">{tip.message}</div>}
                  <div className="tip-time">
                    {tip.created_at ? new Date(tip.created_at).toLocaleTimeString() : 'Just now'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default TipPage
