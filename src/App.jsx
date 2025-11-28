import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import Home from './pages/Home'
import CreateEvent from './pages/CreateEvent'
import DJDashboard from './pages/DJDashboard'
import TipPage from './pages/TipPage'
import AnimatedPage from './components/AnimatedPage'

function App() {
  const location = useLocation()

  return (
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
            path="/create-event" 
            element={
              <AnimatedPage>
                <CreateEvent />
              </AnimatedPage>
            } 
          />
          <Route 
            path="/dj-dashboard" 
            element={
              <AnimatedPage>
                <DJDashboard />
              </AnimatedPage>
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
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

export default App

