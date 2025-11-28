/**
 * API utilities with retry logic and request deduplication
 */

// Request cache to prevent duplicate requests
const requestCache = new Map()
const CACHE_DURATION = 1000 // 1 second deduplication

/**
 * Fetch with retry logic
 */
export async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      if (i === retries - 1) throw error
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
}

/**
 * Deduplicate requests - prevents multiple identical requests
 */
export function deduplicateRequest(key, requestFn) {
  const cached = requestCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.promise
  }
  
  const promise = requestFn().finally(() => {
    // Clean up cache after request completes
    setTimeout(() => requestCache.delete(key), CACHE_DURATION)
  })
  
  requestCache.set(key, { promise, timestamp: Date.now() })
  return promise
}

/**
 * Batch multiple requests
 */
export async function batchRequests(requests, batchSize = 5) {
  const results = []
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize)
    const batchResults = await Promise.allSettled(batch)
    results.push(...batchResults)
  }
  return results
}

