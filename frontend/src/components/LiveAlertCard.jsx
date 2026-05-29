export default function LiveAlertCard({ alert }) {
  if (!alert) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Latest Alert</h3>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Live</span>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <span className="text-4xl mb-3">📡</span>
          <p className="text-sm">Waiting for alerts...</p>
          <p className="text-xs text-gray-600 mt-1">Touch the ESP32 to trigger an alert</p>
        </div>
      </div>
    )
  }

  const time = new Date(alert.createdAt || alert.timestamp).toLocaleTimeString()

  return (
    <div className="card border-accent-green/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Latest Alert</h3>
        <span className="flex items-center gap-1.5 text-xs text-accent-green">
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
          LIVE
        </span>
      </div>

      <div className="flex items-center gap-4 p-4 bg-dark-700 rounded-lg border border-accent-green/20">
        <div className="w-12 h-12 rounded-full bg-accent-green/10 flex items-center justify-center text-2xl">
          ⚡
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-semibold">{alert.device}</span>
            <span className="text-xs bg-accent-green/10 text-accent-green px-2 py-0.5 rounded-full">
              {alert.status}
            </span>
          </div>
          {alert.message && (
            <p className="text-sm text-gray-400 mt-1">{alert.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">{time}</p>
        </div>
      </div>
    </div>
  )
}
