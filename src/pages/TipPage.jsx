import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { supabase, eventsTable, tipsTable } from '../lib/supabase'
import './TipPage.css'

function TipPage() {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tipping, setTipping] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [customAmount, setCustomAmount] = useState('')
  const [tipperName, setTipperName] = useState('')
  const [tipperMessage, setTipperMessage] = useState('')
  const [totalTips, setTotalTips] = useState(0)
  const [tipCount, setTipCount] = useState(0)
  const [recentTips, setRecentTips] = useState([])

  const presetAmounts = [1, 5, 10, 25, 50, 100]

  useEffect(() => {
    loadEvent()
    loadTips()
    
    // Subscribe to real-time tip updates
    const tipsChannel = supabase
      .channel(`tips:${eventId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: tipsTable, filter: `event_id=eq.${eventId}` },
        (payload) => {
          setTotalTips(prev => prev + parseFloat(payload.new.amount))
          setTipCount(prev => prev + 1)
          setRecentTips(prev => [payload.new, ...prev.slice(0, 4)])
          triggerConfetti()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(tipsChannel)
    }
  }, [eventId])

  const loadEvent = async () => {
    try {
      const { data, error } = await supabase
        .from(eventsTable)
        .select('*')
        .eq('id', eventId)
        .single()

      if (error) throw error
      setEvent(data)
    } catch (error) {
      console.error('Error loading event:', error)
      // Fallback to demo event if Supabase not configured
      setEvent({
        id: eventId,
        name: 'Live DJ Set',
        description: 'Support the DJ with a tip!',
        custom_colors: { primary: '#FFD700', secondary: '#000' }
      })
    } finally {
      setLoading(false)
    }
  }

  const loadTips = async () => {
    try {
      const { data, error } = await supabase
        .from(tipsTable)
        .select('amount, created_at, tipper_name, message')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      
      const total = data.reduce((sum, tip) => sum + parseFloat(tip.amount), 0)
      setTotalTips(total)
      setTipCount(data.length)
      setRecentTips(data.slice(0, 5))
    } catch (error) {
      console.error('Error loading tips:', error)
    }
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const handleTip = async (e) => {
    e.preventDefault()
    
    const amount = selectedAmount || parseFloat(customAmount)
    if (!amount || amount <= 0) {
      alert('Please select or enter a tip amount')
      return
    }

    setTipping(true)

    try {
      // In production, you'd process payment via Stripe here
      // For now, we'll simulate a successful tip
      
      const tipData = {
        event_id: eventId,
        amount: amount.toFixed(2),
        tipper_name: tipperName || 'Anonymous',
        message: tipperMessage,
        created_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from(tipsTable)
        .insert([tipData])

      if (error) throw error

      // Update local state
      setTotalTips(prev => prev + amount)
      setTipCount(prev => prev + 1)
      setRecentTips(prev => [tipData, ...prev.slice(0, 4)])
      
      triggerConfetti()

      // Reset form
      setSelectedAmount(null)
      setCustomAmount('')
      setTipperName('')
      setTipperMessage('')

      alert(`Thank you for your $${amount.toFixed(2)} tip! 🎉`)
    } catch (error) {
      console.error('Error processing tip:', error)
      alert('Error processing tip. Please try again.')
    } finally {
      setTipping(false)
    }
  }

  if (loading) {
    return (
      <div className="tip-page">
        <div className="loading">Loading event...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="tip-page">
        <div className="error">Event not found</div>
      </div>
    )
  }

  const primaryColor = event.custom_colors?.primary || '#FFD700'
  const secondaryColor = event.custom_colors?.secondary || '#000'

  return (
    <div className="tip-page" style={{ '--primary-color': primaryColor, '--secondary-color': secondaryColor }}>
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
              {presetAmounts.map(amount => (
                <button
                  key={amount}
                  type="button"
                  className={`preset-btn ${selectedAmount === amount ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedAmount(amount)
                    setCustomAmount('')
                  }}
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
                  setCustomAmount(e.target.value)
                  setSelectedAmount(null)
                }}
              />
            </div>
          </div>

          <div className="tipper-info">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={tipperName}
              onChange={(e) => setTipperName(e.target.value)}
            />
            <textarea
              placeholder="Leave a message (optional)"
              value={tipperMessage}
              onChange={(e) => setTipperMessage(e.target.value)}
              rows="3"
            />
          </div>

          <button 
            type="submit" 
            className="tip-submit-btn"
            disabled={tipping || (!selectedAmount && !customAmount)}
          >
            {tipping ? 'Processing...' : `Send Tip $${(selectedAmount || parseFloat(customAmount) || 0).toFixed(2)}`}
          </button>
        </form>

        {recentTips.length > 0 && (
          <div className="recent-tips">
            <h3>Recent Tips</h3>
            <div className="tips-list">
              {recentTips.map((tip, index) => (
                <div key={index} className="tip-item">
                  <div className="tip-item-header">
                    <span className="tipper-name">{tip.tipper_name || 'Anonymous'}</span>
                    <span className="tip-amount">${parseFloat(tip.amount).toFixed(2)}</span>
                  </div>
                  {tip.message && <div className="tip-message">{tip.message}</div>}
                  <div className="tip-time">{new Date(tip.created_at).toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TipPage

