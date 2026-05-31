import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getCompany } from '../../api/companyApi'
import ServiceCard from '../../components/company/ServiceCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function CompanyPage() {
  const { id } = useParams()
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCompany(id).then(res => setCompany(res.data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner />
  if (!company) return <p style={{ padding: '2rem' }}>Företaget hittades inte.</p>

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <span style={styles.category}>{company.category}</span>
        <h1 style={styles.name}>{company.name}</h1>
        <p style={styles.desc}>{company.description}</p>
        {company.address && <p style={styles.meta}>{company.address}</p>}
        {company.phone && <p style={styles.meta}>{company.phone}</p>}
      </div>
      <div style={styles.section}>
        <h2>Tjänster</h2>
        {company.services.length === 0 && <p style={{ color: '#666' }}>Inga tjänster listade ännu.</p>}
        <div style={styles.serviceList}>
          {company.services.map(s => (
            <ServiceCard key={s.id} service={s} companyId={company.id} />
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
  header: { marginBottom: '2rem' },
  category: { fontSize: '0.75rem', background: '#ffe0e6', color: '#e94560', padding: '0.2rem 0.6rem', borderRadius: '20px' },
  name: { fontSize: '2rem', margin: '0.5rem 0' },
  desc: { color: '#555', marginBottom: '0.5rem' },
  meta: { color: '#888', fontSize: '0.9rem', margin: '0.2rem 0' },
  section: { marginTop: '1.5rem' },
  serviceList: { display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }
}
