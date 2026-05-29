import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AlertHistory from './pages/AlertHistory'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-dark-900">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <AlertHistory />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}
