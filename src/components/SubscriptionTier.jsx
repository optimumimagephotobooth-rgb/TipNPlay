import { useState } from 'react'
import './SubscriptionTier.css'

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '1 event per month',
      'Basic tipping page',
      'QR code generation',
      'Email support'
    ],
    popular: false
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'month',
    features: [
      'Unlimited events',
      'Advanced analytics',
      'Custom branding',
      'Real-time notifications',
      'Priority support',
      'Export data (CSV)'
    ],
    popular: true
  },
  {
    name: 'Premium',
    price: '$19.99',
    period: 'month',
    features: [
      'Everything in Pro',
      'API access',
      'Team accounts',
      'Multi-currency support',
      'White-label option',
      'Dedicated support',
      'Custom integrations'
    ],
    popular: false
  }
]

function SubscriptionTier() {
  const [selectedTier, setSelectedTier] = useState(null)

  const handleSubscribe = (tierName) => {
    // In production, this would redirect to Stripe checkout
    alert(`Redirecting to checkout for ${tierName} plan...`)
    // window.location.href = `/checkout?plan=${tierName.toLowerCase()}`
  }

  return (
    <div className="subscription-section">
      <div className="container">
        <div className="subscription-header">
          <h2>Choose Your Plan</h2>
          <p>Start free, upgrade as you grow</p>
        </div>
        <div className="tiers-grid">
          {tiers.map((tier, index) => (
            <div 
              key={index} 
              className={`tier-card ${tier.popular ? 'popular' : ''}`}
            >
              {tier.popular && <div className="popular-badge">Most Popular</div>}
              <h3>{tier.name}</h3>
              <div className="tier-price">
                <span className="price">{tier.price}</span>
                <span className="period">/{tier.period}</span>
              </div>
              <ul className="tier-features">
                {tier.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="checkmark">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                className={`tier-button ${tier.popular ? 'primary' : 'secondary'}`}
                onClick={() => handleSubscribe(tier.name)}
              >
                {tier.name === 'Free' ? 'Get Started' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionTier

