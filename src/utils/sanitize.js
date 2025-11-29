/**
 * Input Sanitization Utilities
 * Prevents XSS attacks by sanitizing user input
 */

import DOMPurify from 'dompurify'

/**
 * Sanitize HTML content
 */
export function sanitizeHTML(html) {
  if (typeof html !== 'string') return html
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  })
}

/**
 * Sanitize plain text (removes HTML)
 */
export function sanitizeText(text) {
  if (typeof text !== 'string') return text
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] })
}

/**
 * Sanitize user input for display
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input
  
  // Remove HTML tags
  let sanitized = sanitizeText(input)
  
  // Remove potentially dangerous characters
  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/<script/gi, '')
    .replace(/<\/script>/gi, '')
  
  return sanitized.trim()
}

/**
 * Sanitize URL
 */
export function sanitizeURL(url) {
  if (typeof url !== 'string') return url
  
  try {
    const parsed = new URL(url)
    // Only allow http/https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return ''
    }
    return parsed.toString()
  } catch {
    return ''
  }
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject(obj) {
  if (obj === null || obj === undefined) return obj
  
  if (typeof obj === 'string') {
    return sanitizeInput(obj)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item))
  }
  
  if (typeof obj === 'object') {
    const sanitized = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[sanitizeInput(key)] = sanitizeObject(value)
    }
    return sanitized
  }
  
  return obj
}

