import { createContext, useContext, useState, useEffect } from 'react'
import { setAuthToken } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('zivray_token'))
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('zivray_user')
    return raw ? JSON.parse(raw) : null
  })

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  const login = (newToken, newUser) => {
    localStorage.setItem('zivray_token', newToken)
    localStorage.setItem('zivray_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('zivray_token')
    localStorage.removeItem('zivray_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
