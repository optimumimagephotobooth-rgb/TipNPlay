import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, tipsTable } from '../lib/supabase'
import './LiveReactions.css'

/**
 * Live Reactions Component - TikTok-style reactions
 * Shows floating emojis when tips come in
 */
function LiveReactions({ eventId }) {
  const [reactions, setReactions] = useState([])

  useEffect(() => {
    if (!eventId) return

    const channel = supabase
      .channel(`reactions-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: tipsTable,
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const tip = payload.new
          const amount = parseFloat(tip.amount || 0)
          
          // Choose reaction based on tip amount
          let emoji = '💝'
          if (amount >= 50) emoji = '🚀'
          else if (amount >= 25) emoji = '🔥'
          else if (amount >= 10) emoji = '⭐'
          else if (amount >= 5) emoji = '💎'
          
          // Add reaction
          const reaction = {
            id: Date.now(),
            emoji,
            amount,
            x: Math.random() * 80 + 10, // Random X position (10-90%)
            duration: amount >= 25 ? 4000 : 3000, // Bigger tips = longer animation
          }
          
          setReactions(prev => [...prev, reaction])
          
          // Remove after animation
          setTimeout(() => {
            setReactions(prev => prev.filter(r => r.id !== reaction.id))
          }, reaction.duration)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [eventId])

  return (
    <div className="live-reactions-container">
      <AnimatePresence>
        {reactions.map(reaction => (
          <motion.div
            key={reaction.id}
            initial={{ 
              opacity: 0, 
              y: 100,
              x: `${reaction.x}%`,
              scale: 0.5
            }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              y: -100,
              scale: [0.5, 1.2, 1, 0.8],
              rotate: [0, 10, -10, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: reaction.duration / 1000,
              ease: 'easeOut'
            }}
            className="live-reaction"
            style={{ left: `${reaction.x}%` }}
          >
            <span className="reaction-emoji">{reaction.emoji}</span>
            {reaction.amount >= 10 && (
              <span className="reaction-amount">${reaction.amount}</span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default LiveReactions

