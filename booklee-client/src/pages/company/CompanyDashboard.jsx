import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyCompany, createCompany } from '../../api/companyApi'
import { getCompanyBookings } from '../../api/bookingApi'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function CompanyDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [company, setCompany] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', category: '', phone: '', address: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    getMyCompany()
      .then(res => {
        setCompany(res.data)
        return getCompanyBookings(res.data.id)
      })
      .then(res => setBookings(res.data))
      .catch(() => setShowCreate(true))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await createCompany(form)
      setCompany(res.data)
      setShowCreate(false)
    } catch (err) {
      setError(err.response?.data?.error || 'Kunde inte skapa företaget.')
    }
  }

  if (loading) return <LoadingSpinner />

  if (showCreate) return (
    <div style={styles.page}>
      <h1>Konfigurera ditt företag</h1>
      <p style={{ color: '#666' }}>Fyll i dina företagsuppgifter för att komma igång.</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleCreate} style={styles.form}>
        {[['name', 'Företagsnamn'], ['category', 'Kategori (t.ex. Frisör)'], ['description', 'Beskrivning'], ['phone', 'Telefon (valfritt)'], ['address', 'Adress (valfritt)']].map(([key, label]) => (
          <div key={key} style={styles.field}>
            <label>{label}</label>
            <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={styles.input} required={key === 'name' || key === 'category'} />
          </div>
        ))}
        <button type="submit" style={styles.btn}>Skapa företag</button>
      </form>
    </div>
  )

  const todayBookings = bookings.filter(b => {
    const d = new Date(b.startTime)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  })

  const statusLabel = (s) => ({ Pending: 'Väntande', Confirmed: 'Bekräftad', Cancelled: 'Avbokad' }[s] ?? s)

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1>{company?.name}</h1>
          <p style={{ color: '#888' }}>{company?.category} · {company?.address}</p>
        </div>
        <Link to="/company/bookings" style={styles.viewAllBtn}>Visa alla bokningar</Link>
      </div>
      <div style={styles.statsRow}>
        {[
          ["Dagens bokningar", todayBookings.length],
          ['Totalt bokningar', bookings.length],
          ['Väntande', bookings.filter(b => b.status === 'Pending').length],
          ['Tjänster', company?.services?.length || 0]
        ].map(([label, val]) => (
          <div key={label} style={styles.stat}>
            <span style={styles.statNum}>{val}</span>
            <span style={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>
      <div style={styles.section}>
        <h2>Dagens schema</h2>
        {todayBookings.length === 0 && <p style={{ color: '#666' }}>Inga bokningar idag.</p>}
        {todayBookings.map(b => (
          <div key={b.id} style={styles.bookingCard}>
            <div>
              <strong>{b.customerName}</strong>
              <p style={styles.bookingMeta}>{b.serviceName} · {new Date(b.startTime).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <span style={{ ...styles.badge, ...getBadgeStyle(b.status) }}>{statusLabel(b.status)}</span>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  viewAllBtn: { background: '#1a1a2e', color: '#fff', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none', fontSize: '0.9rem' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' },
  stat: { background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { fontSize: '2rem', fontWeight: 'bold', color: '#e94560' },
  statLabel: { color: '#666', fontSize: '0.85rem' },
  section: { background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '1.5rem' },
  bookingCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 0', borderBottom: '1px solid #f0f0f0' },
  bookingMeta: { color: '#888', fontSize: '0.85rem', margin: '0.2rem 0 0' },
  badge: { padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500 },
  form: { background: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 20px rgba(0,0,0,0.08)', maxWidth: '500px', marginTop: '1.5rem' },
  field: { marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  input: { padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' },
  btn: { width: '100%', padding: '0.8rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }
}
