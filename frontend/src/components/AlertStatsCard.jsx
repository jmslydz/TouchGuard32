import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function AlertStatsCard() {
  const [stats, setStats] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/alerts/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [token])

  const cards = [
    {
      label: 'Total Alerts',
      value: stats?.total ?? '—',
      icon: '📊',
      color: 'text-accent-green',
      bg: 'bg-accent-green/5 border-accent-green/20',
    },
    {
      label: 'Touch Detected',
      value: stats?.touchDetected ?? '—',
      icon: '👆',
      color: 'text-accent-amber',
      bg: 'bg-accent-amber/5 border-accent-amber/20',
    },
    {
      label: 'Button Pressed',
      value: stats?.buttonPressed ?? '—',
      icon: '🔘',
      color: 'text-accent-red',
      bg: 'bg-accent-red/5 border-accent-red/20',
    },
    {
      label: "Today's Alerts",
      value: stats?.todayAlerts ?? '—',
      icon: '📅',
      color: 'text-blue-400',
      bg: 'bg-blue-500/5 border-blue-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`card ${card.bg}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">{card.icon}</span>
          </div>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          <p className="text-xs text-gray-500 mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  )
}
