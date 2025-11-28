import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { format, subDays } from 'date-fns'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import QRCodeDisplay from '../components/QRCodeDisplay'
import QRCodeModal from '../components/QRCodeModal'
import { FacebookShareButton, TwitterShareButton, WhatsAppShareButton, EmailShareButton } from 'react-share'
import { supabase, eventsTable, tipsTable } from '../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import './DJDashboard.css'

function DJDashboard() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [timeRange, setTimeRange] = useState('7d') // 7d, 30d, all
  const [showQRModal, setShowQRModal] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    if (selectedEvent) {
      loadAnalytics(selectedEvent.id)
    }
  }, [selectedEvent, timeRange])

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from(eventsTable)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEvents(data || [])
      
      // Fallback demo data if Supabase not configured
      if (!data || data.length === 0) {
        setEvents([
          {
            id: 'demo1',
            name: 'Summer Festival 2024',
            totalTips: 1250.50,
            tipCount: 45,
            created_at: '2024-07-15T00:00:00Z'
          },
          {
            id: 'demo2',
            name: 'Club Night - Friday',
            totalTips: 890.25,
            tipCount: 32,
            created_at: '2024-07-20T00:00:00Z'
          }
        ])
      }
    } catch (error) {
      console.error('Error loading events:', error)
      // Use demo data
      setEvents([
        {
          id: 'demo1',
          name: 'Summer Festival 2024',
          totalTips: 1250.50,
          tipCount: 45,
          created_at: '2024-07-15T00:00:00Z'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const loadAnalytics = async (eventId) => {
    try {
      const { data, error } = await supabase
        .from(tipsTable)
        .select('amount, created_at')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Process data for charts
      const now = new Date()
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 365
      const startDate = subDays(now, daysAgo)

      const filteredData = (data || []).filter(tip => {
        const tipDate = new Date(tip.created_at)
        return tipDate >= startDate
      })

      // Group by day
      const dailyData = {}
      filteredData.forEach(tip => {
        const date = format(new Date(tip.created_at), 'MMM dd')
        if (!dailyData[date]) {
          dailyData[date] = { date, amount: 0, count: 0 }
        }
        dailyData[date].amount += parseFloat(tip.amount)
        dailyData[date].count += 1
      })

      const chartData = Object.values(dailyData)

      // Hourly distribution
      const hourlyData = Array(24).fill(0).map((_, hour) => ({
        hour: `${hour}:00`,
        count: filteredData.filter(tip => {
          const tipHour = new Date(tip.created_at).getHours()
          return tipHour === hour
        }).length
      }))

      setAnalytics({
        totalAmount: filteredData.reduce((sum, tip) => sum + parseFloat(tip.amount), 0),
        totalCount: filteredData.length,
        averageTip: filteredData.length > 0 
          ? filteredData.reduce((sum, tip) => sum + parseFloat(tip.amount), 0) / filteredData.length 
          : 0,
        chartData,
        hourlyData
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
      // Demo analytics
      setAnalytics({
        totalAmount: 1250.50,
        totalCount: 45,
        averageTip: 27.79,
        chartData: [
          { date: 'Jul 15', amount: 450, count: 15 },
          { date: 'Jul 16', amount: 320, count: 12 },
          { date: 'Jul 17', amount: 480, count: 18 }
        ],
        hourlyData: Array(24).fill(0).map((_, hour) => ({
          hour: `${hour}:00`,
          count: Math.floor(Math.random() * 5)
        }))
      })
    }
  }

  const getTipUrl = (eventId) => {
    return `${window.location.origin}/tip/${eventId}`
  }

  const handleShare = (platform, url) => {
    toast.success(`Sharing to ${platform}...`)
  }

  if (loading) {
    return (
      <div className="dj-dashboard">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    )
  }

  const totalTips = events.reduce((sum, e) => sum + (e.totalTips || 0), 0)
  const totalTipCount = events.reduce((sum, e) => sum + (e.tipCount || 0), 0)

  return (
    <div className="dj-dashboard">
      <Toaster />
      <div className="container">
        <SupabaseStatus />
        <div className="dashboard-header">
          <h1>DJ Dashboard</h1>
          <Link to="/create-event" className="btn btn-primary">
            + Create New Event
          </Link>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Events</h3>
            <p className="stat-value">{events.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Tips</h3>
            <p className="stat-value">${totalTips.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Total Tips Received</h3>
            <p className="stat-value">{totalTipCount}</p>
          </div>
          <div className="stat-card">
            <h3>Average Tip</h3>
            <p className="stat-value">
              ${totalTipCount > 0 ? (totalTips / totalTipCount).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="events-section">
            <h2>Your Events</h2>
            {events.length === 0 ? (
              <div className="no-events">
                <p>You haven't created any events yet.</p>
                <Link to="/create-event" className="btn btn-primary">Create Your First Event</Link>
              </div>
            ) : (
              <div className="events-grid">
                {events.map(event => (
                  <div 
                    key={event.id} 
                    className={`event-card ${selectedEvent?.id === event.id ? 'selected' : ''}`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="event-card-header">
                      <h3>{event.name}</h3>
                      <span className="event-date">
                        {format(new Date(event.created_at || Date.now()), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="event-stats">
                      <div className="event-stat">
                        <span className="label">Total:</span>
                        <span className="value">${(event.totalTips || 0).toFixed(2)}</span>
                      </div>
                      <div className="event-stat">
                        <span className="label">Tips:</span>
                        <span className="value">{event.tipCount || 0}</span>
                      </div>
                    </div>
                    <div className="event-actions">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/tip/${event.id}`)
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        View Page
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(getTipUrl(event.id))
                          toast.success('Link copied!')
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedEvent && (
            <div className="analytics-section">
              <div className="analytics-header">
                <h2>Analytics: {selectedEvent.name}</h2>
                <div className="time-range-selector">
                  <button 
                    className={timeRange === '7d' ? 'active' : ''}
                    onClick={() => setTimeRange('7d')}
                  >
                    7 Days
                  </button>
                  <button 
                    className={timeRange === '30d' ? 'active' : ''}
                    onClick={() => setTimeRange('30d')}
                  >
                    30 Days
                  </button>
                  <button 
                    className={timeRange === 'all' ? 'active' : ''}
                    onClick={() => setTimeRange('all')}
                  >
                    All Time
                  </button>
                </div>
              </div>

              {analytics && (
                <>
                  <div className="analytics-stats">
                    <div className="analytics-stat">
                      <label>Total Amount</label>
                      <div className="value">${analytics.totalAmount.toFixed(2)}</div>
                    </div>
                    <div className="analytics-stat">
                      <label>Total Tips</label>
                      <div className="value">{analytics.totalCount}</div>
                    </div>
                    <div className="analytics-stat">
                      <label>Average Tip</label>
                      <div className="value">${analytics.averageTip.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="charts-grid">
                    <div className="chart-card">
                      <h3>Tips Over Time</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                          <YAxis stroke="rgba(255,255,255,0.7)" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(0,0,0,0.9)', 
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '8px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="#FFD700" 
                            strokeWidth={2}
                            dot={{ fill: '#FFD700' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                      <h3>Tips by Hour</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.hourlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="hour" stroke="rgba(255,255,255,0.7)" />
                          <YAxis stroke="rgba(255,255,255,0.7)" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(0,0,0,0.9)', 
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '8px'
                            }}
                          />
                          <Bar dataKey="count" fill="#FFD700" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="share-section">
                    <h3>Share Your Event</h3>
                    <div className="share-buttons">
                      <WhatsAppShareButton url={getTipUrl(selectedEvent.id)} title={selectedEvent.name}>
                        <button className="share-btn whatsapp">WhatsApp</button>
                      </WhatsAppShareButton>
                      <FacebookShareButton url={getTipUrl(selectedEvent.id)}>
                        <button className="share-btn facebook">Facebook</button>
                      </FacebookShareButton>
                      <TwitterShareButton url={getTipUrl(selectedEvent.id)} title={selectedEvent.name}>
                        <button className="share-btn twitter">Twitter</button>
                      </TwitterShareButton>
                      <EmailShareButton url={getTipUrl(selectedEvent.id)} subject={selectedEvent.name}>
                        <button className="share-btn email">Email</button>
                      </EmailShareButton>
                    </div>
                    <div className="qr-section">
                      <QRCodeDisplay
                        value={getTipUrl(selectedEvent.id)}
                        size={200}
                        title="Event QR Code"
                        showDownload={true}
                        eventName={selectedEvent.name || selectedEvent.id}
                        customColors={{
                          fgColor: selectedEvent.custom_colors?.primary || '#000000',
                          bgColor: '#FFFFFF'
                        }}
                      />
                      <button 
                        onClick={() => setShowQRModal(true)}
                        className="btn btn-secondary"
                        style={{ marginTop: '1rem', width: '100%' }}
                      >
                        🔍 View Full Size
                      </button>
                    </div>
                    
                    <QRCodeModal
                      isOpen={showQRModal}
                      onClose={() => setShowQRModal(false)}
                      value={getTipUrl(selectedEvent.id)}
                      eventName={selectedEvent.name || selectedEvent.id}
                      customColors={{
                        fgColor: selectedEvent.custom_colors?.primary || '#000000',
                        bgColor: '#FFFFFF'
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DJDashboard
