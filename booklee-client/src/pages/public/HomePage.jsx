import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCompanies } from '../../api/companyApi'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function HomePage() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getCompanies().then(res => setCompanies(res.data)).finally(() => setLoading(false))
  }, [])

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <LoadingSpinner />

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Boka ditt nästa besök</h1>
        <p style={styles.heroSub}>Hitta topp-frisörer, salonger och mer.</p>
        <input
          placeholder="Sök på namn eller kategori..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.search}
        />
      </div>
      <div style={styles.grid}>
        {filtered.length === 0 && <p style={{ color: '#666' }}>Inga företag hittades.</p>}
        {filtered.map(c => (
          <Link to={`/companies/${c.id}`} key={c.id} style={styles.card}>
            <div style={styles.cardCategory}>{c.category}</div>
            <h3 style={styles.cardName}>{c.name}</h3>
            <p style={styles.cardDesc}>{c.description}</p>
            <p style={styles.cardServices}>{c.services?.length || 0} tjänster</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

const styles = {
  page: { padding: '0 2rem 3rem' },
  hero: { textAlign: 'center', padding: '3rem 0 2rem', background: '#1a1a2e', margin: '0 -2rem 2rem', color: '#fff' },
  heroTitle: { fontSize: '2.5rem', margin: '0 0 0.5rem' },
  heroSub: { color: '#aaa', marginBottom: '1.5rem' },
  search: { padding: '0.8rem 1.5rem', width: '100%', maxWidth: '500px', borderRadius: '30px', border: 'none', fontSize: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
  card: { background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '1.5rem', textDecoration: 'none', color: 'inherit', transition: 'box-shadow 0.2s', display: 'block' },
  cardCategory: { fontSize: '0.75rem', background: '#ffe0e6', color: '#e94560', padding: '0.2rem 0.6rem', borderRadius: '20px', display: 'inline-block', marginBottom: '0.5rem' },
  cardName: { margin: '0 0 0.5rem', fontSize: '1.2rem' },
  cardDesc: { color: '#666', fontSize: '0.9rem', margin: '0 0 0.8rem' },
  cardServices: { color: '#aaa', fontSize: '0.85rem', margin: 0 }
}
