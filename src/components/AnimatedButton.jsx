import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

/**
 * Animated button with hover and tap effects
 * Supports both button and Link (from react-router-dom)
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
  to,
  as,
  ...props 
}) {
  const baseClasses = `btn btn-${variant} ${className}`
  const motionProps = {
    variants: buttonVariants,
    whileHover: disabled ? {} : 'hover',
    whileTap: disabled ? {} : 'tap',
    className: baseClasses,
    ...props
  }
  
  // If 'to' prop is provided, render as Link
  if (to) {
    return (
      <motion.div
        variants={buttonVariants}
        whileHover={disabled ? {} : 'hover'}
        whileTap={disabled ? {} : 'tap'}
      >
        <Link
          to={to}
          className={baseClasses}
          onClick={disabled ? (e) => e.preventDefault() : onClick}
          {...props}
        >
          {children}
        </Link>
      </motion.div>
    )
  }
  
  return (
    <motion.button
      {...motionProps}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}

export default AnimatedButton

