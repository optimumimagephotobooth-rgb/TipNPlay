import { Link, useLocation } from 'react-router-dom'
import './Layout.css'

function Layout({ children }) {
  const location = useLocation()
  const isTipPage = location.pathname.startsWith('/tip/')

  // Hide header/footer on tip page for cleaner guest experience
  if (isTipPage) {
    return <div className="layout">{children}</div>
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            TIPNPLAY ■ ■ ■ ■
          </Link>
          <nav className="nav">
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Link>
            <Link 
              to="/create-event" 
              className={location.pathname === '/create-event' ? 'active' : ''}
            >
              Create Event
            </Link>
            <Link 
              to="/dj-dashboard" 
              className={location.pathname === '/dj-dashboard' ? 'active' : ''}
            >
              DJ Dashboard
            </Link>
            <button className="theme-toggle">
              <img src="/lightning.svg" alt="Theme" />
            </button>
          </nav>
        </div>
      </header>
      <main className="main">
        {children}
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 TipnPlay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout

