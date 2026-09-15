import { api } from './api.js'

export async function sendChatMessage(message) {
  const res = await api.post('/chatbot/message', { message })
  return res.data // { reply }
}
