import { useSocket } from '../context/SocketContext'

export default function ActivityFeed() {
  const { alerts } = useSocket()

  const getStatusColor = (status) => {
    switch (status) {
      case 'Touch Detected':
        return 'bg-accent-green/10 text-accent-green border-accent-green/20'
      case 'Button Pressed':
        return 'bg-accent-amber/10 text-accent-amber border-accent-amber/20'
      case 'Device Online':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'Device Offline':
        return 'bg-accent-red/10 text-accent-red border-accent-red/20'
      default:
        return 'bg-gray-700 text-gray-300 border-gray-600'
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
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Real-Time Activity Feed</h3>
        <span className="text-xs text-gray-500">{alerts.length} events</span>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <span className="text-3xl mb-2">📡</span>
            <p className="text-sm">No activity yet</p>
          </div>
        ) : (
          alerts.map((alert, i) => {
            const time = new Date(alert.createdAt || alert.timestamp).toLocaleTimeString()
            return (
              <div
                key={alert._id || i}
                className="flex items-center gap-3 p-3 rounded-lg bg-dark-700/50 border border-dark-600 hover:border-dark-500 transition-colors"
              >
                <span className="text-lg">{getIcon(alert.status)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">
                      {alert.device}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                  </div>
                  {alert.message && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{alert.message}</p>
                  )}
                </div>
                <span className="text-xs text-gray-500 shrink-0">{time}</span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
