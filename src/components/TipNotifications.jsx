import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, tipsTable } from '../lib/supabase'
import { notifySuccess } from '../utils/toast'
import './TipNotifications.css'

/**
 * Tip Notifications - TikTok-style popup notifications
 * Shows when tips come in (for DJs)
 */
function TipNotifications({ eventId, onTipReceived }) {
  const [notifications, setNotifications] = useState([])
  const [floatingTips, setFloatingTips] = useState([])

  const addFloatingTip = useCallback((notification) => {
    const bubbleId = `bubble-${notification.id}`
    const bubble = {
      ...notification,
      bubbleId,
      x: 15 + Math.random() * 60,
      accent: Math.random() > 0.5 ? '#0ea5e9' : '#f472b6',
    }

    setFloatingTips((prev) => [...prev, bubble])

    setTimeout(() => {
      setFloatingTips((prev) => prev.filter((item) => item.bubbleId !== bubbleId))
    }, 2200)
  }, [])

  useEffect(() => {
    if (!eventId) return

    const channel = supabase
      .channel(`notifications-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: tipsTable,
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const tip = payload.new
          const notification = {
            id: Date.now(),
            amount: parseFloat(tip.amount || 0),
            tipperName: tip.tipper_name || 'Anonymous',
            message: tip.message,
            timestamp: new Date(),
          }

          setNotifications(prev => [notification, ...prev.slice(0, 4)])
          addFloatingTip(notification)
          
          notifySuccess(
            `💰 $${notification.amount.toFixed(2)} from ${notification.tipperName}!`,
            { duration: 4000 },
          )

          // Callback for parent component
          if (onTipReceived) {
            onTipReceived(notification)
          }

          // Remove after 5 seconds
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id))
          }, 5000)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [eventId, onTipReceived, addFloatingTip])

  return (
    <div className="tip-notifications-container">
      <div className="tip-bubbles-trail">
        <AnimatePresence>
          {floatingTips.map((bubble) => (
            <motion.div
              key={bubble.bubbleId}
              className="tip-bubble"
              style={{
                left: `${bubble.x}%`,
                borderColor: bubble.accent,
                boxShadow: `0 10px 30px rgba(15,23,42,0.35), 0 0 20px ${bubble.accent}`,
                '--bubble-accent': bubble.accent,
              }}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: -120, scale: 1 }}
              exit={{ opacity: 0, y: -140, scale: 0.6 }}
              transition={{ duration: 1.4 }}
            >
              <span className="bubble-icon">🎧</span>
              <div className="bubble-text">
                <strong>${bubble.amount.toFixed(2)}</strong>
                <span>{bubble.tipperName}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ delay: index * 0.1 }}
            className="tip-notification"
          >
            <div className="notification-icon">💰</div>
            <div className="notification-content">
              <div className="notification-amount">${notification.amount.toFixed(2)}</div>
              <div className="notification-name">{notification.tipperName}</div>
              {notification.message && (
                <div className="notification-message">"{notification.message}"</div>
              )}
            </div>
            <div className="notification-badge">NEW</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TipNotifications

