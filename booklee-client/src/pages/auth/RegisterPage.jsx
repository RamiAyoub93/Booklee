import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register as registerApi } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Customer' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await registerApi(form)
      login(res.data.token, res.data.user)
      navigate(res.data.user.role === 'Owner' ? '/company/dashboard' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Registreringen misslyckades.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Skapa ditt konto</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label>Fullständigt namn</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label>E-post</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={styles.input} required />
          </div>
          <div style={styles.field}>
            <label>Lösenord</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={styles.input} required minLength={6} />
          </div>
          <div style={styles.field}>
            <label>Jag är en...</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={styles.input}>
              <option value="Customer">Kund — Jag vill boka tjänster</option>
              <option value="Owner">Företagsägare — Jag driver ett företag</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Skapar konto...' : 'Skapa konto'}
          </button>
        </form>
        <p style={styles.footer}>Har du redan ett konto? <Link to="/login">Logga in</Link></p>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  card: { background: '#fff', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px' },
  title: { marginBottom: '1.5rem', textAlign: 'center' },
  error: { color: 'red', marginBottom: '1rem', textAlign: 'center' },
  field: { marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  input: { padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' },
  btn: { width: '100%', padding: '0.8rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
  footer: { textAlign: 'center', marginTop: '1rem', color: '#666' }
}
