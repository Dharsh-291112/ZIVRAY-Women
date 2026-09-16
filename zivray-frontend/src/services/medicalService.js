import { api } from './api.js'

export async function fetchRecords() {
  const res = await api.get('/medical-records/')
  return res.data
}

export async function uploadRecord({ record_type, title, file }) {
  const formData = new FormData()
  formData.append('record_type', record_type)
  formData.append('title', title)
  if (file) formData.append('file', file)

  const res = await api.post('/medical-records/', formData)
  return res.data
}

export async function fetchAnalytics() {
  const res = await api.get('/medical-records/analytics')
  return res.data
}

export async function addAnalytic(payload) {
  const res = await api.post('/medical-records/analytics', payload)
  return res.data
}

export async function fetchCycleEvents() {
  const res = await api.get('/medical-records/cycle')
  return res.data
}

export async function addCycleEvent(payload) {
  const res = await api.post('/medical-records/cycle', payload)
  return res.data
}
