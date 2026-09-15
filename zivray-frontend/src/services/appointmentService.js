import { api } from './api.js'

export async function fetchAppointments() {
  const res = await api.get('/appointments/')
  return res.data
}

export async function bookAppointment(payload) {
  const res = await api.post('/appointments/', payload)
  return res.data
}
