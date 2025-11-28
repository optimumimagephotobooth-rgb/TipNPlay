import { motion } from 'framer-motion'
import './AchievementBadge.css'

/**
 * Achievement Badge Component
 * Displays user achievements and unlocks
 */
const badgeVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { 
    scale: 1, 
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15
    }
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.2 }
  }
}

function AchievementBadge({ 
  type, 
  title, 
  description, 
  icon, 
  unlocked = false,
  progress = 0,
  showProgress = false 
}) {
  const badgeConfig = {
    'first_tip': { color: '#FFD700', icon: '🎉' },
    'streak_3': { color: '#FF6B6B', icon: '🔥' },
    'streak_7': { color: '#4ECDC4', icon: '⭐' },
    'streak_30': { color: '#95E1D3', icon: '💎' },
    'top_tipper': { color: '#F38181', icon: '👑' },
    'event_creator': { color: '#AA96DA', icon: '🎪' },
    'social_share': { color: '#FCBAD3', icon: '📢' },
    'milestone_100': { color: '#FFD93D', icon: '💯' }
  }

  const config = badgeConfig[type] || { color: '#FFD700', icon: icon || '🏆' }

  return (
    <motion.div
      className={`achievement-badge ${unlocked ? 'unlocked' : 'locked'}`}
      variants={badgeVariants}
      initial="hidden"
      animate={unlocked ? "visible" : "hidden"}
      whileHover={unlocked ? "hover" : {}}
      style={{ '--badge-color': config.color }}
    >
      <div className="badge-icon">
        {unlocked ? config.icon : '🔒'}
      </div>
      <div className="badge-content">
        <h4 className="badge-title">{title}</h4>
        <p className="badge-description">{description}</p>
        {showProgress && !unlocked && (
          <div className="badge-progress">
            <div 
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
            <span className="progress-text">{progress}%</span>
          </div>
        )}
      </div>
      {unlocked && (
        <motion.div
          className="unlock-sparkle"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          ✨
        </motion.div>
      )}
    </motion.div>
  )
}

export default AchievementBadge

