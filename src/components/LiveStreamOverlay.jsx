import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, tipsTable } from '../lib/supabase'
import QRCodeDisplay from './QRCodeDisplay'
import './LiveStreamOverlay.css'

/**
 * Live Stream Overlay Component
 * Displays on TikTok/Instagram live streams to show tips, QR code, and tip link
 */
function LiveStreamOverlay({ eventId, eventName, position = 'bottom-right' }) {
  const [recentTips, setRecentTips] = useState([])
  const [totalTips, setTotalTips] = useState(0)
  const [showQR, setShowQR] = useState(false)
  const [tipUrl, setTipUrl] = useState('')

  useEffect(() => {
    if (eventId) {
      setTipUrl(`${window.location.origin}/tip/${eventId}`)
      loadTips()
      subscribeToTips()
    }
  }, [eventId])

  const loadTips = async () => {
    try {
      const { data } = await supabase
        .from(tipsTable)
        .select('amount, tipper_name, created_at')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (data) {
        setRecentTips(data)
        const total = data.reduce((sum, tip) => sum + parseFloat(tip.amount || 0), 0)
        setTotalTips(total)
      }
    } catch (error) {
      console.error('Error loading tips:', error)
    }
  }

  const subscribeToTips = () => {
    const channel = supabase
      .channel(`tips-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: tipsTable,
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const newTip = payload.new
          setRecentTips(prev => [newTip, ...prev.slice(0, 4)])
          setTotalTips(prev => prev + parseFloat(newTip.amount || 0))
          
          // Show tip notification
          showTipNotification(newTip)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const showTipNotification = (tip) => {
    // Create floating tip notification
    const notification = document.createElement('div')
    notification.className = 'tip-notification-floating'
    notification.innerHTML = `
      <div class="tip-notification-content">
        <span class="tip-notification-icon">💰</span>
        <div>
          <div class="tip-notification-name">${tip.tipper_name || 'Anonymous'}</div>
          <div class="tip-notification-amount">$${parseFloat(tip.amount).toFixed(2)}</div>
        </div>
      </div>
    `
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add('fade-out')
      setTimeout(() => notification.remove(), 500)
    }, 3000)
  }

  const copyTipLink = () => {
    navigator.clipboard.writeText(tipUrl)
    alert('Tip link copied! Share it with your viewers 🎉')
  }

  return (
    <div className={`live-stream-overlay live-stream-overlay-${position}`}>
      {/* Total Tips Counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="overlay-total-tips"
      >
        <div className="total-tips-icon">💰</div>
        <div className="total-tips-content">
          <div className="total-tips-label">Total Tips</div>
          <div className="total-tips-value">${totalTips.toFixed(2)}</div>
        </div>
      </motion.div>

      {/* Recent Tips */}
      <AnimatePresence>
        {recentTips.slice(0, 3).map((tip, index) => (
          <motion.div
            key={`${tip.created_at}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.1 }}
            className="overlay-recent-tip"
          >
            <span className="tip-icon">💝</span>
            <div className="tip-details">
              <span className="tip-name">{tip.tipper_name || 'Anonymous'}</span>
              <span className="tip-amount">${parseFloat(tip.amount).toFixed(2)}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* QR Code Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowQR(!showQR)}
        className="overlay-qr-toggle"
        title="Show/Hide QR Code"
      >
        {showQR ? '✕' : '📱'}
      </motion.button>

      {/* QR Code Display */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="overlay-qr-code"
          >
            <QRCodeDisplay value={tipUrl} size={150} />
            <p className="qr-hint">Scan to tip!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tip Link Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={copyTipLink}
        className="overlay-tip-link-btn"
      >
        🔗 Copy Tip Link
      </motion.button>

      {/* Powered by TipNPlay Branding */}
      <div className="overlay-branding">
        <a 
          href={window.location.origin}
          target="_blank"
          rel="noopener noreferrer"
          className="powered-by-link"
        >
          Powered by <strong>TipNPlay</strong>
        </a>
      </div>
    </div>
  )
}

export default LiveStreamOverlay

