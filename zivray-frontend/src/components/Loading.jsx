export default function Loading({ label = 'Loading…' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px', color: 'var(--zv-muted)', fontSize: '0.9rem',
    }}>
      {label}
    </div>
  )
}
