export default function MedicalCard({ record }) {
  return (
    <div className="zv-panel-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{record.title}</strong>
        {record.risk_flag && record.risk_flag !== 'None' && (
          <span className="zv-badge zv-badge-urgent">{record.risk_flag}</span>
        )}
      </div>
      <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: 'var(--zv-muted)' }}>
        {record.record_type.replace('_', ' ')} · {new Date(record.uploaded_at).toLocaleDateString()}
      </p>
      {record.ai_summary && (
        <p style={{ margin: '8px 0 0', fontSize: '0.82rem' }}>{record.ai_summary}</p>
      )}
    </div>
  )
}
