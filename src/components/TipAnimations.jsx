import { useEffect } from 'react'
import confetti from 'canvas-confetti'

/**
 * Tip Animations - TikTok-style celebrations
 * Makes tipping feel rewarding and addictive
 */
export function celebrateTip(amount) {
  // Bigger tips = bigger celebration
  const intensity = amount >= 50 ? 'high' : amount >= 25 ? 'medium' : 'low'

  if (intensity === 'high') {
    // Epic celebration for big tips
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'],
    })
    
    // Second burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#FF6B6B'],
      })
    }, 250)
    
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#4ECDC4', '#45B7D1'],
      })
    }, 400)
  } else if (intensity === 'medium') {
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6B6B', '#4ECDC4'],
    })
  } else {
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6B6B'],
    })
  }
}

export function celebrateMilestone(milestone) {
  // Special celebration for milestones
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 },
    colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'],
    shapes: ['circle', 'square'],
  })
}

export function celebrateStreak(streakDays) {
  // Celebration for tip streaks
  const colors = streakDays >= 30 ? 
    ['#FFD700', '#FF6B6B', '#4ECDC4'] : 
    ['#FFD700', '#FF6B6B']
  
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors,
  })
}

