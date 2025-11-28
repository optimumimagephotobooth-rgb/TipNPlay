import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from './QRCodeDisplay'
import './QRCodeModal.css'

/**
 * QR Code Modal Component
 * Full-screen modal for displaying QR codes
 */
function QRCodeModal({ isOpen, onClose, value, eventName, customColors }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="qr-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="qr-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button className="qr-modal-close" onClick={onClose}>
              ✕
            </button>
            <QRCodeDisplay
              value={value}
              size={300}
              title="Share Your Tipping Page"
              showDownload={true}
              eventName={eventName}
              customColors={customColors}
            />
            <div className="qr-modal-instructions">
              <h3>How to Share:</h3>
              <ul>
                <li>📱 Display on screen for guests to scan</li>
                <li>🖨️ Print and place at your event</li>
                <li>📧 Share via email or social media</li>
                <li>💬 Send via WhatsApp or text message</li>
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default QRCodeModal

