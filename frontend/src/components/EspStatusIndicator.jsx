import { useSocket } from '../context/SocketContext'

export default function EspStatusIndicator() {
  const { connected, deviceOnline } = useSocket()

  const status = !connected ? 'disconnected' : deviceOnline ? 'online' : 'offline'

  const config = {
    online: {
      dot: 'bg-accent-green animate-pulse',
      bg: 'bg-accent-green/5 border-accent-green/20',
      text: 'Device Connected',
      subtext: 'ESP32 is active and monitoring',
      color: 'text-accent-green',
    },
    offline: {
      dot: 'bg-gray-500',
      bg: 'bg-dark-700 border-dark-600',
      text: 'Device Offline',
      subtext: 'Waiting for ESP32 connection...',
      color: 'text-gray-400',
    },
    disconnected: {
      dot: 'bg-accent-red',
      bg: 'bg-accent-red/5 border-accent-red/20',
      text: 'Server Disconnected',
      subtext: 'Check your network connection',
      color: 'text-accent-red',
    },
  }

  const cfg = config[status]

  return (
    <div className={`card ${cfg.bg}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">ESP32 Status</h3>
        <span className={`w-3 h-3 rounded-full ${cfg.dot}`}></span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-xl">
          🔌
        </div>
        <div>
          <p className={`font-semibold ${cfg.color}`}>{cfg.text}</p>
          <p className="text-xs text-gray-500">{cfg.subtext}</p>
        </div>
      </div>
    </div>
  )
}
