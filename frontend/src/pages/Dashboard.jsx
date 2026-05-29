import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import AlertStatsCard from '../components/AlertStatsCard'
import EspStatusIndicator from '../components/EspStatusIndicator'
import LiveAlertCard from '../components/LiveAlertCard'
import ActivityFeed from '../components/ActivityFeed'
import EspBoardView from '../components/EspBoardView'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function Dashboard() {
  const { token } = useAuth()
  const { connected, deviceOnline, latestAlert } = useSocket()
  const [uptime, setUptime] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (!connected) return
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [connected])

  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}h ${m}m ${s}s`
    if (m > 0) return `${m}m ${s}s`
    return `${s}s`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitoring your ESP32 in real-time
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Session Uptime</p>
            <p className="text-sm text-accent-green font-mono">{formatUptime(uptime)}</p>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="text-sm text-gray-400 hover:text-accent-green transition-colors border border-dark-600 rounded-lg px-4 py-2 hover:border-accent-green/30"
          >
            View History →
          </button>
        </div>
      </div>

      <AlertStatsCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveAlertCard alert={latestAlert} />
        </div>
        <div>
          <EspStatusIndicator />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EspBoardView />
        <div className="space-y-6">
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}
