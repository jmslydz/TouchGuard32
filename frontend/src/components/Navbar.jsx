import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { connected, deviceOnline } = useSocket()
  const location = useLocation()

  return (
    <nav className="bg-dark-800 border-b border-dark-600 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <span className="text-xl font-bold text-white">
              Touch<span className="text-accent-green">Guard</span>32
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-accent-green/10 text-accent-green border border-accent-green/30'
                  : 'text-gray-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/history"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/history'
                  ? 'bg-accent-green/10 text-accent-green border border-accent-green/30'
                  : 'text-gray-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              Alert History
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-accent-green animate-pulse' : 'bg-accent-red'}`}></span>
              <span className="text-gray-400">Server</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${deviceOnline ? 'bg-accent-green animate-pulse' : 'bg-gray-600'}`}></span>
              <span className="text-gray-400">ESP32</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-dark-600">
            <span className="text-sm text-gray-400">
              <span className="text-accent-green">{user?.username}</span>
            </span>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-accent-red transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
