import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CreateEvent from './pages/CreateEvent'
import DJDashboard from './pages/DJDashboard'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/dj-dashboard" element={<DJDashboard />} />
      </Routes>
    </Layout>
  )
}

export default App

