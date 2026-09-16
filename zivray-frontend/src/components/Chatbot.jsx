import { useEffect, useState } from 'react'
import { fetchChatHistory, fetchChatSuggestions, sendChatMessage } from '../services/chatbotService.js'
import '../pages/Dashboard.css'

export default function Chatbot({ floating = false }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(!floating)

  useEffect(() => {
    Promise.all([fetchChatHistory(), fetchChatSuggestions()]).then(([history, nextSuggestions]) => {
      setMessages(history.map((item) => ({ from: item.sender, text: item.message })))
      setSuggestions(nextSuggestions)
    }).catch(() => {})
  }, [])

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

  const useSuggestion = (suggestion) => {
    setInput(suggestion)
  }

  if (floating && !open) {
    return (
      <button className="zv-chat-launcher" type="button" onClick={() => setOpen(true)} aria-label="Open ZIVRAY AI assistant">
        <span className="zv-chat-launcher-icon" aria-hidden="true">
          <img src="/assets/zivray-ai-icon.png" alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/assets/zivray-ai-icon.svg' }} />
          <span className="zv-chat-launcher-fallback">✦</span>
        </span>
        <span className="zv-chat-launcher-label">AI</span>
      </button>
    )
  }

  return (
    <div className={`zv-chat-widget ${floating ? 'zv-chat-widget--floating' : ''}`}>
      {floating && (
        <button className="zv-chat-close" type="button" onClick={() => setOpen(false)} aria-label="Close AI assistant">×</button>
      )}
      <div className="zv-chat-history">
        {messages.length === 0 && (
          <div className="zv-chat-bubble zv-chat-bubble--bot">Hi, I&apos;m your ZIVRAY women&apos;s health assistant. Ask me about symptoms, periods, pregnancy, records, appointments, or lab reports.</div>
        )}
        {messages.map((m, i) => (
          <div key={`${m.from}-${i}`} className={`zv-chat-bubble zv-chat-bubble--${m.from}`}>{m.text}</div>
        ))}
      </div>
      {suggestions.length > 0 && (
        <div className="zv-chat-suggestions" aria-label="Suggested questions">
          {suggestions.map((suggestion) => (
            <button key={suggestion} type="button" onClick={() => useSuggestion(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
      )}
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
