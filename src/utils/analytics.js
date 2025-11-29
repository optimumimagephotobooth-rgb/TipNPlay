/**
 * Analytics Utilities
 * Supports Google Analytics and Plausible
 */

import { getTrackingData } from './cookies'

/**
 * Track page view
 */
export function trackPageView(path) {
  // Google Analytics 4
  if (import.meta.env.VITE_GA_TRACKING_ID && window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_TRACKING_ID, {
      page_path: path,
    })
  }

  // Plausible
  if (import.meta.env.VITE_PLAUSIBLE_DOMAIN && window.plausible) {
    window.plausible('pageview', {
      props: { path },
    })
  }
}

/**
 * Track event
 */
export function trackEvent(eventName, eventParams = {}) {
  // Add cookie tracking data
  const trackingData = getTrackingData()
  const enhancedParams = {
    ...eventParams,
    ...trackingData,
  }

  // Google Analytics 4
  if (import.meta.env.VITE_GA_TRACKING_ID && window.gtag) {
    window.gtag('event', eventName, enhancedParams)
  }

  // Plausible
  if (import.meta.env.VITE_PLAUSIBLE_DOMAIN && window.plausible) {
    window.plausible(eventName, {
      props: enhancedParams,
    })
  }
}

/**
 * Track tip event
 */
export function trackTip(amount, eventId) {
  trackEvent('tip', {
    value: amount,
    currency: 'USD',
    event_id: eventId,
  })
}

/**
 * Track event creation
 */
export function trackEventCreation(eventId, eventName) {
  trackEvent('event_created', {
    event_id: eventId,
    event_name: eventName,
  })
}

/**
 * Track signup
 */
export function trackSignup(method = 'email') {
  trackEvent('sign_up', {
    method,
  })
}

/**
 * Track login
 */
export function trackLogin(method = 'email') {
  trackEvent('login', {
    method,
  })
}

/**
 * Track conversion (subscription upgrade)
 */
export function trackConversion(tier, value) {
  trackEvent('conversion', {
    tier,
    value,
    currency: 'USD',
  })
}

/**
 * Initialize analytics
 */
export function initAnalytics() {
  // Google Analytics 4
  if (import.meta.env.VITE_GA_TRACKING_ID) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_TRACKING_ID}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag(...args) {
      window.dataLayer.push(args)
    }
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', import.meta.env.VITE_GA_TRACKING_ID, {
      page_path: window.location.pathname,
    })
  }

  // Plausible
  if (import.meta.env.VITE_PLAUSIBLE_DOMAIN) {
    const script = document.createElement('script')
    script.defer = true
    script.setAttribute('data-domain', import.meta.env.VITE_PLAUSIBLE_DOMAIN)
    script.src = 'https://plausible.io/js/script.js'
    document.head.appendChild(script)
  }
}

