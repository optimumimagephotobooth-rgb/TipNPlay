import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import StaggerChildren, { itemVariants } from '../components/StaggerChildren'
import AnimatedButton from '../components/AnimatedButton'
import BackgroundVideo from '../components/BackgroundVideo'
import './Home.css'

function Home() {
  const handleShareWhatsApp = () => {
    const url = window.location.href
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out TipnPlay: ${url}`)}`, '_blank')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard!')
  }

  return (
    <div className="home">
      <div className="hero-section">
        {/* Optimized background video with fallback */}
        <BackgroundVideo
          src="/videos/hero-background.mp4"
          poster="/images/hero-poster.jpg"
          fallbackImage="/images/hero-fallback.jpg"
          overlay={true}
          opacity={0.3}
        />
        {/* CSS animation fallback (shows if video fails) */}
        <div className="hero-bg-animated"></div>
        <div className="hero-content">
          <div className="container">
            <FadeIn delay={0.2}>
              <motion.h1 
                className="hero-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
              >
                Live Tips. Live Energy.
              </motion.h1>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="hero-subtitle">
                The fastest micro-tipping platform for DJs, hosts & entertainers.
              </p>
            </FadeIn>
            <FadeIn delay={0.6}>
              <div className="hero-actions">
                <AnimatedButton 
                  to="/create-event"
                  variant="primary"
                >
                  Get Started
                </AnimatedButton>
                <div className="share-buttons">
                  <AnimatedButton 
                    onClick={handleShareWhatsApp} 
                    variant="secondary"
                  >
                    <img src="/whatsapp.svg" alt="WhatsApp" />
                    Share on WhatsApp
                  </AnimatedButton>
                  <AnimatedButton 
                    onClick={handleCopyLink} 
                    variant="secondary"
                  >
                    <img src="/copy.svg" alt="Copy" />
                    Copy Link
                  </AnimatedButton>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      <section className="how-it-works">
        <div className="container">
          <FadeIn delay={0.2}>
            <h2>How It Works</h2>
          </FadeIn>
          <StaggerChildren>
            <div className="steps">
              <motion.div className="step" variants={itemVariants}>
                <motion.div 
                  className="step-number"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  1
                </motion.div>
                <h3>Create Event</h3>
                <p>Set up your tipping event in seconds</p>
              </motion.div>
              <motion.div className="step" variants={itemVariants}>
                <motion.div 
                  className="step-number"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  2
                </motion.div>
                <h3>Share Link</h3>
                <p>Share your unique tipping link with your audience</p>
              </motion.div>
              <motion.div className="step" variants={itemVariants}>
                <motion.div 
                  className="step-number"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  3
                </motion.div>
                <h3>Receive Tips</h3>
                <p>Get instant payouts directly to your account</p>
              </motion.div>
            </div>
          </StaggerChildren>
        </div>
      </section>

      <section className="key-benefits">
        <div className="container">
          <FadeIn delay={0.2}>
            <h2>Key Benefits</h2>
          </FadeIn>
          <StaggerChildren>
            <div className="benefits-grid">
              <motion.div className="benefit" variants={itemVariants}>
                <motion.span 
                  className="checkmark"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  ✔
                </motion.span>
                <span>Instant payouts — DJs keep 100%</span>
              </motion.div>
              <motion.div className="benefit" variants={itemVariants}>
                <motion.span 
                  className="checkmark"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  ✔
                </motion.span>
                <span>One-tap tipping for guests</span>
              </motion.div>
              <motion.div className="benefit" variants={itemVariants}>
                <motion.span 
                  className="checkmark"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  ✔
                </motion.span>
                <span>Perfect for clubs, weddings, parties & festivals</span>
              </motion.div>
              <motion.div className="benefit" variants={itemVariants}>
                <motion.span 
                  className="checkmark"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  ✔
                </motion.span>
                <span>No account needed for tippers</span>
              </motion.div>
            </div>
          </StaggerChildren>
        </div>
      </section>
    </div>
  )
}

export default Home

