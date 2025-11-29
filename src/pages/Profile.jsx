import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AnimatedButton from '../components/AnimatedButton'
import FadeIn from '../components/FadeIn'
import toast from 'react-hot-toast'
import './Profile.css'

function Profile() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    email_notifications: true,
    weekly_summary: true,
    tip_notifications: true,
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      setUser(authUser)

      if (authUser) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (error && error.code !== 'PGRST116') throw error

        if (data) {
          setProfile(data)
          setFormData({
            full_name: data.full_name || '',
            email: data.email || authUser.email || '',
            email_notifications: data.email_notifications ?? true,
            weekly_summary: data.weekly_summary ?? true,
            tip_notifications: data.tip_notifications ?? true,
          })
        } else {
          // Create profile if doesn't exist
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert({
              id: authUser.id,
              email: authUser.email,
              full_name: authUser.user_metadata?.full_name || '',
            })
            .select()
            .single()

          if (createError) throw createError
          setProfile(newProfile)
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          email_notifications: formData.email_notifications,
          weekly_summary: formData.weekly_summary,
          tip_notifications: formData.tip_notifications,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Profile updated!')
      await loadProfile()
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <FadeIn>
        <div className="profile-card">
          <h1>My Profile</h1>

          <form onSubmit={handleSave} className="profile-form">
            <div className="form-section">
              <h2>Personal Information</h2>
              
              <div className="form-group">
                <label htmlFor="full_name">Full Name</label>
                <input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Your name"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="disabled-input"
                />
                <small>Email cannot be changed</small>
              </div>
            </div>

            <div className="form-section">
              <h2>Email Preferences</h2>
              
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.email_notifications}
                    onChange={(e) => setFormData({ ...formData, email_notifications: e.target.checked })}
                    disabled={saving}
                  />
                  <span>Enable email notifications</span>
                </label>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.tip_notifications}
                    onChange={(e) => setFormData({ ...formData, tip_notifications: e.target.checked })}
                    disabled={saving || !formData.email_notifications}
                  />
                  <span>Notify me when I receive tips</span>
                </label>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.weekly_summary}
                    onChange={(e) => setFormData({ ...formData, weekly_summary: e.target.checked })}
                    disabled={saving || !formData.email_notifications}
                  />
                  <span>Send weekly summary emails</span>
                </label>
              </div>
            </div>

            <div className="form-section">
              <h2>Account Information</h2>
              <div className="info-row">
                <span>Subscription Tier:</span>
                <span className="badge">{profile?.subscription_tier || 'free'}</span>
              </div>
              <div className="info-row">
                <span>Member Since:</span>
                <span>{new Date(profile?.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>

            <AnimatedButton
              type="submit"
              variant="primary"
              disabled={saving}
              className="save-btn"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </AnimatedButton>
          </form>
        </div>
      </FadeIn>
    </div>
  )
}

export default Profile

