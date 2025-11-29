import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase, tipsTable } from '../lib/supabase'
import './TipLeaderboard.css'

/**
 * Tip Leaderboard - Shows top tippers
 * Creates competition and social proof
 */
function TipLeaderboard({ eventId, limit = 10 }) {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (eventId) {
      loadLeaderboard()
    }
  }, [eventId])

  const loadLeaderboard = async () => {
    try {
      const { data } = await supabase
        .from(tipsTable)
        .select('tipper_name, amount, created_at')
        .eq('event_id', eventId)
        .order('amount', { ascending: false })
        .limit(limit)

      if (data) {
        // Group by tipper name and sum amounts
        const leaderMap = {}
        data.forEach(tip => {
          const name = tip.tipper_name || 'Anonymous'
          if (!leaderMap[name]) {
            leaderMap[name] = {
              name,
              total: 0,
              count: 0,
              latest: tip.created_at
            }
          }
          leaderMap[name].total += parseFloat(tip.amount || 0)
          leaderMap[name].count++
        })

        const sorted = Object.values(leaderMap)
          .sort((a, b) => b.total - a.total)
          .slice(0, limit)

        setLeaders(sorted)
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || leaders.length === 0) return null

  const getRankEmoji = (rank) => {
    if (rank === 0) return '🥇'
    if (rank === 1) return '🥈'
    if (rank === 2) return '🥉'
    return `#${rank + 1}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="tip-leaderboard"
    >
      <h3 className="leaderboard-title">🏆 Top Tippers</h3>
      <div className="leaderboard-list">
        {leaders.map((leader, index) => (
          <motion.div
            key={leader.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}
          >
            <div className="leader-rank">{getRankEmoji(index)}</div>
            <div className="leader-info">
              <div className="leader-name">{leader.name}</div>
              <div className="leader-stats">
                ${leader.total.toFixed(2)} • {leader.count} {leader.count === 1 ? 'tip' : 'tips'}
              </div>
            </div>
            {index < 3 && <div className="leader-badge">⭐</div>}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default TipLeaderboard

