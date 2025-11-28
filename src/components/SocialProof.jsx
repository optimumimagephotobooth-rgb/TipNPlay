import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import './SocialProof.css'

/**
 * Social Proof Component
 * Displays recent tips, top tippers, and live stats
 * Creates FOMO and encourages more tips
 */
function SocialProof({ 
  recentTips = [], 
  totalTips = 0, 
  tipCount = 0,
  showLiveCounter = true 
}) {
  const topTippers = recentTips
    .slice(0, 3)
    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))

  return (
    <motion.div 
      className="social-proof"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {showLiveCounter && (
        <div className="live-stats">
          <motion.div 
            className="stat-badge"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="live-dot"></span>
            <span>Live</span>
          </motion.div>
          <div className="stats">
            <div className="stat">
              <span className="stat-value">${totalTips.toFixed(2)}</span>
              <span className="stat-label">Total Tips</span>
            </div>
            <div className="stat">
              <span className="stat-value">{tipCount}</span>
              <span className="stat-label">Tips Received</span>
            </div>
          </div>
        </div>
      )}

      {recentTips.length > 0 && (
        <div className="recent-tips-section">
          <h4 className="section-title">Recent Tips 💰</h4>
          <div className="tips-list">
            {recentTips.slice(0, 5).map((tip, index) => (
              <motion.div
                key={tip.id || index}
                className="tip-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="tipper-info">
                  <span className="tipper-name">
                    {tip.tipper_name || 'Anonymous'}
                  </span>
                  {tip.message && (
                    <span className="tip-message">"{tip.message}"</span>
                  )}
                </div>
                <div className="tip-amount">
                  ${parseFloat(tip.amount).toFixed(2)}
                </div>
                {tip.created_at && (
                  <div className="tip-time">
                    {formatDistanceToNow(new Date(tip.created_at), { addSuffix: true })}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {topTippers.length > 0 && (
        <div className="top-tippers-section">
          <h4 className="section-title">Top Supporters 🏆</h4>
          <div className="tippers-list">
            {topTippers.map((tipper, index) => (
              <motion.div
                key={tipper.id || index}
                className="tipper-rank"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="rank-number">{index + 1}</span>
                <span className="tipper-name">{tipper.tipper_name || 'Anonymous'}</span>
                <span className="tipper-amount">${parseFloat(tipper.amount).toFixed(2)}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default SocialProof

