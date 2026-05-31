import { useState, useEffect } from 'react'
import { getMyCompany } from '../../api/companyApi'
import { getAvailability, setAvailability } from '../../api/availabilityApi'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const DAYS = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag']

const defaultSchedule = DAYS.map((_, i) => ({
  dayOfWeek: i,
  startTime: '09:00',
  endTime: '17:00',
  isOpen: i >= 1 && i <= 5
}))

export default function ManageAvailability() {
  const [companyId, setCompanyId] = useState(null)
  const [schedule, setSchedule] = useState(defaultSchedule)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getMyCompany().then(res => {
      setCompanyId(res.data.id)
      return getAvailability(res.data.id)
    }).then(res => {
      if (res.data.length > 0) {
        const merged = defaultSchedule.map(def => {
          const found = res.data.find(a => a.dayOfWeek === def.dayOfWeek)
          return found ? { ...def, startTime: found.startTime, endTime: found.endTime, isOpen: found.isOpen } : def
        })
        setSchedule(merged)
      }
    }).finally(() => setLoading(false))
  }, [])

  const update = (index, field, value) => {
    setSchedule(prev => prev.map((d, i) => i === index ? { ...d, [field]: value } : d))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await setAvailability(companyId, schedule)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1>Tillgänglighet</h1>
        <button onClick={handleSave} disabled={saving} style={styles.saveBtn}>
          {saving ? 'Sparar...' : saved ? 'Sparat!' : 'Spara schema'}
        </button>
      </div>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>Ange dina veckovisa öppettider.</p>
      <div style={styles.list}>
        {schedule.map((day, i) => (
          <div key={i} style={styles.dayRow}>
            <div style={styles.dayLabel}>
              <input
                type="checkbox"
                checked={day.isOpen}
                onChange={e => update(i, 'isOpen', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              <span style={{ fontWeight: day.isOpen ? 600 : 400, color: day.isOpen ? '#1a1a2e' : '#aaa', width: '100px' }}>
                {DAYS[i]}
              </span>
            </div>
            {day.isOpen ? (
              <div style={styles.timeRow}>
                <input type="time" value={day.startTime} onChange={e => update(i, 'startTime', e.target.value)} style={styles.timeInput} />
                <span style={{ color: '#888' }}>till</span>
                <input type="time" value={day.endTime} onChange={e => update(i, 'endTime', e.target.value)} style={styles.timeInput} />
              </div>
            ) : (
              <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Stängt</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  page: { maxWidth: '700px', margin: '0 auto', padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  saveBtn: { background: '#28a745', color: '#fff', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  dayRow: { background: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  dayLabel: { display: 'flex', alignItems: 'center', minWidth: '150px' },
  timeRow: { display: 'flex', alignItems: 'center', gap: '0.8rem' },
  timeInput: { padding: '0.4rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem' }
}
