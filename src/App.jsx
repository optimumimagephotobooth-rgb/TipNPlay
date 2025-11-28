import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load pages for code splitting and faster initial load
const Home = lazy(() => import('./pages/Home'))
const CreateEvent = lazy(() => import('./pages/CreateEvent'))
const DJDashboard = lazy(() => import('./pages/DJDashboard'))
const TipPage = lazy(() => import('./pages/TipPage'))

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/dj-dashboard" element={<DJDashboard />} />
            <Route path="/tip/:eventId" element={<TipPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  )
}

export default App

