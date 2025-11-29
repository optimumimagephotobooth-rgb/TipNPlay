import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, tipsTable } from '../lib/supabase'
import './TipStreak.css'

/**
 * Tip Streak Component - Shows consecutive tipping days
 * Makes tipping addictive like TikTok streaks
 */
function TipStreak({ eventId, userId }) {
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    if (eventId) {
      calculateStreak()
    }
  }, [eventId])

  const calculateStreak = async () => {
    try {
      // Get tips from last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data } = await supabase
        .from(tipsTable)
        .select('created_at')
        .eq('event_id', eventId)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })

      if (data) {
        // Calculate consecutive days
        let currentStreak = 0
        const today = new Date().toDateString()
        const tipDates = [...new Set(data.map(tip => new Date(tip.created_at).toDateString()))]
        
        // Check if tipped today
        if (tipDates.includes(today)) {
          currentStreak = 1
          // Count consecutive days backwards
          for (let i = 1; i < 30; i++) {
            const checkDate = new Date()
            checkDate.setDate(checkDate.getDate() - i)
            const checkDateStr = checkDate.toDateString()
            if (tipDates.includes(checkDateStr)) {
              currentStreak++
            } else {
              break
            }
          }
        }

        setStreak(currentStreak)
        
        // Show celebration for milestones
        if (currentStreak > 0 && [3, 7, 14, 30].includes(currentStreak)) {
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 3000)
        }
      }
    } catch (error) {
      console.error('Error calculating streak:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || streak === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="tip-streak-badge"
      >
        <div className="streak-icon">🔥</div>
        <div className="streak-content">
          <div className="streak-label">Tip Streak</div>
          <div className="streak-days">{streak} {streak === 1 ? 'day' : 'days'}</div>
        </div>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="streak-celebration"
          >
            🎉 Milestone!
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default TipStreak

