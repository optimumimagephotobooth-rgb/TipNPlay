import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnimatedButton from '../components/AnimatedButton'
import './NotFound.css'

function NotFound() {
  return (
    <div className="not-found">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="not-found-content"
      >
        <div className="not-found-icon">🔍</div>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        
        <div className="not-found-actions">
          <AnimatedButton to="/" variant="primary">
            Go Home
          </AnimatedButton>
          <AnimatedButton to="/create-event" variant="secondary">
            Create Event
          </AnimatedButton>
        </div>

        <div className="not-found-links">
          <Link to="/dj-dashboard">DJ Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">Login</Link>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound

