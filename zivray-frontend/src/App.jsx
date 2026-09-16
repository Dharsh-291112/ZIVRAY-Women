import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import MedicalRecords from './pages/MedicalRecords.jsx'
import Appointments from './pages/Appointments.jsx'
import Emergency from './pages/Emergency.jsx'
import Chat from './pages/Chat.jsx'
import Insights from './pages/Insights.jsx'
import FaceAnalysis from './pages/FaceAnalysis.jsx'
import Introduction from './pages/Introduction.jsx'
import { useAuth } from './context/AuthContext.jsx'
import Chatbot from './components/Chatbot.jsx'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { token } = useAuth()
  const location = useLocation()

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={token ? <Dashboard /> : <Introduction />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/records" element={<PrivateRoute><MedicalRecords /></PrivateRoute>} />
        <Route path="/insights" element={<PrivateRoute><Insights /></PrivateRoute>} />
        <Route path="/derma-test" element={<PrivateRoute><FaceAnalysis /></PrivateRoute>} />
        <Route path="/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />
        <Route path="/emergency" element={<PrivateRoute><Emergency /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {token && location.pathname !== '/chat' && <Chatbot floating />}
    </>
  )
}
