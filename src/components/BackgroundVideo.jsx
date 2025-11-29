import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import './BackgroundVideo.css'

/**
 * Optimized Background Video Component
 * Features:
 * - Lazy loading
 * - Non-blocking performance
 * - Mobile autoplay safety
 * - Fallback support
 * - Ultra-light instant-load
 */
function BackgroundVideo({ 
  src,
  poster,
  fallbackImage,
  className = '',
  overlay = true,
  opacity = 0.3
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const videoRef = useRef(null)
  const containerRef = useRef(null)

  // Lazy load video after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true)
    }, 100)

    if (typeof IntersectionObserver !== 'undefined' && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldLoad(true)
            observer.disconnect()
          }
        },
        { threshold: 0.25 }
      )

      observer.observe(containerRef.current)

      return () => {
        observer.disconnect()
        clearTimeout(timer)
      }
    }

    return () => clearTimeout(timer)
  }, [])

  // Handle video load
  const handleLoadedData = () => {
    setIsLoaded(true)
    // Ensure video plays
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked - that's okay, user can interact
      })
    }
  }

  // Handle video error - fallback to image
  const handleError = () => {
    setHasError(true)
    setIsLoaded(false)
  }

  // Handle video can play
  const handleCanPlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay blocked - will play on user interaction
      })
    }
  }

  return (
    <div
      ref={containerRef}
      className={`background-video-container ${className}`}
    >
      {/* Fallback image - shows immediately */}
      {fallbackImage && (
        <div 
          className="background-fallback"
          style={{ backgroundImage: `url(${fallbackImage})` }}
        />
      )}

      {/* Video element - lazy loaded */}
      {shouldLoad && !hasError && src && (
        <motion.video
          ref={videoRef}
          className="background-video"
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={handleLoadedData}
          onError={handleError}
          onCanPlay={handleCanPlay}
          style={{ opacity: isLoaded ? 1 : 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Premium CSS overlay */}
      {overlay && (
        <div 
          className="video-overlay"
          style={{ opacity }}
        />
      )}

      {/* Gradient overlay for better text readability */}
      <div className="gradient-overlay" />
    </div>
  )
}

export default BackgroundVideo

