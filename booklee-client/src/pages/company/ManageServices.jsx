import { useState, useEffect } from 'react'
import { getMyCompany } from '../../api/companyApi'
import { getServices, createService, updateService, deleteService } from '../../api/serviceApi'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const emptyForm = { name: '', description: '', price: '', durationMinutes: '' }

export default function ManageServices() {
  const [companyId, setCompanyId] = useState(null)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyCompany().then(res => {
      setCompanyId(res.data.id)
      return getServices(res.data.id)
    }).then(res => setServices(res.data)).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = { ...form, price: parseFloat(form.price), durationMinutes: parseInt(form.durationMinutes) }
      if (editingId) {
        const res = await updateService(companyId, editingId, data)
        setServices(prev => prev.map(s => s.id === editingId ? res.data : s))
      } else {
        const res = await createService(companyId, data)
        setServices(prev => [...prev, res.data])
      }
      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm)
    } catch (err) {
      setError(err.response?.data?.error || 'Kunde inte spara tjänsten.')
    }
  }

  const handleEdit = (s) => {
    setForm({ name: s.name, description: s.description, price: s.price, durationMinutes: s.durationMinutes })
    setEditingId(s.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Ta bort den här tjänsten?')) return
    await deleteService(companyId, id)
    setServices(prev => prev.filter(s => s.id !== id))
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1>Tjänster</h1>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm) }} style={styles.addBtn}>
          {showForm ? 'Avbryt' : '+ Lägg till tjänst'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3>{editingId ? 'Redigera tjänst' : 'Ny tjänst'}</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {[['name', 'Namn'], ['description', 'Beskrivning'], ['price', 'Pris (kr)'], ['durationMinutes', 'Varaktighet (minuter)']].map(([key, label]) => (
            <div key={key} style={styles.field}>
              <label>{label}</label>
              <input
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                type={key === 'price' || key === 'durationMinutes' ? 'number' : 'text'}
                style={styles.input}
                required={key === 'name'}
              />
            </div>
          ))}
          <button type="submit" style={styles.saveBtn}>{editingId ? 'Uppdatera' : 'Skapa'} tjänst</button>
        </form>
      )}

      <div style={styles.list}>
        {services.length === 0 && <p style={{ color: '#666' }}>Inga tjänster ännu. Lägg till din första!</p>}
        {services.map(s => (
          <div key={s.id} style={styles.card}>
            <div>
              <strong>{s.name}</strong>
              <p style={styles.meta}>{s.durationMinutes} min · {s.price} kr</p>
              {s.description && <p style={styles.desc}>{s.description}</p>}
            </div>
            <div style={styles.actions}>
              <button onClick={() => handleEdit(s)} style={styles.editBtn}>Redigera</button>
              <button onClick={() => handleDelete(s.id)} style={styles.deleteBtn}>Ta bort</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  page: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  addBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer' },
  form: { background: '#f9f9f9', padding: '1.5rem', borderRadius: '10px', marginBottom: '1.5rem' },
  field: { marginBottom: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  input: { padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem' },
  saveBtn: { background: '#1a1a2e', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '6px', cursor: 'pointer', marginTop: '0.5rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  card: { background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  meta: { margin: '0.3rem 0', color: '#888', fontSize: '0.9rem' },
  desc: { margin: 0, color: '#666', fontSize: '0.85rem' },
  actions: { display: 'flex', gap: '0.5rem' },
  editBtn: { background: 'none', border: '1px solid #1a1a2e', color: '#1a1a2e', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer' },
  deleteBtn: { background: 'none', border: '1px solid #e94560', color: '#e94560', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }
}
