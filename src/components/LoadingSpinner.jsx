import './LoadingSpinner.css'

function LoadingSpinner({ fullScreen = true, size = 'large' }) {
  const spinnerClass = `loading-spinner ${size} ${fullScreen ? 'full-screen' : ''}`
  
  return (
    <div className={spinnerClass}>
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  )
}

export default LoadingSpinner

