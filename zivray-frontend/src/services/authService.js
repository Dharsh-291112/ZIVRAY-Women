import { api } from './api.js'

export async function loginRequest({ identifier, password, role }) {
  const res = await api.post('/auth/login', { identifier, password, role })
  return res.data // { access_token, token_type, user }
}

export async function registerRequest(payload) {
  const res = await api.post('/auth/register', payload)
  return res.data
}

export async function fetchHomeSummary() {
  const res = await api.get('/users/me/home-summary')
  return res.data
}

export async function fetchMe() {
  const res = await api.get('/users/me')
  return res.data
}
