import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import CookieConsent from './components/CookieConsent'
import { initAnalytics } from './utils/analytics'
import { getCookie, setTrackingCookies } from './utils/cookies'
import './index.css'

// Initialize analytics (only if consent given)
const consent = getCookie('_tipnplay_cookie_consent')
if (consent === 'accepted' || consent === 'custom') {
  initAnalytics()
  setTrackingCookies()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)

