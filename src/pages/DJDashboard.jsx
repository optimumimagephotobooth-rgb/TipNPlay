import { useState, useEffect } from 'react'
import './DJDashboard.css'

function DJDashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading events
    setTimeout(() => {
      setEvents([
        {
          id: 1,
          name: 'Summer Festival 2024',
          totalTips: 1250.50,
          tipCount: 45,
          date: '2024-07-15'
        },
        {
          id: 2,
          name: 'Club Night - Friday',
          totalTips: 890.25,
          tipCount: 32,
          date: '2024-07-20'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="dj-dashboard">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="dj-dashboard">
      <div className="container">
        <h1>DJ Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Events</h3>
            <p className="stat-value">{events.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Tips</h3>
            <p className="stat-value">${events.reduce((sum, e) => sum + e.totalTips, 0).toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Total Tips Received</h3>
            <p className="stat-value">{events.reduce((sum, e) => sum + e.tipCount, 0)}</p>
          </div>
        </div>

        <div className="events-section">
          <h2>Your Events</h2>
          {events.length === 0 ? (
            <div className="no-events">
              <p>You haven't created any events yet.</p>
              <a href="/create-event" className="btn btn-primary">Create Your First Event</a>
            </div>
          ) : (
            <div className="events-grid">
              {events.map(event => (
                <div key={event.id} className="event-card">
                  <h3>{event.name}</h3>
                  <div className="event-details">
                    <div className="event-stat">
                      <span className="label">Total Tips:</span>
                      <span className="value">${event.totalTips.toFixed(2)}</span>
                    </div>
                    <div className="event-stat">
                      <span className="label">Tip Count:</span>
                      <span className="value">{event.tipCount}</span>
                    </div>
                    <div className="event-stat">
                      <span className="label">Date:</span>
                      <span className="value">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button className="btn btn-secondary">View Details</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DJDashboard

