import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { registerServiceWorker } from './utils/offline'
import { testConnection } from './lib/supabase'
import './index.css'

// Register service worker for offline support (production only)
if (import.meta.env.PROD) {
  registerServiceWorker()
}

// Test Supabase connection on startup (development only)
if (import.meta.env.DEV) {
  testConnection().then(result => {
    if (result.connected) {
      console.log('✅ Supabase connected!')
    } else {
      console.warn('⚠️  Supabase not connected:', result.reason || result.error)
      console.log('💡 Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Replit Secrets')
    }
  })
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

