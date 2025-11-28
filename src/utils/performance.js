/**
 * Performance monitoring utilities
 */

// Measure component render time
export function measureRender(componentName) {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now()
    return () => {
      const end = performance.now()
      console.log(`[Performance] ${componentName} rendered in ${(end - start).toFixed(2)}ms`)
    }
  }
  return () => {}
}

// Throttle function calls
export function throttle(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Debounce function calls
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Lazy load images
export function lazyLoadImage(img) {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target
          if (image.dataset.src) {
            image.src = image.dataset.src
            image.removeAttribute('data-src')
            observer.unobserve(image)
          }
        }
      })
    })
    imageObserver.observe(img)
  } else {
    // Fallback for older browsers
    if (img.dataset.src) {
      img.src = img.dataset.src
    }
  }
}

