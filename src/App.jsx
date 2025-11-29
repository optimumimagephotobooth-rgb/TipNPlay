import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CreateEvent from './pages/CreateEvent'
import DJDashboard from './pages/DJDashboard'
import TipPage from './pages/TipPage'
import Profile from './pages/Profile'
import LiveStreamSetup from './pages/LiveStreamSetup'
import NotFound from './pages/NotFound'
import AnimatedPage from './components/AnimatedPage'
import ProtectedRoute from './components/ProtectedRoute'
import CookieConsent from './components/CookieConsent'
import { trackPageView } from './utils/analytics'
import { getCookie, setTrackingCookies } from './utils/cookies'

function App() {
  const location = useLocation()

  // Track page views (only if consent given)
  useEffect(() => {
    const consent = getCookie('_tipnplay_cookie_consent')
    if (consent === 'accepted' || consent === 'custom') {
      trackPageView(location.pathname + location.search)
      // Update tracking cookies on each page view
      setTrackingCookies()
    }
  }, [location])

  return (
    <>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
          <Route 
            path="/" 
            element={
              <AnimatedPage>
                <Home />
              </AnimatedPage>
            } 
          />
          <Route 
            path="/login" 
            element={
              <AnimatedPage>
                <Login />
              </AnimatedPage>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <AnimatedPage>
                <Signup />
              </AnimatedPage>
            } 
          />
          <Route 
            path="/create-event" 
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <CreateEvent />
                </AnimatedPage>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dj-dashboard" 
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <DJDashboard />
                </AnimatedPage>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <Profile />
                </AnimatedPage>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/live-stream-setup" 
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <LiveStreamSetup />
                </AnimatedPage>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tip/:eventId" 
            element={
              <AnimatedPage>
                <TipPage />
              </AnimatedPage>
            } 
          />
          <Route 
            path="*" 
            element={
              <AnimatedPage>
                <NotFound />
              </AnimatedPage>
            } 
          />
          </Routes>
        </AnimatePresence>
      </Layout>
      <CookieConsent />
    </>
  )
}

export default App

