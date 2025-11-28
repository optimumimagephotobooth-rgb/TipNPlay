import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { registerServiceWorker } from './utils/offline'
import './index.css'

// Register service worker for offline support (production only)
if (import.meta.env.PROD) {
  registerServiceWorker()
}

// Performance: Use createRoot with concurrent features
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// Performance monitoring (development only)
if (import.meta.env.DEV) {
  // Log performance metrics
  window.addEventListener('load', () => {
    if ('performance' in window) {
      const perfData = window.performance.timing
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
      console.log(`[Performance] Page loaded in ${pageLoadTime}ms`)
    }
  })
}

