import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ViralShare from './ViralShare'
import './ViralPrompt.css'

function ViralPrompt({ eventName, tipUrl, onShare }) {
  const [showShare, setShowShare] = useState(false)

  return (
    <AnimatePresence>
      {!showShare ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="viral-prompt"
        >
          <div className="viral-icon">🎉</div>
          <h3>Share the Love!</h3>
          <p>Help {eventName} reach more people. Share this page and spread the music!</p>
          <button
            onClick={() => setShowShare(true)}
            className="viral-btn"
          >
            Share Now 🚀
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="viral-share-container"
        >
          <ViralShare url={tipUrl} title={`Support ${eventName} on TipNPlay!`} />
          <button
            onClick={() => setShowShare(false)}
            className="close-share"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ViralPrompt

