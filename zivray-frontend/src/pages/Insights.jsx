import { useEffect, useState } from 'react'
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import Loading from '../components/Loading.jsx'
import { addAnalytic, fetchAnalytics } from '../services/medicalService.js'
import './Dashboard.css'

export default function Insights() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [analytics, setAnalytics] = useState([])
  const [loading, setLoading] = useState(true)
  const [metricForm, setMetricForm] = useState({ metric_name: 'Hemoglobin', metric_value: '' })
  const [metricError, setMetricError] = useState('')

  useEffect(() => {
    fetchAnalytics()
      .then(setAnalytics)
      .finally(() => setLoading(false))
  }, [])

  const handleMetricSubmit = async (event) => {
    event.preventDefault()
    setMetricError('')
    try {
      await addAnalytic(metricForm)
      setMetricForm({ ...metricForm, metric_value: '' })
      setAnalytics(await fetchAnalytics())
    } catch (error) {
      setMetricError(error?.response?.data?.detail || 'Could not save health reading')
    }
  }

  const metricData = analytics
    .map((item) => ({
      date: new Date(item.recorded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value: Number.parseFloat(item.metric_value) || 0,
    }))

  const latestByMetric = analytics.reduce((result, item) => {
    result[item.metric_name.toLowerCase()] = item
    return result
  }, {})
  const score = Math.min(98, 62 + analytics.length * 7)
  const scoreData = [{ name: 'wellness', value: score, fill: '#b76e79' }]
  const metricCards = [
    { label: 'Blood pressure', key: 'blood pressure', value: '118 / 76', icon: '🫀', tone: 'rose' },
    { label: 'Heart rate', key: 'heart rate', value: latestByMetric['heart rate']?.metric_value || '72 bpm', icon: '💓', tone: 'coral' },
    { label: 'Hemoglobin', key: 'hemoglobin', value: latestByMetric.hemoglobin?.metric_value || 'Add reading', icon: '🩸', tone: 'plum' },
    { label: 'Sugar level', key: 'sugar', value: latestByMetric.sugar?.metric_value || 'Add reading', icon: '🍬', tone: 'gold' },
    { label: 'Thyroid level', key: 'thyroid', value: latestByMetric.thyroid?.metric_value || 'Add reading', icon: '🦋', tone: 'sage' },
    { label: 'Period cycle', key: 'period cycle', value: 'On track', icon: '🌸', tone: 'peach' },
  ]

  return (
    <div className="zv-app-shell">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((value) => !value)} />
      <div className="zv-main-col">
        <Navbar />
        <main className="zv-main-content">
          <p className="zv-welcome-eyebrow">Personal health guidance</p>
          <h1 className="zv-hero-title">AI Insights</h1>
          <p className="zv-muted-text">A gentle snapshot of your readings, patterns, and daily wellness signals.</p>

          {loading ? <Loading /> : (
            <>
              <div className="zv-insight-grid">
                <div className="zv-panel-card zv-wellness-card">
                  <div><strong>Wellness rhythm</strong><p className="zv-muted-text">Your calm little check-in</p></div>
                  <ResponsiveContainer width="100%" height={180}>
                    <RadialBarChart innerRadius="72%" outerRadius="100%" startAngle={180} endAngle={0} data={scoreData} barSize={18}>
                      <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                      <RadialBar background dataKey="value" cornerRadius={12} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="zv-score-label"><strong>{score}</strong><span>/ 100</span></div>
                </div>
                <div className="zv-panel-card zv-chart-card">
                  <strong>Reading patterns</strong>
                  {metricData.length === 0 ? <p className="zv-muted-text">Add readings in My Health Vault to see your trends.</p> : (
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={metricData}>
                        <XAxis dataKey="date" /><YAxis /><Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#7f2945" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
              <div className="zv-metric-cards">
                {metricCards.map((metric) => (
                  <div className={`zv-metric-card zv-metric-card--${metric.tone}`} key={metric.label}>
                    <span className="zv-metric-icon">{metric.icon}</span><span className="zv-muted-text">{metric.label}</span>
                    <strong>{metric.value}</strong><small>{metric.key === 'period cycle' ? 'Cycle care' : 'Latest reading'}</small>
                  </div>
                ))}
              </div>
              <form onSubmit={handleMetricSubmit} className="zv-panel-card zv-metric-form">
                <strong>Add a health reading</strong>
                <select className="zv-input" value={metricForm.metric_name} onChange={(event) => setMetricForm({ ...metricForm, metric_name: event.target.value })}>
                  <option>Hemoglobin</option><option>Sugar</option><option>Heart Rate</option><option>Blood Pressure</option><option>Thyroid</option>
                </select>
                <input className="zv-input" type="number" step="any" min="0" placeholder="Value" value={metricForm.metric_value} onChange={(event) => setMetricForm({ ...metricForm, metric_value: event.target.value })} required />
                {metricError && <p className="zv-error">{metricError}</p>}
                <button className="zv-signin-btn" type="submit">Save reading</button>
              </form>
              <div className="zv-insight-grid">
                <div className="zv-panel-card zv-chart-card"><strong>Reading mix</strong><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={metricCards.map((item) => ({ name: item.label, value: latestByMetric[item.key] ? 1 : 0.35 }))} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={4}>{metricCards.map((item, index) => <Cell key={item.label} fill={['#b76e79', '#e39b79', '#7e5a7d', '#d7ad52', '#6b9a8c', '#edae9f'][index]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
                <div className="zv-panel-card zv-chart-card"><strong>Body signals</strong><ResponsiveContainer width="100%" height={220}><BarChart data={metricCards.slice(0, 5)}><XAxis dataKey="label" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey={(item) => Number.parseFloat(item.value) || 0} fill="#c57b45" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
              </div>
              <div className="zv-mood-card"><div><span className="zv-wink">✦</span><strong>Mood predictor</strong><p className="zv-muted-text">You seem to be glowing gently today.</p></div><div className="zv-mood-actions"><button type="button" title="Feeling happy">😊</button><button type="button" title="Feeling calm">🌿</button><button type="button" title="Need rest">🫶</button><button type="button" title="Feeling energetic">✨</button></div></div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}