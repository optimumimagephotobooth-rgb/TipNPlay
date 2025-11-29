import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { setCookie, getCookie } from '../utils/cookies'
import { setTrackingCookies } from '../utils/cookies'
import { initAnalytics } from '../utils/analytics'
import './CookieConsent.css'

/**
 * Cookie Consent Banner
 * GDPR/CCPA compliant cookie consent
 */
function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const consent = getCookie('_tipnplay_cookie_consent')
    
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => {
        setShowBanner(true)
      }, 1000)
    } else {
      // User already consented, set tracking cookies
      if (consent === 'accepted') {
        setTrackingCookies()
        setConsentGiven(true)
      }
    }
  }, [])

  const handleAccept = () => {
    setCookie('_tipnplay_cookie_consent', 'accepted', 365)
    setTrackingCookies()
    setShowBanner(false)
    setConsentGiven(true)
    
    // Initialize analytics after consent
    initAnalytics()
  }

  const handleReject = () => {
    setCookie('_tipnplay_cookie_consent', 'rejected', 365)
    setShowBanner(false)
    setConsentGiven(false)
  }

  const handleCustomize = () => {
    // Open cookie preferences modal (can be implemented later)
    setCookie('_tipnplay_cookie_consent', 'custom', 365)
    setTrackingCookies() // Set essential cookies only
    setShowBanner(false)
    setConsentGiven(true)
    
    // Initialize analytics after consent
    initAnalytics()
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="cookie-consent-banner"
        >
          <div className="cookie-consent-content">
            <div className="cookie-consent-text">
              <h3>🍪 We Use Cookies</h3>
              <p>
                We use cookies to improve your experience, analyze site traffic, and personalize content. 
                By clicking "Accept", you consent to our use of cookies. 
                <a href="/privacy" target="_blank" rel="noopener noreferrer">Learn more</a>
              </p>
            </div>
            <div className="cookie-consent-actions">
              <button
                onClick={handleReject}
                className="cookie-btn cookie-btn-reject"
              >
                Reject
              </button>
              <button
                onClick={handleCustomize}
                className="cookie-btn cookie-btn-customize"
              >
                Customize
              </button>
              <button
                onClick={handleAccept}
                className="cookie-btn cookie-btn-accept"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieConsent

