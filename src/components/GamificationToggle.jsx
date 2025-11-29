import { createContext, useContext, useState } from 'react'

/**
 * Gamification Toggle Context
 * Allows easy enabling/disabling of gamification features
 */
const GamificationContext = createContext({
  enabled: true,
  toggle: () => {},
})

export const useGamification = () => useContext(GamificationContext)

export function GamificationProvider({ children }) {
  const [enabled, setEnabled] = useState(true)

  const toggle = () => setEnabled(prev => !prev)

  return (
    <GamificationContext.Provider value={{ enabled, toggle }}>
      {children}
    </GamificationContext.Provider>
  )
}

/**
 * Wrapper component to conditionally render gamification features
 */
export function GamificationWrapper({ children }) {
  const { enabled } = useGamification()
  return enabled ? children : null
}

