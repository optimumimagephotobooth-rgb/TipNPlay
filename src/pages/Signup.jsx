import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AnimatedButton from '../components/AnimatedButton'
import FadeIn from '../components/FadeIn'
import { sanitizeInput } from '../utils/sanitize'
import { trackSignup } from '../utils/analytics'
import toast from 'react-hot-toast'
import './Auth.css'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Sanitize inputs
      const sanitizedFullName = sanitizeInput(fullName)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: sanitizedFullName,
          },
        },
      })

      if (error) throw error

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: sanitizedFullName,
            subscription_tier: 'free',
            subscription_status: 'active',
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }
      }

      // Track signup
      trackSignup('email')
      
      toast.success('Account created! Please check your email to verify your account.')
      navigate('/dj-dashboard')
    } catch (error) {
      toast.error(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dj-dashboard`,
        },
      })

      if (error) throw error
      
      // Track Google signup
      trackSignup('google')
    } catch (error) {
      toast.error(error.message || 'Failed to sign up with Google')
    }
  }

  return (
    <div className="auth-container">
      <FadeIn>
        <div className="auth-card">
          <h1>Create Account</h1>
          <p className="auth-subtitle">Start accepting tips today</p>

          <form onSubmit={handleSignup} className="auth-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading}
              />
              <small>Minimum 6 characters</small>
            </div>

            <AnimatedButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </AnimatedButton>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <AnimatedButton
            onClick={handleGoogleSignup}
            variant="secondary"
            className="auth-google-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </AnimatedButton>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </FadeIn>
    </div>
  )
}

export default Signup

