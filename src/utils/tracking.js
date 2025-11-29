/**
 * Tracking Utilities
 * Enhanced tracking with cookie data
 */

import { getTrackingData, getCookie } from './cookies'
import { trackEvent, trackPageView } from './analytics'

/**
 * Track page view with cookie data
 */
export function trackPageViewWithCookies(path) {
  const consent = getCookie('_tipnplay_cookie_consent')
  
  if (consent === 'accepted' || consent === 'custom') {
    const trackingData = getTrackingData()
    
    // Track with analytics
    trackPageView(path)
    
    // Send tracking data to backend (optional)
    sendTrackingData('pageview', {
      path,
      ...trackingData,
    })
  }
}

/**
 * Track event with cookie data
 */
export function trackEventWithCookies(eventName, eventParams = {}) {
  const consent = getCookie('_tipnplay_cookie_consent')
  
  if (consent === 'accepted' || consent === 'custom') {
    const trackingData = getTrackingData()
    
    // Track with analytics
    trackEvent(eventName, {
      ...eventParams,
      ...trackingData,
    })
    
    // Send tracking data to backend (optional)
    sendTrackingData('event', {
      eventName,
      ...eventParams,
      ...trackingData,
    })
  }
}

/**
 * Send tracking data to backend (optional)
 * Can be used to store tracking data in Supabase or analytics service
 */
async function sendTrackingData(type, data) {
  try {
    // Only send if consent is given
    const consent = getCookie('_tipnplay_cookie_consent')
    if (consent !== 'accepted' && consent !== 'custom') {
      return
    }

    // Optional: Send to Supabase or analytics endpoint
    // const response = await fetch('/api/tracking', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ type, data }),
    // })
    
    // For now, just log (can be extended to send to backend)
    if (import.meta.env.DEV) {
      console.log('Tracking:', type, data)
    }
  } catch (error) {
    console.error('Error sending tracking data:', error)
  }
}

/**
 * Track conversion with enhanced data
 */
export function trackConversionWithCookies(tier, value) {
  trackEventWithCookies('conversion', {
    tier,
    value,
    currency: 'USD',
  })
}

/**
 * Track tip with enhanced data
 */
export function trackTipWithCookies(amount, eventId) {
  trackEventWithCookies('tip', {
    value: amount,
    currency: 'USD',
    event_id: eventId,
  })
}

