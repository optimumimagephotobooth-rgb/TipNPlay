import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './TipGoals.css'

/**
 * Tip Goals Component - Shows progress toward goals
 * Creates urgency and achievement feeling
 */
function TipGoals({ currentAmount, goals = [50, 100, 250, 500, 1000] }) {
  const [nextGoal, setNextGoal] = useState(null)
  const [progress, setProgress] = useState(0)
  const [achievedGoals, setAchievedGoals] = useState([])

  useEffect(() => {
    // Find next unachieved goal
    const next = goals.find(goal => currentAmount < goal)
    setNextGoal(next || null)

    if (next) {
      const progressPercent = (currentAmount / next) * 100
      setProgress(Math.min(progressPercent, 100))
    }

    // Check achieved goals
    const achieved = goals.filter(goal => currentAmount >= goal)
    setAchievedGoals(achieved)
  }, [currentAmount, goals])

  if (!nextGoal) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="tip-goals"
    >
      <div className="goals-header">
        <h3>🎯 Goal Progress</h3>
        <div className="next-goal-amount">${nextGoal}</div>
      </div>
      
      <div className="progress-bar-container">
        <motion.div
          className="progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
        <div className="progress-text">
          ${currentAmount.toFixed(2)} / ${nextGoal}
        </div>
      </div>

      {achievedGoals.length > 0 && (
        <div className="achieved-goals">
          <span className="achieved-label">✅ Achieved:</span>
          {achievedGoals.map(goal => (
            <span key={goal} className="achieved-badge">
              ${goal}
            </span>
          ))}
        </div>
      )}

      {progress >= 90 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="almost-there"
        >
          🔥 Almost there! ${(nextGoal - currentAmount).toFixed(2)} to go!
        </motion.div>
      )}
    </motion.div>
  )
}

export default TipGoals

