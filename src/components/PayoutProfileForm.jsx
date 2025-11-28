import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import './PayoutProfileForm.css'

/**
 * Payout Profile Form Component
 * Add/edit payout methods for DJs
 */
const PAYOUT_METHODS = {
  bank: {
    name: 'Bank Transfer (ACH)',
    icon: '🏦',
    fields: ['account_name', 'routing_number', 'account_number', 'account_type']
  },
  stripe: {
    name: 'Stripe Connect',
    icon: '💳',
    fields: ['stripe_account_id']
  },
  paypal: {
    name: 'PayPal',
    icon: '📧',
    fields: ['paypal_email']
  },
  venmo: {
    name: 'Venmo',
    icon: '💸',
    fields: ['venmo_handle']
  },
  cashapp: {
    name: 'Cash App',
    icon: '💵',
    fields: ['cashapp_tag']
  }
}

function PayoutProfileForm({ 
  onSubmit, 
  onCancel, 
  initialData = null,
  userId 
}) {
  const [methodType, setMethodType] = useState(initialData?.method_type || 'bank')
  const [formData, setFormData] = useState({
    account_name: initialData?.account_details?.account_name || '',
    routing_number: initialData?.account_details?.routing_number || '',
    account_number: initialData?.account_details?.account_number || '',
    account_type: initialData?.account_details?.account_type || 'checking',
    paypal_email: initialData?.account_details?.paypal_email || '',
    venmo_handle: initialData?.account_details?.venmo_handle || '',
    cashapp_tag: initialData?.account_details?.cashapp_tag || '',
    stripe_account_id: initialData?.account_details?.stripe_account_id || '',
    is_default: initialData?.is_default || false
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      const method = PAYOUT_METHODS[methodType]
      const requiredFields = method.fields
      const accountDetails = {}

      for (const field of requiredFields) {
        if (!formData[field]) {
          toast.error(`Please fill in ${field.replace('_', ' ')}`)
          setLoading(false)
          return
        }
        accountDetails[field] = formData[field]
      }

      const payoutProfile = {
        method_type: methodType,
        account_details: accountDetails,
        is_default: formData.is_default,
        account_name: formData.account_name || accountDetails.paypal_email || accountDetails.venmo_handle || accountDetails.cashapp_tag || 'Payout Account'
      }

      if (onSubmit) {
        await onSubmit(payoutProfile)
      }

      toast.success('Payout method added successfully!')
      setLoading(false)
    } catch (error) {
      console.error('Error saving payout profile:', error)
      toast.error('Failed to save payout method')
      setLoading(false)
    }
  }

  const currentMethod = PAYOUT_METHODS[methodType]

  return (
    <motion.div
      className="payout-profile-form"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="form-title">
        {initialData ? 'Edit Payout Method' : 'Add Payout Method'}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Payout Method</label>
          <div className="method-selector">
            {Object.entries(PAYOUT_METHODS).map(([key, method]) => (
              <motion.button
                key={key}
                type="button"
                className={`method-option ${methodType === key ? 'active' : ''}`}
                onClick={() => setMethodType(key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="method-icon">{method.icon}</span>
                <span className="method-name">{method.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="form-fields">
          {methodType === 'bank' && (
            <>
              <div className="form-group">
                <label>Account Holder Name</label>
                <input
                  type="text"
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="form-group">
                <label>Routing Number</label>
                <input
                  type="text"
                  name="routing_number"
                  value={formData.routing_number}
                  onChange={handleInputChange}
                  placeholder="123456789"
                  maxLength="9"
                  required
                />
              </div>
              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleInputChange}
                  placeholder="0000000000"
                  required
                />
              </div>
              <div className="form-group">
                <label>Account Type</label>
                <select
                  name="account_type"
                  value={formData.account_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
              </div>
            </>
          )}

          {methodType === 'paypal' && (
            <div className="form-group">
              <label>PayPal Email</label>
              <input
                type="email"
                name="paypal_email"
                value={formData.paypal_email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
              />
            </div>
          )}

          {methodType === 'venmo' && (
            <div className="form-group">
              <label>Venmo Handle</label>
              <input
                type="text"
                name="venmo_handle"
                value={formData.venmo_handle}
                onChange={handleInputChange}
                placeholder="@username"
                required
              />
            </div>
          )}

          {methodType === 'cashapp' && (
            <div className="form-group">
              <label>Cash App Tag</label>
              <input
                type="text"
                name="cashapp_tag"
                value={formData.cashapp_tag}
                onChange={handleInputChange}
                placeholder="$username"
                required
              />
            </div>
          )}

          {methodType === 'stripe' && (
            <div className="form-group">
              <label>Connect Stripe Account</label>
              <button
                type="button"
                className="btn-stripe-connect"
                onClick={() => {
                  // Redirect to Stripe Connect onboarding
                  window.open('https://connect.stripe.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&scope=read_write', '_blank')
                }}
              >
                Connect Stripe Account
              </button>
              <p className="form-hint">
                You'll be redirected to Stripe to securely connect your account
              </p>
            </div>
          )}
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="is_default"
              checked={formData.is_default}
              onChange={handleInputChange}
            />
            <span>Set as default payout method</span>
          </label>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <motion.button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Saving...' : (initialData ? 'Update' : 'Add Method')}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

export default PayoutProfileForm

