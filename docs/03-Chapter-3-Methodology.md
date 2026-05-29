# Chapter 3: Technical Background and Methodology

## 3.1 Technical Background

### 3.1.1 ESP32 Microcontroller

The ESP32 is a dual-core Tensilica Xtensa LX6 microcontroller developed by Espressif Systems, operating at up to 240 MHz. Key specifications relevant to this project include:

| Feature | Specification |
|---------|---------------|
| CPU | Dual-core Xtensa LX6 @ 240 MHz |
| SRAM | 520 KB |
| Flash | 4 MB (typical module) |
| WiFi | 802.11 b/g/n (2.4 GHz only) |
| Bluetooth | BLE 4.2 + Classic |
| Touch Pins | 10 capacitive touch sensors (T0-T9) |
| ADC | 12-bit, 18 channels |
| GPIO | 34 programmable pins |

The ESP32's touch sensor (TENS) peripheral measures capacitance changes on designated pins. When a finger approaches, the measured capacitance increases, causing the RC charging time to increase. The sensor returns a digital value inversely proportional to capacitance — lower values indicate touch.

### 3.1.2 Capacitive Touch Sensing Principle

Capacitive touch sensing relies on the human body's natural capacitance (approximately 100-300 pF). When a finger touches or approaches a conductive electrode connected to the ESP32 touch pin:

1. The ESP32 charges the electrode capacitance to a reference voltage.
2. It discharges through a constant current source.
3. The time to discharge is measured and converted to a digital count.
4. The count decreases as capacitance increases (i.e., when touched).

The default threshold of 40 provides a balance between sensitivity and noise immunity. Raw values in the 60-100 range (untouched) dropping below 40 indicate a touch event.

### 3.1.3 WebSocket Communication

WebSocket (RFC 6455) provides full-duplex communication over a single TCP connection. Unlike HTTP request-response cycles, WebSocket maintains a persistent connection between client and server, enabling:

- Real-time push notifications from server to client
- Reduced latency (no HTTP header overhead on each message)
- Lower bandwidth consumption (2-10 byte frame overhead)
- Bidirectional event-based messaging

Socket.IO extends WebSocket with:

- Automatic reconnection with exponential backoff
- Event-based communication (emit/listen)
- Room and namespace support for multi-client applications
- Fallback transport mechanisms (long-polling, polling)

### 3.1.4 JWT Authentication Flow

JSON Web Tokens (JWT, RFC 7519) enable stateless authentication:

1. Client sends credentials (username/password) via POST.
2. Server verifies credentials against bcrypt-hashed password in MongoDB.
3. Server generates a signed JWT containing user ID and expiration.
4. Client stores JWT in localStorage and includes it in subsequent requests.
5. Server middleware verifies the JWT signature on protected routes.

## 3.2 System Architecture

TouchGuard32 follows a three-tier architecture:

```
┌──────────────────┐          HTTP POST          ┌──────────────────────┐
│     ESP32        │ ──────────────────────────>  │   Backend Server     │
│  (Touch/Button   │                              │   Node.js + Express  │
│   Firmware)      │                              │   + Socket.IO + JWT  │
└──────────────────┘                              └─────────┬────────────┘
                                                            │ WebSocket
                                                            ▼
                                                  ┌──────────────────────┐
                                                  │   React Frontend     │
                                                  │   Vite + TailwindCSS │
                                                  │   + Socket.IO Client │
                                                  └──────────────────────┘
```

### 3.2.1 Component Overview

**ESP32 Firmware Layer:**
- WiFi connectivity management with auto-reconnect
- Capacitive touch pin scanning (8 pins) with configurable thresholds
- BOOT button detection with debouncing
- HTTP POST to backend for alerts and heartbeats
- Serial debug output for monitoring

**Backend Layer (Node.js/Express):**
- REST API endpoints for authentication, alerts, and device communication
- Socket.IO server for real-time WebSocket broadcasting
- MongoDB database (production) or MongoMemoryServer (development)
- JWT authentication middleware for protected routes
- Helmet security headers and CORS configuration
- Input validation on all endpoints

**Frontend Layer (React/Vite):**
- JWT-based authentication context with persistent login
- Socket.IO client for real-time alert reception
- Dashboard with live alert cards, ESP32 status, board visualizer, activity feed
- Alert history page with server-side pagination
- Alert statistics with auto-refresh
- Protected routing with redirect on expired tokens

### 3.2.2 Data Flow

1. ESP32 detects touch/button event and sends HTTP POST to `/api/device/alert`.
2. Backend validates payload, saves to MongoDB, and broadcasts via Socket.IO.
3. All connected frontend clients receive the alert in real time.
4. ESP32 sends heartbeat every 30 seconds via HTTP POST to `/api/device/heartbeat`.
5. Backend broadcasts device status to frontend.
6. Frontend fetches `/api/alerts`, `/api/alerts/latest`, and `/api/alerts/stats` via authenticated GET requests.

## 3.3 Development Methodology

The project followed an Agile development methodology with iterative sprints:

### Sprint 1: ESP32 Firmware
- Implement multi-pin touch scanning
- Add BOOT button detection
- Implement HTTP alert and heartbeat transmission
- Add WiFi auto-reconnect and serial debugging

### Sprint 2: Backend API
- Set up Express server with Socket.IO
- Implement user authentication (JWT + bcrypt)
- Create alert CRUD operations with MongoDB
- Add device endpoints for ESP32 communication
- Implement security middleware (Helmet, CORS, validation)

### Sprint 3: Frontend Dashboard
- Set up React + Vite + TailwindCSS project
- Implement authentication context and login page
- Create dashboard with live alerts and real-time updates
- Add alert history with pagination
- Implement device status monitoring

### Sprint 4: Integration & Deployment
- End-to-end testing (ESP32 → Backend → Frontend)
- Security audit and hardening
- Deployment configuration for Render and Vercel
- Documentation and contribution matrix

## 3.4 Hardware and Software Requirements

### Hardware Requirements

| Component | Specification |
|-----------|---------------|
| Microcontroller | ESP32 Dev Module (ESP32-D0WD-V3) |
| Touch Electrodes | Conductive pads or wires on GPIO4, GPIO15, GPIO13, GPIO12, GPIO14, GPIO27, GPIO33, GPIO32 |
| WiFi Network | 2.4 GHz 802.11 b/g/n |
| Development PC | Any system with USB port and internet connectivity |

### Software Requirements

| Layer | Technology | Version |
|-------|------------|---------|
| Firmware IDE | Arduino CLI / Arduino IDE | 2.x+ |
| Backend Runtime | Node.js | 18.x+ |
| Backend Framework | Express.js | 4.21.x |
| Database | MongoDB (production) / mongodb-memory-server (dev) | 8.x |
| Frontend Framework | React | 18.x |
| Frontend Build | Vite | 5.x |
| Styling | TailwindCSS | 3.x |
| Real-time | Socket.IO | 4.7.x |
| Security | Helmet, JWT, bcrypt | Latest |

## 3.5 API Design

### Authentication Endpoints
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/auth/seed` | No | Create default admin user |

### Alert Endpoints
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/alerts?page=1&limit=20` | Yes | Paginated alert list |
| GET | `/api/alerts/latest` | Yes | Most recent alert |
| GET | `/api/alerts/stats` | Yes | Alert statistics |

### Device Endpoints
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/device/alert` | No | Receive alert from ESP32 |
| POST | `/api/device/heartbeat` | No | ESP32 keep-alive |

### Health
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Server health check |

## 3.6 Database Schema

### User Model
```
{
  username: String (required, unique),
  password: String (required, bcrypt hashed),
  createdAt: Date
}
```

### Alert Model
```
{
  device: String (required),
  status: String (required, enum),
  message: String,
  createdAt: Date (indexed)
}
```

Valid statuses: `Touch Detected`, `Button Pressed`, `Device Online`, `Device Offline`, `Motion Detected`

## 3.7 WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `alert` | Server → Client | New touch/button alert |
| `notification` | Server → Client | Toast notification |
| `device-status` | Server → Client | ESP32 online/offline status |
| `esp32-alert` | Client → Server | Simulate alert from dashboard |
| `esp32-connect` | Client → Server | ESP32 announces connection |
| `esp32-disconnect` | Client → Server | ESP32 disconnection notice |
