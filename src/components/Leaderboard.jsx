import { motion } from 'framer-motion'
import './Leaderboard.css'

/**
 * Leaderboard Component
 * Displays top performers and creates competition
 */
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3
    }
  })
}

function Leaderboard({ 
  title = 'Top Supporters',
  data = [],
  type = 'tippers', // 'tippers' or 'events'
  showRank = true,
  maxItems = 10
}) {
  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getRankColor = (rank) => {
    if (rank === 1) return '#FFD700'
    if (rank === 2) return '#C0C0C0'
    if (rank === 3) return '#CD7F32'
    return 'rgba(255, 255, 255, 0.5)'
  }

  const displayData = data.slice(0, maxItems)

  return (
    <motion.div 
      className="leaderboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="leaderboard-title">{title}</h3>
      
      {displayData.length === 0 ? (
        <div className="leaderboard-empty">
          <p>No data yet. Be the first! 🚀</p>
        </div>
      ) : (
        <div className="leaderboard-list">
          {displayData.map((item, index) => {
            const rank = index + 1
            const isTopThree = rank <= 3
            
            return (
              <motion.div
                key={item.id || index}
                className={`leaderboard-item ${isTopThree ? 'top-three' : ''}`}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02, x: 5 }}
                style={{ '--rank-color': getRankColor(rank) }}
              >
                {showRank && (
                  <div className="rank-badge" style={{ background: getRankColor(rank) }}>
                    {getRankIcon(rank)}
                  </div>
                )}
                
                <div className="item-info">
                  <div className="item-name">
                    {type === 'tippers' 
                      ? (item.tipper_name || item.name || 'Anonymous')
                      : (item.event_name || item.name || 'Unnamed Event')
                    }
                  </div>
                  {item.message && (
                    <div className="item-message">"{item.message}"</div>
                  )}
                </div>
                
                <div className="item-value">
                  <span className="value-amount">
                    ${parseFloat(item.amount || item.total_tips || 0).toFixed(2)}
                  </span>
                  {item.count && (
                    <span className="value-count">
                      {item.count} {item.count === 1 ? 'tip' : 'tips'}
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
      
      {data.length > maxItems && (
        <div className="leaderboard-footer">
          <p>And {data.length - maxItems} more...</p>
        </div>
      )}
    </motion.div>
  )
}

export default Leaderboard

