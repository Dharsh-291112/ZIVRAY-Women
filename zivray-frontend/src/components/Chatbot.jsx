import { useState } from 'react'
import { sendChatMessage } from '../services/chatbotService.js'

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi, I'm your ZIVRAY health assistant. How can I help today?" },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setSending(true)
    try {
      const { reply } = await sendChatMessage(userMsg.text)
      setMessages((m) => [...m, { from: 'bot', text: reply }])
    } catch {
      setMessages((m) => [...m, { from: 'bot', text: 'Sorry, I could not reach the AI service.' }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="zv-chat-widget">
      <div className="zv-chat-history">
        {messages.map((m, i) => (
          <div key={i} className={`zv-chat-bubble zv-chat-bubble--${m.from}`}>{m.text}</div>
        ))}
      </div>
      <div className="zv-chat-input-row">
        <input
          className="zv-input"
          placeholder="Ask about a symptom or report…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="zv-signin-btn" style={{ width: 'auto', padding: '10px 18px' }} onClick={handleSend} disabled={sending}>
          {sending ? '…' : 'Send'}
        </button>
      </div>
    </div>
  )
}
