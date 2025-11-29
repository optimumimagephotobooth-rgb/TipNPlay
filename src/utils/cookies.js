/**
 * Cookie Utilities
 * Handles cookie management for tracking and analytics
 */

/**
 * Set a cookie
 */
export function setCookie(name, value, days = 365) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

/**
 * Get a cookie
 */
export function getCookie(name) {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

/**
 * Delete a cookie
 */
export function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

/**
 * Check if cookies are enabled
 */
export function cookiesEnabled() {
  try {
    setCookie('__cookie_test', '1', 1)
    const enabled = getCookie('__cookie_test') === '1'
    deleteCookie('__cookie_test')
    return enabled
  } catch {
    return false
  }
}

/**
 * Set tracking cookies for first-time visitors
 */
export function setTrackingCookies() {
  // Visitor ID (unique identifier for this visitor)
  if (!getCookie('_tipnplay_visitor_id')) {
    const visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setCookie('_tipnplay_visitor_id', visitorId, 365)
  }

  // First visit timestamp
  if (!getCookie('_tipnplay_first_visit')) {
    setCookie('_tipnplay_first_visit', new Date().toISOString(), 365)
  }

  // Last visit timestamp (always update)
  setCookie('_tipnplay_last_visit', new Date().toISOString(), 365)

  // Visit count
  const visitCount = parseInt(getCookie('_tipnplay_visit_count') || '0') + 1
  setCookie('_tipnplay_visit_count', visitCount.toString(), 365)

  // Session ID (resets on browser close)
  if (!getCookie('_tipnplay_session_id')) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setCookie('_tipnplay_session_id', sessionId, 1) // 1 day
  }

  // Referrer (where they came from)
  if (document.referrer && !getCookie('_tipnplay_referrer')) {
    setCookie('_tipnplay_referrer', document.referrer, 30)
  }

  // UTM parameters (marketing tracking)
  const urlParams = new URLSearchParams(window.location.search)
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
  
  utmParams.forEach(param => {
    const value = urlParams.get(param)
    if (value && !getCookie(`_tipnplay_${param}`)) {
      setCookie(`_tipnplay_${param}`, value, 30)
    }
  })

  // Device type
  if (!getCookie('_tipnplay_device_type')) {
    const deviceType = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop'
    setCookie('_tipnplay_device_type', deviceType, 365)
  }

  // Browser info
  if (!getCookie('_tipnplay_browser')) {
    const browser = navigator.userAgent.includes('Chrome') ? 'chrome' :
                   navigator.userAgent.includes('Firefox') ? 'firefox' :
                   navigator.userAgent.includes('Safari') ? 'safari' :
                   navigator.userAgent.includes('Edge') ? 'edge' : 'other'
    setCookie('_tipnplay_browser', browser, 365)
  }
}

/**
 * Get visitor ID
 */
export function getVisitorId() {
  return getCookie('_tipnplay_visitor_id')
}

/**
 * Get session ID
 */
export function getSessionId() {
  return getCookie('_tipnplay_session_id')
}

/**
 * Get visit count
 */
export function getVisitCount() {
  return parseInt(getCookie('_tipnplay_visit_count') || '0')
}

/**
 * Get all tracking data
 */
export function getTrackingData() {
  return {
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    visitCount: getVisitCount(),
    firstVisit: getCookie('_tipnplay_first_visit'),
    lastVisit: getCookie('_tipnplay_last_visit'),
    referrer: getCookie('_tipnplay_referrer'),
    deviceType: getCookie('_tipnplay_device_type'),
    browser: getCookie('_tipnplay_browser'),
    utmSource: getCookie('_tipnplay_utm_source'),
    utmMedium: getCookie('_tipnplay_utm_medium'),
    utmCampaign: getCookie('_tipnplay_utm_campaign'),
    utmTerm: getCookie('_tipnplay_utm_term'),
    utmContent: getCookie('_tipnplay_utm_content'),
  }
}

/**
 * Clear all tracking cookies
 */
export function clearTrackingCookies() {
  const cookies = [
    '_tipnplay_visitor_id',
    '_tipnplay_session_id',
    '_tipnplay_visit_count',
    '_tipnplay_first_visit',
    '_tipnplay_last_visit',
    '_tipnplay_referrer',
    '_tipnplay_device_type',
    '_tipnplay_browser',
    '_tipnplay_utm_source',
    '_tipnplay_utm_medium',
    '_tipnplay_utm_campaign',
    '_tipnplay_utm_term',
    '_tipnplay_utm_content',
  ]
  
  cookies.forEach(cookie => deleteCookie(cookie))
}

