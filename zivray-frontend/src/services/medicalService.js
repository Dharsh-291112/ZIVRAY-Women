import { api } from './api.js'

export async function fetchRecords() {
  const res = await api.get('/medical-records/')
  return res.data
}

export async function uploadRecord(payload) {
  const res = await api.post('/medical-records/', payload)
  return res.data
}

export async function fetchAnalytics() {
  const res = await api.get('/medical-records/analytics')
  return res.data
}
