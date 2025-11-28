import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import './EngagementPrompt.css'

/**
 * Engagement Prompt Component
 * Smart prompts to encourage user engagement
 */
function EngagementPrompt({ 
  type = 'tip', // 'tip', 'share', 'invite', 'complete'
  message,
  ctaText,
  onAction,
  onDismiss,
  showClose = true,
  autoHide = false,
  delay = 3000
}) {
  const [visible, setVisible] = useState(true)

  const promptConfig = {
    tip: {
      icon: '💰',
      title: 'Show Your Support!',
      message: message || 'Leave a tip to show your appreciation!',
      ctaText: ctaText || 'Tip Now',
      color: '#FFD700'
    },
    share: {
      icon: '📢',
      title: 'Spread the Word!',
      message: message || 'Share this event with your friends!',
      ctaText: ctaText || 'Share Now',
      color: '#25D366'
    },
    invite: {
      icon: '👥',
      title: 'Invite Friends!',
      message: message || 'Invite friends and get rewards!',
      ctaText: ctaText || 'Invite Now',
      color: '#1877F2'
    },
    complete: {
      icon: '✅',
      title: 'Almost There!',
      message: message || 'Complete your profile to unlock features!',
      ctaText: ctaText || 'Complete',
      color: '#4CAF50'
    }
  }

  const config = promptConfig[type] || promptConfig.tip

  const handleAction = () => {
    if (onAction) {
      onAction()
    }
    setVisible(false)
  }

  const handleDismiss = () => {
    setVisible(false)
    if (onDismiss) {
      onDismiss()
    }
  }

  if (autoHide && visible) {
    setTimeout(() => {
      setVisible(false)
    }, delay)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="engagement-prompt"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", damping: 20 }}
          style={{ '--prompt-color': config.color }}
        >
          <div className="prompt-icon">{config.icon}</div>
          
          <div className="prompt-content">
            <h4 className="prompt-title">{config.title}</h4>
            <p className="prompt-message">{config.message}</p>
          </div>

          <div className="prompt-actions">
            <motion.button
              className="prompt-cta"
              onClick={handleAction}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {config.ctaText}
            </motion.button>
            
            {showClose && (
              <button
                className="prompt-close"
                onClick={handleDismiss}
                aria-label="Close"
              >
                ✕
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EngagementPrompt

