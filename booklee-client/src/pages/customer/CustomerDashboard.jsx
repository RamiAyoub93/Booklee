import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyBookings } from '../../api/bookingApi'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyBookings().then(res => setBookings(res.data)).finally(() => setLoading(false))
  }, [])

  const upcoming = bookings.filter(b => new Date(b.startTime) > new Date() && b.status !== 'Cancelled')

  if (loading) return <LoadingSpinner />

  const statusLabel = (status) => ({ Pending: 'Väntande', Confirmed: 'Bekräftad', Cancelled: 'Avbokad' }[status] ?? status)

  return (
    <div style={styles.page}>
      <h1>Välkommen, {user?.name}</h1>
      <div style={styles.statsRow}>
        <div style={styles.stat}>
          <span style={styles.statNum}>{upcoming.length}</span>
          <span style={styles.statLabel}>Kommande bokningar</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statNum}>{bookings.filter(b => b.status === 'Confirmed').length}</span>
          <span style={styles.statLabel}>Bekräftade</span>
        </div>
      </div>
      <div style={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Kommande bokningar</h2>
          <Link to="/" style={styles.bookBtn}>+ Boka något</Link>
        </div>
        {upcoming.length === 0 && <p style={{ color: '#666' }}>Inga kommande bokningar. <Link to="/">Bläddra bland tjänster</Link></p>}
        {upcoming.slice(0, 3).map(b => (
          <div key={b.id} style={styles.bookingCard}>
            <div>
              <strong>{b.serviceName}</strong> hos <strong>{b.companyName}</strong>
              <p style={styles.bookingTime}>{new Date(b.startTime).toLocaleString('sv-SE')}</p>
            </div>
            <span style={{ ...styles.badge, background: b.status === 'Confirmed' ? '#d4edda' : '#fff3cd', color: b.status === 'Confirmed' ? '#155724' : '#856404' }}>
              {statusLabel(b.status)}
            </span>
          </div>
        ))}
        {upcoming.length > 3 && <Link to="/bookings" style={styles.viewAll}>Visa alla bokningar</Link>}
      </div>
    </div>
  )
}

const styles = {
  page: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
  statsRow: { display: 'flex', gap: '1rem', margin: '1.5rem 0' },
  stat: { background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { fontSize: '2.5rem', fontWeight: 'bold', color: '#e94560' },
  statLabel: { color: '#666', fontSize: '0.9rem' },
  section: { background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '1.5rem' },
  bookBtn: { background: '#e94560', color: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem' },
  bookingCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 0', borderBottom: '1px solid #f0f0f0' },
  bookingTime: { color: '#888', fontSize: '0.85rem', margin: '0.2rem 0 0' },
  badge: { padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500 },
  viewAll: { display: 'block', textAlign: 'center', marginTop: '1rem', color: '#e94560' }
}
