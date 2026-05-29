import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export function SocketProvider({ children }) {
  const [connected, setConnected] = useState(false)
  const [deviceOnline, setDeviceOnline] = useState(false)
  const [latestAlert, setLatestAlert] = useState(null)
  const [alerts, setAlerts] = useState([])
  const socketRef = useRef(null)
  const audioRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3')
  }, [])

  useEffect(() => {
    if (!user) return

    const socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      toast.success('Connected to server', { icon: '🔌' })
    })

    socket.on('disconnect', () => {
      setConnected(false)
      setDeviceOnline(false)
      toast.error('Disconnected from server', { icon: '⚠️' })
    })

    socket.on('connect_error', () => {
      setConnected(false)
      setDeviceOnline(false)
    })

    socket.on('alert', (alert) => {
      setLatestAlert(alert)
      setAlerts((prev) => [alert, ...prev].slice(0, 100))
      if (audioRef.current) {
        audioRef.current.play().catch(() => {})
      }
    })

    socket.on('notification', (data) => {
      toast(data.message, {
        icon: '🔔',
        style: {
          background: '#1a1a2e',
          border: '1px solid #00ff88',
          color: '#fff',
        },
      })
    })

    socket.on('device-status', (data) => {
      setDeviceOnline(data.status === 'online')
    })

    return () => {
      socket.disconnect()
    }
  }, [user])

  return (
    <SocketContext.Provider value={{ connected, deviceOnline, latestAlert, alerts, socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider')
  }
  return context
}
