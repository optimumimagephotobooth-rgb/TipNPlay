import { Link } from 'react-router-dom'
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
        <div className="hero-bg-animated"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="container">
            <h1 className="hero-title">Live Tips. Live Energy.</h1>
            <p className="hero-subtitle">
              The fastest micro-tipping platform for DJs, hosts & entertainers.
            </p>
            <div className="hero-actions">
              <Link to="/create-event" className="btn btn-primary">
                Get Started
              </Link>
              <div className="share-buttons">
                <button 
                  onClick={handleShareWhatsApp} 
                  className="btn btn-secondary"
                >
                  <img src="/whatsapp.svg" alt="WhatsApp" />
                  Share on WhatsApp
                </button>
                <button 
                  onClick={handleCopyLink} 
                  className="btn btn-secondary"
                >
                  <img src="/copy.svg" alt="Copy" />
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Event</h3>
              <p>Set up your tipping event in seconds</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Share Link</h3>
              <p>Share your unique tipping link with your audience</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Receive Tips</h3>
              <p>Get instant payouts directly to your account</p>
            </div>
          </div>
        </div>
      </section>

      <section className="key-benefits">
        <div className="container">
          <h2>Key Benefits</h2>
          <div className="benefits-grid">
            <div className="benefit">
              <span className="checkmark">✔</span>
              <span>Instant payouts — DJs keep 100%</span>
            </div>
            <div className="benefit">
              <span className="checkmark">✔</span>
              <span>One-tap tipping for guests</span>
            </div>
            <div className="benefit">
              <span className="checkmark">✔</span>
              <span>Perfect for clubs, weddings, parties & festivals</span>
            </div>
            <div className="benefit">
              <span className="checkmark">✔</span>
              <span>No account needed for tippers</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

