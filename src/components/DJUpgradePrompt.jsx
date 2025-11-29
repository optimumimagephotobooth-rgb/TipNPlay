import { motion } from 'framer-motion'
import AnimatedButton from './AnimatedButton'
import './DJUpgradePrompt.css'

function DJUpgradePrompt({ onUpgrade }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dj-upgrade-prompt"
    >
      <div className="upgrade-badge">✨ PRO</div>
      <h3>Want More Features?</h3>
      <ul className="upgrade-features">
        <li>✅ Unlimited events</li>
        <li>✅ Advanced analytics</li>
        <li>✅ Custom branding</li>
        <li>✅ Priority support</li>
        <li>✅ Email notifications</li>
      </ul>
      <AnimatedButton
        onClick={onUpgrade}
        variant="primary"
        className="upgrade-cta"
      >
        Upgrade Now - Starting at $9.99/mo
      </AnimatedButton>
      <p className="upgrade-note">Join 1000+ DJs already using TipNPlay Pro!</p>
    </motion.div>
  )
}

export default DJUpgradePrompt

