import { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import './QRCodeDisplay.css'

/**
 * Enhanced QR Code Display Component
 * Features:
 * - High-resolution download
 * - Customizable styling
 * - Animation effects
 * - Multiple format support
 */
function QRCodeDisplay({ 
  value, 
  size = 200, 
  level = 'H',
  title = 'Scan to Tip',
  showDownload = true,
  showTitle = true,
  className = '',
  eventName = '',
  customColors = { fgColor: '#000000', bgColor: '#FFFFFF' }
}) {
  const [downloading, setDownloading] = useState(false)
  const qrRef = useRef(null)

  const downloadQR = async (format = 'png') => {
    setDownloading(true)
    
    try {
      const svg = qrRef.current?.querySelector('svg')
      if (!svg) {
        toast.error('QR code not found')
        return
      }

      if (format === 'png') {
        // Convert SVG to PNG for high-resolution download
        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        // High resolution (4x for print quality)
        const scale = 4
        canvas.width = size * scale
        canvas.height = size * scale
        
        img.onload = () => {
          ctx.fillStyle = customColors.bgColor || '#FFFFFF'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `tipnplay-qr-${eventName || 'event'}-${Date.now()}.png`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            toast.success('QR code downloaded!')
            setDownloading(false)
          }, 'image/png')
        }
        
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(svgBlob)
        img.src = url
      } else if (format === 'svg') {
        // Download as SVG
        const svgData = new XMLSerializer().serializeToString(svg)
        const blob = new Blob([svgData], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `tipnplay-qr-${eventName || 'event'}-${Date.now()}.svg`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('QR code downloaded!')
        setDownloading(false)
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download QR code')
      setDownloading(false)
    }
  }

  return (
    <motion.div 
      className={`qr-code-display ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {showTitle && (
        <motion.h4 
          className="qr-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.h4>
      )}
      
      <motion.div 
        className="qr-wrapper"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="qr-code-container" ref={qrRef}>
          <QRCodeSVG 
            value={value} 
            size={size} 
            level={level}
            fgColor={customColors.fgColor}
            bgColor={customColors.bgColor}
            includeMargin={true}
          />
          <div className="qr-overlay">
            <div className="qr-center-logo">
              <span className="qr-logo-text">TIP</span>
            </div>
          </div>
        </div>
      </motion.div>

      {showDownload && (
        <motion.div 
          className="qr-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            className="qr-download-btn"
            onClick={() => downloadQR('png')}
            disabled={downloading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {downloading ? 'Downloading...' : '📥 Download PNG (High-Res)'}
          </motion.button>
          <motion.button
            className="qr-download-btn qr-download-btn-secondary"
            onClick={() => downloadQR('svg')}
            disabled={downloading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📄 Download SVG
          </motion.button>
        </motion.div>
      )}

      <div className="qr-info">
        <p className="qr-url">{value}</p>
        <p className="qr-hint">Scan with your phone camera</p>
      </div>
    </motion.div>
  )
}

export default QRCodeDisplay

