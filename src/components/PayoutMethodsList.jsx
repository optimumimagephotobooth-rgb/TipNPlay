import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import PayoutProfileForm from './PayoutProfileForm'
import './PayoutMethodsList.css'

/**
 * Payout Methods List Component
 * Display and manage all payout methods
 */
function PayoutMethodsList({ userId }) {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProfile, setEditingProfile] = useState(null)

  useEffect(() => {
    loadProfiles()
  }, [userId])

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('payout_profiles')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setProfiles(data || [])
    } catch (error) {
      console.error('Error loading payout profiles:', error)
      toast.error('Failed to load payout methods')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProfile = async (profileData) => {
    try {
      const { data, error } = await supabase
        .from('payout_profiles')
        .insert({
          user_id: userId,
          ...profileData
        })
        .select()
        .single()

      if (error) throw error

      // If set as default, unset others
      if (profileData.is_default) {
        await supabase
          .from('payout_profiles')
          .update({ is_default: false })
          .eq('user_id', userId)
          .neq('id', data.id)
      }

      toast.success('Payout method added!')
      setShowForm(false)
      loadProfiles()
    } catch (error) {
      console.error('Error adding payout profile:', error)
      toast.error('Failed to add payout method')
    }
  }

  const handleDelete = async (profileId) => {
    if (!confirm('Are you sure you want to delete this payout method?')) return

    try {
      const { error } = await supabase
        .from('payout_profiles')
        .delete()
        .eq('id', profileId)

      if (error) throw error
      toast.success('Payout method deleted')
      loadProfiles()
    } catch (error) {
      console.error('Error deleting payout profile:', error)
      toast.error('Failed to delete payout method')
    }
  }

  const handleSetDefault = async (profileId) => {
    try {
      // Unset all defaults
      await supabase
        .from('payout_profiles')
        .update({ is_default: false })
        .eq('user_id', userId)

      // Set new default
      const { error } = await supabase
        .from('payout_profiles')
        .update({ is_default: true })
        .eq('id', profileId)

      if (error) throw error
      toast.success('Default payout method updated')
      loadProfiles()
    } catch (error) {
      console.error('Error setting default:', error)
      toast.error('Failed to update default method')
    }
  }

  const getMethodIcon = (type) => {
    const icons = {
      bank: '🏦',
      stripe: '💳',
      paypal: '📧',
      venmo: '💸',
      cashapp: '💵'
    }
    return icons[type] || '💰'
  }

  const getMethodName = (type) => {
    const names = {
      bank: 'Bank Transfer',
      stripe: 'Stripe Connect',
      paypal: 'PayPal',
      venmo: 'Venmo',
      cashapp: 'Cash App'
    }
    return names[type] || type
  }

  const maskAccountInfo = (profile) => {
    const details = profile.account_details || {}
    if (profile.method_type === 'bank') {
      return `****${details.account_number?.slice(-4) || '****'}`
    }
    if (profile.method_type === 'paypal') {
      return details.paypal_email || 'N/A'
    }
    if (profile.method_type === 'venmo') {
      return details.venmo_handle || 'N/A'
    }
    if (profile.method_type === 'cashapp') {
      return details.cashapp_tag || 'N/A'
    }
    return 'Connected'
  }

  if (loading) {
    return <div className="loading">Loading payout methods...</div>
  }

  return (
    <div className="payout-methods-list">
      <div className="methods-header">
        <h3>Payout Methods</h3>
        <motion.button
          className="btn-add"
          onClick={() => {
            setEditingProfile(null)
            setShowForm(true)
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + Add Method
        </motion.button>
      </div>

      {showForm && (
        <PayoutProfileForm
          onSubmit={handleAddProfile}
          onCancel={() => {
            setShowForm(false)
            setEditingProfile(null)
          }}
          initialData={editingProfile}
          userId={userId}
        />
      )}

      {profiles.length === 0 && !showForm ? (
        <div className="empty-state">
          <p>No payout methods added yet</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Add Your First Payout Method
          </button>
        </div>
      ) : (
        <div className="methods-grid">
          {profiles.map((profile) => (
            <motion.div
              key={profile.id}
              className={`method-card ${profile.is_default ? 'default' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="method-header">
                <div className="method-icon">{getMethodIcon(profile.method_type)}</div>
                <div className="method-info">
                  <h4>{getMethodName(profile.method_type)}</h4>
                  <p className="method-details">{maskAccountInfo(profile)}</p>
                  {profile.is_default && (
                    <span className="default-badge">Default</span>
                  )}
                </div>
              </div>

              <div className="method-actions">
                {!profile.is_default && (
                  <button
                    className="btn-action"
                    onClick={() => handleSetDefault(profile.id)}
                  >
                    Set as Default
                  </button>
                )}
                <button
                  className="btn-action btn-edit"
                  onClick={() => {
                    setEditingProfile(profile)
                    setShowForm(true)
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn-action btn-delete"
                  onClick={() => handleDelete(profile.id)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PayoutMethodsList

