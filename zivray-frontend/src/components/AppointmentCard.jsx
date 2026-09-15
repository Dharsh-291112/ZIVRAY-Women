export default function AppointmentCard({ appointment, viewerRole }) {
  const dt = new Date(appointment.scheduled_at)
  const otherPartyName = viewerRole === 'doctor' ? appointment.patient_name : appointment.doctor_name

  return (
    <div className="zv-panel-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{otherPartyName || 'Appointment'}</strong>
        <span className={`zv-badge ${appointment.status === 'completed' ? 'zv-badge-complete' : 'zv-badge-urgent'}`}>
          {appointment.status}
        </span>
      </div>
      <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: 'var(--zv-muted)' }}>
        {dt.toLocaleDateString()} · {dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {appointment.mode === 'virtual' ? 'Virtual Consultation' : 'In Person'}
      </p>
    </div>
  )
}
