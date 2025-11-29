import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, tipsTable } from '../lib/supabase'
import toast from 'react-hot-toast'
import './TipNotifications.css'

/**
 * Tip Notifications - TikTok-style popup notifications
 * Shows when tips come in (for DJs)
 */
function TipNotifications({ eventId, onTipReceived }) {
  const [notifications, setNotifications] = useState([])

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
          
          // Show toast
          toast.success(`💰 $${notification.amount.toFixed(2)} from ${notification.tipperName}!`, {
            icon: '🎉',
            duration: 4000,
          })

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
  }, [eventId, onTipReceived])

  return (
    <div className="tip-notifications-container">
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

