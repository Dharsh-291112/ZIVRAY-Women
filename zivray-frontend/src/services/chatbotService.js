import { api } from './api.js'

export async function sendChatMessage(message) {
  const res = await api.post('/chatbot/message', { message })
  return res.data // { reply }
}

export async function fetchChatSuggestions() {
  const res = await api.get('/chatbot/suggestions')
  return res.data.suggestions
}

export async function fetchChatHistory() {
  const res = await api.get('/chatbot/history')
  return res.data
}
