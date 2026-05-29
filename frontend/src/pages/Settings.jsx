import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import { useState, useEffect } from 'react'

export default function Settings() {
  const { user } = useAuth()
  const { connected, deviceOnline } = useSocket()
  const [sessionStart] = useState(new Date())
  const [uptime, setUptime] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.floor((Date.now() - sessionStart.getTime()) / 1000)
      const h = Math.floor(diff / 3600)
      const m = Math.floor((diff % 3600) / 60)
      const s = diff % 60
      setUptime(`${h}h ${m}m ${s}s`)
    }, 1000)
    return () => clearInterval(timer)
  }, [sessionStart])

  const copyToken = () => {
    const token = localStorage.getItem('token')
    if (token) navigator.clipboard.writeText(token)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="space-y-4">
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-3">Account</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Username</span>
              <span className="text-accent-green">{user?.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Session Uptime</span>
              <span className="text-white">{uptime}</span>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-3">Connection</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Server</span>
              <span className={`font-medium ${connected ? 'text-accent-green' : 'text-accent-red'}`}>
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ESP32 Device</span>
              <span className={`font-medium ${deviceOnline ? 'text-accent-green' : 'text-gray-500'}`}>
                {deviceOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">API URL</span>
              <span className="text-gray-300 font-mono text-xs">{import.meta.env.VITE_API_URL || 'http://localhost:5000'}</span>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-3">Developer</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Auth Token</span>
              <button
                onClick={copyToken}
                className="text-accent-green hover:text-accent-green/80 text-xs bg-accent-green/10 px-3 py-1 rounded-lg transition-colors"
              >
                Copy Token
              </button>
            </div>
            <p className="text-xs text-gray-500">Used for API testing. Token expires in 7 days.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
