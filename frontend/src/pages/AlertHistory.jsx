import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function AlertHistory() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { token } = useAuth()

  const fetchAlerts = async (p) => {
    try {
      const res = await fetch(`${API_URL}/api/alerts?page=${p}&limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setAlerts(data.alerts)
      setTotalPages(data.pages || 1)
    } catch (err) {
      toast.error('Failed to load alert history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts(page)
  }, [page, token])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Touch Detected': return 'bg-accent-green/10 text-accent-green'
      case 'Button Pressed': return 'bg-accent-amber/10 text-accent-amber'
      case 'Device Online': return 'bg-blue-500/10 text-blue-400'
      case 'Device Offline': return 'bg-accent-red/10 text-accent-red'
      default: return 'bg-gray-700 text-gray-300'
    }
  }

  const getIcon = (status) => {
    switch (status) {
      case 'Touch Detected': return '👆'
      case 'Button Pressed': return '🔘'
      case 'Device Online': return '🟢'
      case 'Device Offline': return '🔴'
      default: return '📡'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Alert History</h1>
          <p className="text-sm text-gray-500 mt-1">Complete log of all ESP32 alerts</p>
        </div>
        <button
          onClick={() => fetchAlerts(page)}
          className="text-sm text-gray-400 hover:text-accent-green transition-colors border border-dark-600 rounded-lg px-4 py-2 hover:border-accent-green/30"
        >
          Refresh
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-green"></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <span className="text-4xl mb-3">📭</span>
            <p className="text-sm">No alerts recorded yet</p>
            <p className="text-xs text-gray-600 mt-1">Touch your ESP32 to generate alerts</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-600">
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider pb-3 pr-4">Event</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider pb-3 pr-4">Device</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider pb-3 pr-4">Status</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider pb-3 pr-4">Message</th>
                  <th className="text-right text-xs text-gray-500 uppercase tracking-wider pb-3">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert, i) => (
                  <tr key={alert._id || i} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors">
                    <td className="py-3 pr-4 text-lg">{getIcon(alert.status)}</td>
                    <td className="py-3 pr-4 text-sm text-white font-medium">{alert.device}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-400">{alert.message || '—'}</td>
                    <td className="py-3 text-right text-sm text-gray-500 font-mono">
                      {new Date(alert.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-dark-600">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-sm text-gray-400 hover:text-accent-green disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-sm text-gray-400 hover:text-accent-green disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
