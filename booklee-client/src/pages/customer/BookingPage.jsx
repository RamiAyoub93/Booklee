import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { getCompany } from '../../api/companyApi'
import { getSlots } from '../../api/availabilityApi'
import { createBooking } from '../../api/bookingApi'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const STEPS = ['Tjänst', 'Tid', 'Bekräfta']

export default function BookingPage() {
  const { companyId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [company, setCompany] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getCompany(companyId).then(res => {
      setCompany(res.data)
      const preselected = searchParams.get('serviceId')
      if (preselected) {
        const svc = res.data.services.find(s => s.id === parseInt(preselected))
        if (svc) { setSelectedService(svc); setStep(1) }
      }
    }).finally(() => setLoading(false))
  }, [companyId])

  useEffect(() => {
    if (step === 1 && selectedService && selectedDate) {
      setSlotsLoading(true)
      getSlots(companyId, selectedService.id, selectedDate)
        .then(res => setSlots(res.data))
        .finally(() => setSlotsLoading(false))
    }
  }, [selectedDate, step])

  const handleConfirm = async () => {
    setError('')
    try {
      await createBooking({
        serviceId: selectedService.id,
        companyId: parseInt(companyId),
        startTime: selectedSlot.start,
        notes
      })
      navigate('/bookings')
    } catch (err) {
      setError(err.response?.data?.error || 'Bokningen misslyckades.')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div style={styles.page}>
      <h1>{company?.name}</h1>
      <div style={styles.steps}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ ...styles.step, ...(i <= step ? styles.stepActive : {}) }}>{s}</div>
        ))}
      </div>

      {step === 0 && (
        <div>
          <h2>Välj en tjänst</h2>
          <div style={styles.serviceList}>
            {company?.services.map(s => (
              <div key={s.id} onClick={() => { setSelectedService(s); setStep(1) }} style={styles.serviceOption}>
                <div>
                  <strong>{s.name}</strong>
                  <p style={styles.svcMeta}>{s.durationMinutes} min · {s.price} kr</p>
                </div>
                <span>→</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2>Välj datum och tid</h2>
          <p style={{ color: '#666' }}>Tjänst: <strong>{selectedService?.name}</strong></p>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(null) }}
            style={styles.dateInput}
          />
          {slotsLoading && <LoadingSpinner />}
          {!slotsLoading && selectedDate && (
            <div style={styles.slotsGrid}>
              {slots.filter(s => s.isAvailable).length === 0 && <p style={{ color: '#666' }}>Inga lediga tider detta datum.</p>}
              {slots.filter(s => s.isAvailable).map((s, i) => (
                <div key={i}
                  onClick={() => setSelectedSlot(s)}
                  style={{ ...styles.slot, ...(selectedSlot === s ? styles.slotSelected : {}) }}>
                  {new Date(s.start).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                </div>
              ))}
            </div>
          )}
          <div style={styles.navRow}>
            <button onClick={() => setStep(0)} style={styles.backBtn}>← Tillbaka</button>
            <button onClick={() => setStep(2)} disabled={!selectedSlot} style={styles.nextBtn}>Nästa →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Bekräfta bokning</h2>
          <div style={styles.summary}>
            <div style={styles.summaryRow}><span>Tjänst</span><strong>{selectedService?.name}</strong></div>
            <div style={styles.summaryRow}><span>Pris</span><strong>{selectedService?.price} kr</strong></div>
            <div style={styles.summaryRow}><span>Datum och tid</span><strong>{new Date(selectedSlot?.start).toLocaleString('sv-SE')}</strong></div>
            <div style={styles.summaryRow}><span>Varaktighet</span><strong>{selectedService?.durationMinutes} min</strong></div>
          </div>
          <textarea
            placeholder="Meddelande till företaget? (valfritt)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={styles.notes}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div style={styles.navRow}>
            <button onClick={() => setStep(1)} style={styles.backBtn}>← Tillbaka</button>
            <button onClick={handleConfirm} style={styles.confirmBtn}>Bekräfta bokning</button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { maxWidth: '680px', margin: '0 auto', padding: '2rem' },
  steps: { display: 'flex', gap: '0', margin: '1.5rem 0 2rem', borderBottom: '2px solid #eee' },
  step: { flex: 1, textAlign: 'center', padding: '0.7rem', color: '#aaa', borderBottom: '3px solid transparent' },
  stepActive: { color: '#e94560', borderBottom: '3px solid #e94560', fontWeight: 600 },
  serviceList: { display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' },
  serviceOption: { background: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  svcMeta: { margin: '0.3rem 0 0', color: '#888', fontSize: '0.9rem' },
  dateInput: { padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', marginTop: '0.5rem' },
  slotsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem', marginTop: '1rem' },
  slot: { background: '#f5f5f5', border: '2px solid transparent', borderRadius: '6px', padding: '0.6rem', textAlign: 'center', cursor: 'pointer', fontSize: '0.9rem' },
  slotSelected: { background: '#ffe0e6', border: '2px solid #e94560', color: '#e94560', fontWeight: 600 },
  navRow: { display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' },
  backBtn: { background: 'none', border: '1px solid #ddd', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer' },
  nextBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer' },
  confirmBtn: { background: '#28a745', color: '#fff', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer' },
  summary: { background: '#f9f9f9', borderRadius: '8px', padding: '1.2rem', marginBottom: '1rem' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #eee' },
  notes: { width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem', resize: 'vertical', minHeight: '80px', boxSizing: 'border-box' }
}
