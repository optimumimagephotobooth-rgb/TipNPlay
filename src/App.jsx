import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import AnimatedPage from './components/AnimatedPage'
import ProtectedRoute from './components/ProtectedRoute'
import CookieConsent from './components/CookieConsent'
import { trackPageView } from './utils/analytics'
import { getCookie, setTrackingCookies } from './utils/cookies'
import routeDefinitions from './routes/routeConfig'

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
            {routeDefinitions.map(({ path, Component, requiresAuth }) => {
              const Page = (
                <AnimatedPage>
                  {requiresAuth ? (
                    <ProtectedRoute>
                      <Component />
                    </ProtectedRoute>
                  ) : (
                    <Component />
                  )}
                </AnimatedPage>
              )

              return <Route key={path} path={path} element={Page} />
            })}
          </Routes>
        </AnimatePresence>
      </Layout>
      <CookieConsent />
    </>
  )
}

export default App

