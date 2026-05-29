import { useSocket } from '../context/SocketContext'

const TOUCH_PINS = {
  4:  { label: 'D4',  name: 'GPIO4 (T0)',  side: 'right', pos: 11, active: true },
  15: { label: 'D15', name: 'GPIO15 (T3)', side: 'right', pos: 14, active: true },
  13: { label: 'D13', name: 'GPIO13 (T4)', side: 'left',  pos: 14, active: true },
  12: { label: 'D12', name: 'GPIO12 (T5)', side: 'left',  pos: 12, active: true },
  14: { label: 'D14', name: 'GPIO14 (T6)', side: 'left',  pos: 11, active: true },
  27: { label: 'D27', name: 'GPIO27 (T7)', side: 'left',  pos: 10, active: true },
  33: { label: 'D33', name: 'GPIO33 (T8)', side: 'left',  pos: 7,  active: true },
  32: { label: 'D32', name: 'GPIO32 (T9)', side: 'left',  pos: 6,  active: true },
  0:  { label: 'D0',  name: 'BOOT (GPIO0)', side: 'right', pos: 12, active: false },
  2:  { label: 'D2',  name: 'LED (GPIO2)',  side: 'right', pos: 13, active: false },
}

const NON_TOUCH = [
  { label: 'EN',  side: 'left',  pos: 1  },
  { label: 'VP',  side: 'left',  pos: 2  },
  { label: 'VN',  side: 'left',  pos: 3  },
  { label: 'D34', side: 'left',  pos: 4  },
  { label: 'D35', side: 'left',  pos: 5  },
  { label: 'D25', side: 'left',  pos: 8  },
  { label: 'D26', side: 'left',  pos: 9  },
  { label: 'GND', side: 'left',  pos: 13, color: 'gray' },
  { label: 'D9',  side: 'left',  pos: 15 },
  { label: 'D23', side: 'right', pos: 1  },
  { label: 'D22', side: 'right', pos: 2  },
  { label: 'TX',  side: 'right', pos: 3  },
  { label: 'RX',  side: 'right', pos: 4  },
  { label: 'D21', side: 'right', pos: 5  },
  { label: 'D19', side: 'right', pos: 6  },
  { label: 'D18', side: 'right', pos: 7  },
  { label: 'D5',  side: 'right', pos: 8  },
  { label: 'D17', side: 'right', pos: 9  },
  { label: 'D16', side: 'right', pos: 10 },
  { label: 'GND', side: 'right', pos: 15, color: 'gray' },
]

function parseGpio(alert) {
  if (!alert || !alert.message) return null
  const m = alert.message.match(/GPIO(\d+)/)
  return m ? parseInt(m[1]) : null
}

function PinDot({ gpio, label, active, touched }) {
  const base = 'w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-all duration-300 z-10'
  if (touched) {
    return <div className={`${base} bg-accent-green text-black border-accent-green shadow-[0_0_15px_rgba(0,255,136,0.7)] scale-110`}>{label}</div>
  }
  if (active) {
    return <div className={`${base} bg-dark-700 text-accent-green border-accent-green/40 hover:border-accent-green`}>{label}</div>
  }
  return <div className={`${base} bg-dark-800 text-gray-600 border-dark-600`}>{label}</div>
}

function NonTouchDot({ label, color }) {
  const c = color === 'gray' ? 'text-gray-700 border-gray-800 bg-dark-900' : 'text-gray-600 border-dark-600 bg-dark-800'
  return <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-bold border ${c} z-10`}>{label}</div>
}

export default function EspBoardView() {
  const { latestAlert } = useSocket()
  const touchedGpio = parseGpio(latestAlert)

  const rightPins = [...NON_TOUCH.filter(p => p.side === 'right')]
  const leftPins = [...NON_TOUCH.filter(p => p.side === 'left')]

  Object.values(TOUCH_PINS).forEach(p => {
    const arr = p.side === 'right' ? rightPins : leftPins
    arr.push({ label: p.label, gpio: parseInt(Object.entries(TOUCH_PINS).find(([,v]) => v.label === p.label)?.[0]), side: p.side, pos: p.pos, active: p.active })
  })

  rightPins.sort((a, b) => a.pos - b.pos)
  leftPins.sort((a, b) => a.pos - b.pos)

  const renderCol = (pins) => pins.map((pin, i) => (
    <div key={i} className="flex items-center gap-1 h-6">
      {pin.gpio !== undefined ? (
        <PinDot gpio={pin.gpio} label={pin.label} active={pin.active} touched={pin.gpio === touchedGpio} />
      ) : (
        <NonTouchDot label={pin.label} color={pin.color} />
      )}
      {touchedGpio !== null && pin.gpio === touchedGpio && (
        <span className="text-[9px] text-accent-green font-bold animate-pulse ml-1">TOUCHED</span>
      )}
    </div>
  ))

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">ESP32 Dev Board</h3>
        {touchedGpio && (
          <span className="text-xs text-accent-green animate-pulse">
            ⚡ {TOUCH_PINS[touchedGpio]?.name || `GPIO${touchedGpio}`}
          </span>
        )}
      </div>

      <div className="relative bg-gradient-to-b from-dark-900 to-dark-800 rounded-xl border border-dark-600 p-3">
        {/* USB port */}
        <div className="flex justify-center mb-2">
          <div className="w-12 h-4 bg-gray-800 rounded-b-sm border border-gray-700 flex items-center justify-center">
            <span className="text-[6px] text-gray-600">USB</span>
          </div>
        </div>

        {/* Chip label */}
        <div className="text-center mb-2">
          <span className="text-[8px] text-gray-600 bg-dark-900 px-2 py-0.5 rounded">ESP32-WROOM-32</span>
        </div>

        {/* Board */}
        <div className="flex justify-between gap-1">
          {/* Left column */}
          <div className="flex flex-col items-center gap-0.5">
            {renderCol(leftPins)}
          </div>

          {/* Center - chip */}
          <div className="flex flex-col items-center justify-center px-2">
            <div className="w-14 h-16 bg-dark-900 border border-gray-700 rounded flex flex-col items-center justify-center gap-1">
              <div className="w-10 h-1 bg-gray-800 rounded" />
              <span className="text-[7px] text-gray-600">ESP32</span>
              <div className="flex gap-0.5">
                <div className="w-1 h-1 bg-gray-700 rounded-full" />
                <div className="w-1 h-1 bg-gray-700 rounded-full" />
                <div className="w-1 h-1 bg-gray-700 rounded-full" />
              </div>
            </div>
            {/* BOOT button */}
            <div className={`mt-2 w-6 h-3 rounded-sm border flex items-center justify-center cursor-pointer transition-all duration-300 ${latestAlert?.status === 'Button Pressed' ? 'bg-accent-green/30 border-accent-green shadow-[0_0_8px_rgba(0,255,136,0.5)]' : 'bg-dark-700 border-gray-700'}`}>
              <span className="text-[6px] text-gray-500">BOOT</span>
            </div>
            {/* EN button */}
            <div className="mt-0.5 w-6 h-3 rounded-sm bg-dark-700 border border-gray-700 flex items-center justify-center">
              <span className="text-[6px] text-gray-600">EN</span>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col items-center gap-0.5">
            {renderCol(rightPins)}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 mt-3 text-[9px] text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-green/40 border border-accent-green/40" /> Touch pin</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-dark-800 border border-dark-600" /> Other pin</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-green border-accent-green shadow-[0_0_6px_rgba(0,255,136,0.7)]" /> Touched!</span>
        </div>
      </div>
    </div>
  )
}
