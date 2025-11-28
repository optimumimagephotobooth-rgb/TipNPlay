/**
 * Offline support utilities
 */

// Service Worker registration
export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  }
}

// Check if online
export function isOnline() {
  return navigator.onLine
}

// Listen for online/offline events
export function onOnlineStatusChange(callback) {
  window.addEventListener('online', () => callback(true))
  window.addEventListener('offline', () => callback(false))
}

// Cache API responses
const responseCache = new Map()

export function cacheResponse(key, data, ttl = 5 * 60 * 1000) {
  responseCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  })
}

export function getCachedResponse(key) {
  const cached = responseCache.get(key)
  if (!cached) return null
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    responseCache.delete(key)
    return null
  }
  
  return cached.data
}

