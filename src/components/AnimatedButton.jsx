import { motion } from 'framer-motion'

/**
 * Animated button with hover and tap effects
 */
const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.95
  }
}

function AnimatedButton({ 
  children, 
  className = '', 
  onClick,
  disabled = false,
  variant = 'primary',
  ...props 
}) {
  const baseClasses = `btn btn-${variant} ${className}`
  
  return (
    <motion.button
      variants={buttonVariants}
      whileHover={disabled ? {} : 'hover'}
      whileTap={disabled ? {} : 'tap'}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default AnimatedButton

