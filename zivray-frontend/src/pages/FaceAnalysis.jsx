import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Sidebar from '../components/Sidebar.jsx'
import Navbar from '../components/Navbar.jsx'
import Loading from '../components/Loading.jsx'
import { postFaceScan } from '../services/faceAnalysisService.js'
import './Dashboard.css'

const METRICS = [
  ['Acne', 'Screens for visible blemish patterns and congestion.'],
  ['Pigmentation', 'Screens for uneven tone and darker patches.'],
  ['Redness/Inflammation', 'Screens for visible redness and irritation patterns.'],
  ['Dark circles', 'Screens for under-eye shadowing and tired-looking tone.'],
  ['Wrinkles & fine lines', 'Screens for visible lines and texture changes.'],
  ['Pores', 'Screens for the appearance of pore size and congestion.'],
  ['Skin texture', 'Screens for visible smoothness and surface variation.'],
]

const scoreCopy = (metric, score) => {
  if (score >= 80) return `${metric} looks broadly within the screening range.`
  if (score >= 60) return `Screening pattern associated with mild ${metric.toLowerCase()} variation — consult a dermatologist to confirm.`
  return `Screening pattern associated with ${metric.toLowerCase()} — consult a dermatologist to confirm.`
}

export default function FaceAnalysis() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [permission, setPermission] = useState('prompt')
  const [stream, setStream] = useState(null)
  const [capturedFile, setCapturedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const previewRef = useRef('')

  const chartData = useMemo(() => METRICS.map(([metric]) => ({
    metric,
    score: result?.scores?.[metric] || 0,
  })), [result])

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop())
      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    }
  }, [stream])

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream
  }, [stream])

  const setPreview = (file) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    const url = URL.createObjectURL(file)
    previewRef.current = url
    setPreviewUrl(url)
    setCapturedFile(file)
    setResult(null)
    setError('')
  }

  const enableCamera = async () => {
    setError('')
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermission('denied')
      setError('Camera access is not available in this browser. Upload a photo instead.')
      return
    }
    try {
      const nextStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      stream?.getTracks().forEach((track) => track.stop())
      setStream(nextStream)
      setPermission('granted')
    } catch {
      setPermission('denied')
      setError('Camera permission was denied. You can try again or upload a photo instead.')
    }
  }

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !video.videoWidth) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (blob) setPreview(new File([blob], 'derma-test-capture.jpg', { type: 'image/jpeg' }))
    }, 'image/jpeg', 0.9)
  }

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (file) setPreview(file)
  }

  const analyze = async () => {
    if (!capturedFile) return
    setAnalyzing(true)
    setError('')
    try {
      setResult(await postFaceScan(capturedFile))
      stream?.getTracks().forEach((track) => track.stop())
      setStream(null)
    } catch (scanError) {
      setError(scanError?.response?.data?.detail || 'The screening could not be completed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const retake = () => {
    setCapturedFile(null)
    setResult(null)
    setPreviewUrl('')
    setError('')
    enableCamera()
  }

  return (
    <div className="zv-app-shell">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((value) => !value)} />
      <div className="zv-main-col">
        <Navbar />
        <main className="zv-main-content zv-derma-page">
          <p className="zv-welcome-eyebrow">Private skin screening</p>
          <h1 className="zv-hero-title">Derma Test</h1>
          <p className="zv-muted-text zv-derma-intro">A gentle visual screening that looks for patterns across seven skin metrics. This is not a diagnosis, and your raw face image is not stored after the analysis request.</p>

          <section className="zv-derma-metrics" aria-label="Derma Test metrics">
            {METRICS.map(([metric, description], index) => <article className="zv-derma-metric" key={metric}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{metric}</strong><p>{description}</p></div></article>)}
          </section>

          {result && (
            <section className="zv-derma-results">
              <div className="zv-panel-card zv-derma-chart"><div className="zv-derma-result-heading"><div><strong>Screening snapshot</strong><p className="zv-muted-text">Overall screening score: {result.overall}%</p></div><span className="zv-derma-badge">Not diagnostic</span></div><ResponsiveContainer width="100%" height={320}><LineChart data={chartData} margin={{ top: 18, right: 18, bottom: 30, left: 0 }}><XAxis dataKey="metric" angle={-20} textAnchor="end" height={65} tick={{ fontSize: 11 }} /><YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} /><Tooltip formatter={(value) => [`${value}%`, 'Screening score']} /><Line type="monotone" dataKey="score" stroke="#7f2945" strokeWidth={3} dot={{ r: 5, fill: '#d98c96' }} /></LineChart></ResponsiveContainer></div>
              <div className="zv-derma-summary-grid">{METRICS.map(([metric]) => <div className="zv-panel-card" key={metric}><strong>{metric}</strong><p>{scoreCopy(metric, result.scores[metric])}</p><span className="zv-derma-score">{result.scores[metric]}%</span></div>)}</div>
              <div className="zv-derma-cta"><div><span className="zv-welcome-eyebrow">Next gentle step</span><h3>Talk with a {result.recommended_specialty}</h3><p>{result.summary}</p></div><Link className="zv-signin-btn" to="/appointments">Find a specialist</Link></div>
            </section>
          )}

          <section className="zv-camera-panel">
            <div className="zv-camera-copy"><span className="zv-welcome-eyebrow">Your photo stays private</span><h2>Start your Derma Test</h2><p>Use a well-lit, front-facing photo. We process the image for this screening request and do not save the raw face image to your vault.</p></div>
            {!capturedFile && permission === 'prompt' && <button className="zv-signin-btn" type="button" onClick={enableCamera}>Enable camera</button>}
            {permission === 'denied' && <div className="zv-camera-denied"><p>{error || 'Camera access was denied.'}</p><button className="zv-outline-btn" type="button" onClick={enableCamera}>Try camera again</button></div>}
            {permission === 'granted' && !capturedFile && <div className="zv-camera-live"><video ref={videoRef} autoPlay playsInline muted /><button className="zv-signin-btn" type="button" onClick={capturePhoto}>Capture photo</button></div>}
            {capturedFile && <div className="zv-captured-preview"><img src={previewUrl} alt="Captured Derma Test preview" /><div className="zv-camera-actions"><button className="zv-outline-btn" type="button" onClick={retake}>Retake</button><button className="zv-signin-btn" type="button" onClick={analyze} disabled={analyzing}>{analyzing ? 'Analyzing...' : 'Analyze photo'}</button></div></div>}
            <div className="zv-upload-fallback"><span>Camera unavailable?</span><label className="zv-outline-btn" htmlFor="derma-upload">Upload a photo instead</label><input id="derma-upload" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} /></div>
            {error && permission !== 'denied' && <p className="zv-error">{error}</p>}
            {analyzing && <Loading label="Preparing your screening…" />}
            <canvas ref={canvasRef} hidden />
          </section>
        </main>
      </div>
    </div>
  )
}