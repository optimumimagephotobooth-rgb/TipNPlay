import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  WhatsappShareButton, 
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share'
import { notifySuccess, notifyError } from '../utils/toast'
import './ViralShare.css'

/**
 * Enhanced Viral Share Component
 * Features:
 * - Multi-platform sharing
 * - Custom share messages
 * - Share tracking
 * - Deep link support
 */
function ViralShare({ 
  url, 
  title = 'Check out this event!',
  description = '',
  eventName = '',
  showQR = false,
  onShare = null
}) {
  const [copied, setCopied] = useState(false)

  const shareText = description || `Join ${eventName || 'this event'} and show your support! 🎉`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      notifySuccess('Link copied! Share it with your friends 🚀')
      setTimeout(() => setCopied(false), 2000)
      
      // Track share event
      if (onShare) {
        onShare('copy')
      }
    } catch (err) {
      notifyError('Failed to copy link')
    }
  }

  const handleShare = (platform) => {
    if (onShare) {
      onShare(platform)
    }
    notifySuccess(`Sharing to ${platform}...`)
  }

  const shareOptions = [
    {
      platform: 'whatsapp',
      component: WhatsappShareButton,
      icon: WhatsappIcon,
      color: '#25D366'
    },
    {
      platform: 'facebook',
      component: FacebookShareButton,
      icon: FacebookIcon,
      color: '#1877F2'
    },
    {
      platform: 'twitter',
      component: TwitterShareButton,
      icon: TwitterIcon,
      color: '#1DA1F2'
    },
    {
      platform: 'email',
      component: EmailShareButton,
      icon: EmailIcon,
      color: '#EA4335'
    }
  ]

  return (
    <motion.div 
      className="viral-share"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="viral-share-title">Share & Spread the Word! 🚀</h3>
      <p className="viral-share-subtitle">Help this event go viral</p>

      <div className="share-buttons-grid">
        {shareOptions.map(({ platform, component: ShareButton, icon: Icon, color }) => (
          <ShareButton
            key={platform}
            url={url}
            title={title}
            description={shareText}
            onClick={() => handleShare(platform)}
          >
            <motion.div
              className="share-button"
              style={{ '--share-color': color }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={32} round />
              <span className="share-platform-name">
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </span>
            </motion.div>
          </ShareButton>
        ))}
      </div>

      <div className="copy-link-section">
        <motion.button
          className={`copy-link-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {copied ? '✓ Copied!' : '📋 Copy Link'}
        </motion.button>
        <p className="share-hint">Share this link anywhere!</p>
      </div>

      {showQR && (
        <div className="qr-share-hint">
          <p>💡 Pro tip: Share the QR code for easy scanning!</p>
        </div>
      )}
    </motion.div>
  )
}

export default ViralShare

