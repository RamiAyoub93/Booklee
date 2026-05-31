import { useState, useEffect } from 'react'
import { getMyCompany } from '../../api/companyApi'
import { getCompanyBookings, confirmBooking, cancelBooking } from '../../api/bookingApi'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function CompanyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getMyCompany()
      .then(res => getCompanyBookings(res.data.id))
      .then(res => setBookings(res.data))
      .finally(() => setLoading(false))
  }, [])

  const statusLabel = (s) => ({ Pending: 'Väntande', Confirmed: 'Bekräftad', Cancelled: 'Avbokad' }[s] ?? s)
  const filterLabel = (f) => ({ all: 'Alla', Pending: 'Väntande', Confirmed: 'Bekräftade', Cancelled: 'Avbokade' }[f])

  const handleConfirm = async (id) => {
    await confirmBooking(id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Confirmed' } : b))
  }

  const handleCancel = async (id) => {
    if (!confirm('Avboka den här bokningen?')) return
    await cancelBooking(id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b))
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  if (loading) return <LoadingSpinner />

  return (
    <div style={styles.page}>
      <h1>Bokningar</h1>
      <div style={styles.filters}>
        {['all', 'Pending', 'Confirmed', 'Cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}>
            {filterLabel(f)}
          </button>
        ))}
      </div>
      {filtered.length === 0 && <p style={{ color: '#666' }}>Inga bokningar hittades.</p>}
      <div style={styles.list}>
        {filtered.map(b => (
          <div key={b.id} style={styles.card}>
            <div style={styles.cardInfo}>
              <strong>{b.customerName}</strong>
              <span style={styles.email}>{b.customerEmail}</span>
              <span style={styles.service}>{b.serviceName} · {new Date(b.startTime).toLocaleString('sv-SE')}</span>
              <span style={styles.price}>{b.servicePrice} kr</span>
            </div>
            <div style={styles.cardActions}>
              <span style={{ ...styles.badge, ...getBadgeStyle(b.status) }}>{statusLabel(b.status)}</span>
              {b.status === 'Pending' && (
                <>
                  <button onClick={() => handleConfirm(b.id)} style={styles.confirmBtn}>Bekräfta</button>
                  <button onClick={() => handleCancel(b.id)} style={styles.cancelBtn}>Avboka</button>
                </>
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
  page: { maxWidth: '900px', margin: '0 auto', padding: '2rem' },
  filters: { display: 'flex', gap: '0.5rem', margin: '1rem 0 1.5rem' },
  filterBtn: { padding: '0.4rem 1rem', border: '1px solid #ddd', borderRadius: '20px', cursor: 'pointer', background: '#fff' },
  filterActive: { background: '#e94560', color: '#fff', border: '1px solid #e94560' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  card: { background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardInfo: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  email: { color: '#888', fontSize: '0.85rem' },
  service: { color: '#555', fontSize: '0.9rem' },
  price: { color: '#e94560', fontWeight: 'bold', fontSize: '0.9rem' },
  cardActions: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' },
  badge: { padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500 },
  confirmBtn: { background: '#28a745', color: '#fff', border: 'none', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' },
  cancelBtn: { background: 'none', border: '1px solid #e94560', color: '#e94560', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }
}
