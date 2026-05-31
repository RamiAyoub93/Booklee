import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>Booklee</Link>
      <div style={styles.links}>
        {!user && (
          <>
            <Link to="/login" style={styles.link}>Logga in</Link>
            <Link to="/register" style={styles.link}>Registrera</Link>
          </>
        )}
        {user?.role === 'Customer' && (
          <>
            <Link to="/dashboard" style={styles.link}>Översikt</Link>
            <Link to="/bookings" style={styles.link}>Mina bokningar</Link>
          </>
        )}
        {user?.role === 'Owner' && (
          <>
            <Link to="/company/dashboard" style={styles.link}>Översikt</Link>
            <Link to="/company/bookings" style={styles.link}>Bokningar</Link>
            <Link to="/company/services" style={styles.link}>Tjänster</Link>
            <Link to="/company/availability" style={styles.link}>Tillgänglighet</Link>
          </>
        )}
        {user && (
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logga ut ({user.name})
          </button>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#1a1a2e', color: '#fff' },
  brand: { fontSize: '1.5rem', fontWeight: 'bold', color: '#e94560', textDecoration: 'none' },
  links: { display: 'flex', gap: '1rem', alignItems: 'center' },
  link: { color: '#fff', textDecoration: 'none' },
  logoutBtn: { background: 'none', border: '1px solid #e94560', color: '#e94560', cursor: 'pointer', padding: '0.3rem 0.8rem', borderRadius: '4px' }
}
