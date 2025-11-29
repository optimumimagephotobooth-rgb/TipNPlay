import { motion } from 'framer-motion'
import './TrendingBadge.css'

/**
 * Trending Badge - Shows when event is trending
 * Creates FOMO and urgency
 */
function TrendingBadge({ isTrending = false }) {
  if (!isTrending) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="trending-badge"
    >
      <span className="trending-icon">🔥</span>
      <span className="trending-text">TRENDING</span>
    </motion.div>
  )
}

export default TrendingBadge

