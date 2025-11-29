import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { navLinks } from '../routes/routeConfig'
import './Layout.css'

function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const isTipPage = location.pathname.startsWith('/tip/')
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'
  const availableNavLinks = useMemo(
    () => navLinks.filter((route) => !route.requiresAuth || Boolean(user)),
    [user],
  )

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

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
            {availableNavLinks.map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {route.label}
              </NavLink>
            ))}
            {user ? (
              <button onClick={handleLogout} className="auth-btn logout-btn">
                Logout
              </button>
            ) : (
              !isAuthPage && (
                <Link to="/login" className="auth-btn login-btn">
                  Login
                </Link>
              )
            )}
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

