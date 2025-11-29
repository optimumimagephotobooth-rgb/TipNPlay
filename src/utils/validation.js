/**
 * Validation Utilities
 * Client-side validation helpers
 */

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export function isValidPassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return passwordRegex.test(password)
}

/**
 * Validate tip amount
 */
export function isValidTipAmount(amount) {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0 && num <= 10000
}

/**
 * Sanitize user input (basic XSS prevention)
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validate event name
 */
export function isValidEventName(name) {
  if (!name || typeof name !== 'string') return false
  const trimmed = name.trim()
  return trimmed.length >= 3 && trimmed.length <= 100
}

/**
 * Get validation error message
 */
export function getValidationError(field, value) {
  switch (field) {
    case 'email':
      if (!value) return 'Email is required'
      if (!isValidEmail(value)) return 'Please enter a valid email address'
      return null
    
    case 'password':
      if (!value) return 'Password is required'
      if (value.length < 8) return 'Password must be at least 8 characters'
      if (!isValidPassword(value)) return 'Password must contain uppercase, lowercase, and number'
      return null
    
    case 'tipAmount':
      if (!value) return 'Tip amount is required'
      if (!isValidTipAmount(value)) return 'Tip amount must be between $0.01 and $10,000'
      return null
    
    case 'eventName':
      if (!value) return 'Event name is required'
      if (!isValidEventName(value)) return 'Event name must be between 3 and 100 characters'
      return null
    
    default:
      return null
  }
}

