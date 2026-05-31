import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ServiceCard({ service, companyId }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleBook = () => {
    if (!user) { navigate('/login'); return }
    navigate(`/book/${companyId}?serviceId=${service.id}`)
  }

  return (
    <div style={styles.card}>
      <div>
        <h3 style={styles.name}>{service.name}</h3>
        <p style={styles.desc}>{service.description}</p>
        <div style={styles.meta}>
          <span>{service.durationMinutes} min</span>
          <span style={styles.price}>${service.price}</span>
        </div>
      </div>
      <button onClick={handleBook} style={styles.btn}>Boka nu</button>
    </div>
  )
}

const styles = {
  card: { background: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  name: { margin: '0 0 0.3rem', fontSize: '1.1rem' },
  desc: { margin: '0 0 0.5rem', color: '#666', fontSize: '0.9rem' },
  meta: { display: 'flex', gap: '1rem', color: '#888', fontSize: '0.9rem' },
  price: { fontWeight: 'bold', color: '#e94560' },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }
}
