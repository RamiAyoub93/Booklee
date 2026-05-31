import { useState, useEffect } from 'react'
import { getMyBookings, cancelBooking } from '../../api/bookingApi'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyBookings().then(res => setBookings(res.data)).finally(() => setLoading(false))
  }, [])

  const statusLabel = (s) => ({ Pending: 'Väntande', Confirmed: 'Bekräftad', Cancelled: 'Avbokad' }[s] ?? s)

  const handleCancel = async (id) => {
    if (!confirm('Avboka den här bokningen?')) return
    await cancelBooking(id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b))
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={styles.page}>
      <h1>Mina bokningar</h1>
      {bookings.length === 0 && <p style={{ color: '#666' }}>Inga bokningar ännu.</p>}
      <div style={styles.list}>
        {bookings.map(b => (
          <div key={b.id} style={styles.card}>
            <div style={styles.cardLeft}>
              <strong style={styles.service}>{b.serviceName}</strong>
              <span style={styles.company}>{b.companyName}</span>
              <span style={styles.time}>{new Date(b.startTime).toLocaleString('sv-SE')} — {new Date(b.endTime).toLocaleTimeString('sv-SE')}</span>
              <span style={styles.price}>{b.servicePrice} kr</span>
            </div>
            <div style={styles.cardRight}>
              <span style={{ ...styles.badge, ...getBadgeStyle(b.status) }}>{statusLabel(b.status)}</span>
              {b.status !== 'Cancelled' && new Date(b.startTime) > new Date() && (
                <button onClick={() => handleCancel(b.id)} style={styles.cancelBtn}>Avboka</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function getBadgeStyle(status) {
  if (status === 'Confirmed') return { background: '#d4edda', color: '#155724' }
  if (status === 'Cancelled') return { background: '#f8d7da', color: '#721c24' }
  return { background: '#fff3cd', color: '#856404' }
}

const styles = {
  page: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' },
  card: { background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  service: { fontSize: '1.1rem' },
  company: { color: '#555', fontSize: '0.9rem' },
  time: { color: '#888', fontSize: '0.85rem' },
  price: { color: '#e94560', fontWeight: 'bold', fontSize: '0.9rem' },
  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' },
  badge: { padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500 },
  cancelBtn: { background: 'none', border: '1px solid #e94560', color: '#e94560', cursor: 'pointer', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem' }
}
