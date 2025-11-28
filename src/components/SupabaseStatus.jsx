import { useState, useEffect } from 'react'
import { supabase, eventsTable, tipsTable } from '../lib/supabase'
import './SupabaseStatus.css'

function SupabaseStatus() {
  const [status, setStatus] = useState('checking')
  const [details, setDetails] = useState({})
  const [error, setError] = useState(null)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    setStatus('checking')
    setError(null)

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      // Check if configured
      const isConfigured = 
        supabaseUrl && 
        supabaseUrl !== 'https://your-project.supabase.co' &&
        supabaseKey &&
        supabaseKey !== 'your-anon-key'

      if (!isConfigured) {
        setStatus('not-configured')
        setDetails({
          message: 'Supabase credentials not found in environment variables',
          url: supabaseUrl || 'Not set',
          key: supabaseKey ? 'Set (hidden)' : 'Not set'
        })
        return
      }

      // Test connection
      const { data: eventsData, error: eventsError } = await supabase
        .from(eventsTable)
        .select('id')
        .limit(1)

      if (eventsError) {
        setStatus('error')
        setError(eventsError.message)
        setDetails({
          message: 'Connection failed',
          error: eventsError.message,
          hint: eventsError.message.includes('does not exist') 
            ? 'Run SUPABASE_SCHEMA.sql in your Supabase SQL Editor'
            : 'Check your credentials and network connection'
        })
        return
      }

      // Test tips table
      const { data: tipsData, error: tipsError } = await supabase
        .from(tipsTable)
        .select('id')
        .limit(1)

      if (tipsError) {
        setStatus('partial')
        setDetails({
          message: 'Events table works, but tips table has issues',
          error: tipsError.message
        })
        return
      }

      // Success!
      setStatus('connected')
      setDetails({
        message: 'Supabase connected successfully!',
        eventsTable: '✅ Working',
        tipsTable: '✅ Working',
        url: supabaseUrl
      })

    } catch (err) {
      setStatus('error')
      setError(err.message)
      setDetails({
        message: 'Connection test failed',
        error: err.message
      })
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return '✅'
      case 'not-configured':
        return '⚙️'
      case 'error':
      case 'partial':
        return '❌'
      default:
        return '⏳'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return '#4CAF50'
      case 'not-configured':
        return '#FF9800'
      case 'error':
      case 'partial':
        return '#F44336'
      default:
        return '#2196F3'
    }
  }

  return (
    <div className="supabase-status" style={{ borderColor: getStatusColor() }}>
      <div className="status-header">
        <span className="status-icon">{getStatusIcon()}</span>
        <h3>Supabase Connection Status</h3>
        <button onClick={checkConnection} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      <div className="status-body">
        {status === 'checking' && (
          <div className="status-message">
            <div className="spinner"></div>
            <p>Checking connection...</p>
          </div>
        )}

        {status === 'not-configured' && (
          <div className="status-message">
            <p><strong>Not Configured</strong></p>
            <p>{details.message}</p>
            <div className="setup-steps">
              <h4>Quick Setup:</h4>
              <ol>
                <li>Go to <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer">Supabase Dashboard</a></li>
                <li>Create a new project</li>
                <li>Go to Settings → API</li>
                <li>Copy your Project URL and anon key</li>
                <li>Add them to Replit Secrets:
                  <ul>
                    <li><code>VITE_SUPABASE_URL</code></li>
                    <li><code>VITE_SUPABASE_ANON_KEY</code></li>
                  </ul>
                </li>
                <li>Restart your Repl</li>
                <li>Run <code>SUPABASE_SCHEMA.sql</code> in Supabase SQL Editor</li>
              </ol>
            </div>
          </div>
        )}

        {status === 'connected' && (
          <div className="status-message success">
            <p><strong>✅ Connected!</strong></p>
            <p>{details.message}</p>
            <div className="status-details">
              <p><strong>Events Table:</strong> {details.eventsTable}</p>
              <p><strong>Tips Table:</strong> {details.tipsTable}</p>
              <p><strong>URL:</strong> <code>{details.url}</code></p>
            </div>
          </div>
        )}

        {(status === 'error' || status === 'partial') && (
          <div className="status-message error">
            <p><strong>❌ Connection Issue</strong></p>
            <p>{details.message}</p>
            {details.error && (
              <div className="error-details">
                <p><strong>Error:</strong> {details.error}</p>
                {details.hint && <p className="hint">💡 {details.hint}</p>}
              </div>
            )}
            <div className="troubleshooting">
              <h4>Troubleshooting:</h4>
              <ul>
                <li>Verify credentials in Replit Secrets</li>
                <li>Check if tables exist (run SUPABASE_SCHEMA.sql)</li>
                <li>Verify RLS policies are set correctly</li>
                <li>Check network connection</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SupabaseStatus

