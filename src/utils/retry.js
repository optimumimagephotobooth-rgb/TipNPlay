/**
 * Retry utility with exponential backoff
 */

export async function retryWithBackoff(
  fn,
  options = {
    retries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2
  }
) {
  const { retries, initialDelay, maxDelay, backoffFactor } = options
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === retries) {
        throw error
      }
      
      const delay = Math.min(
        initialDelay * Math.pow(backoffFactor, attempt),
        maxDelay
      )
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

/**
 * Timeout wrapper for promises
 */
export function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    )
  ])
}

