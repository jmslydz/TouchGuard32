# 🛡️ TouchGuard32 — Real-Time ESP32 Touch Alert System

A full-stack IoT web application that detects touch/button presses on an **ESP32** and displays real-time alerts on a **dark-themed dashboard** using **WebSocket communication**.

## Architecture

```
┌─────────────┐     HTTP/WS      ┌──────────────┐     REST API     ┌───────────┐
│   ESP32     │ ──────────────>  │   Backend     │ <──────────────> │ MongoDB   │
│ (Touch/     │                  │  Node.js +    │                  │  Atlas    │
│  Button)    │                  │  Express +    │                  │           │
└─────────────┘                  │  Socket.IO    │                  └───────────┘
                                 └──────┬───────┘
                                        │ WebSocket
                                        ▼
                                 ┌──────────────┐
                                 │   Frontend    │
                                 │  React +      │
                                 │  TailwindCSS  │
                                 └──────────────┘
```

## Tech Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Frontend    | React, Vite, TailwindCSS, Socket.IO Client    |
| Backend     | Node.js, Express, Socket.IO, JWT, bcrypt      |
| Database    | MongoDB Atlas                                 |
| Firmware    | Arduino IDE (ESP32)                           |
| Deployment  | Vercel (frontend), Render (backend)           |

## Features

- **JWT Authentication** — Secure login with bcrypt password hashing
- **Real-Time Dashboard** — Live alerts via Socket.IO WebSockets
- **ESP32 Integration** — Capacitive touch + BOOT button detection
- **Alert History** — Paginated log of all events
- **Connection Status** — Live server & ESP32 status indicators
- **Toast Notifications** — Browser alerts on new events
- **Notification Sound** — Audio cue on alert
- **Session Uptime** — Dashboard session timer
- **Mobile Responsive** — Works on all screen sizes
- **Dark UI** — Professional admin dashboard design

## Project Structure

```
touchguard32/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── middleware/
│   │   └── auth.js               # JWT verification middleware
│   ├── models/
│   │   ├── User.js               # User schema (username, password)
│   │   └── Alert.js              # Alert schema (device, status, timestamp)
│   ├── routes/
│   │   ├── auth.js               # POST /api/auth/login
│   │   ├── alerts.js             # GET /api/alerts, /api/alerts/stats
│   │   └── device.js             # POST /api/device/alert, /api/device/heartbeat
│   ├── .env.example
│   ├── package.json
│   ├── server.js                 # Entry point
│   └── vercel.json               # (optional) Vercel deployment config
├── frontend/
│   ├── public/
│   │   └── notification.mp3
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── LiveAlertCard.jsx
│   │   │   ├── EspStatusIndicator.jsx
│   │   │   ├── ActivityFeed.jsx
│   │   │   ├── AlertStatsCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AlertHistory.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── esp32/
│   └── touchguard32.ino          # ESP32 firmware
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier)
- ESP32 board (any with capacitive touch)
- Arduino IDE with ESP32 board support

---

## 1. Backend Setup

```bash
cd touchguard32/backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/touchguard32?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

**MongoDB Atlas Setup:**
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Click "Connect" → "Drivers" → Copy connection string
3. Replace `<user>`, `<password>`, and `cluster0.xxxxx` with your details

**Seed default user:**
```bash
curl -X POST http://localhost:5000/api/auth/seed
```
Creates: `admin` / `admin123`

**Start server:**
```bash
npm run dev
```

---

## 2. Frontend Setup

```bash
cd touchguard32/frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

**Start dev server:**
```bash
npm run dev
```

Open http://localhost:5173 and login with `admin` / `admin123`.

---

## 3. ESP32 Setup

1. Open `touchguard32/esp32/touchguard32.ino` in Arduino IDE
2. Install ESP32 board support (Board Manager: `esp32` by Espressif)
3. Install libraries (Library Manager):
   - `ArduinoJson` by Benoit Blanchon
4. Edit these values in the code:

```cpp
const char* WIFI_SSID     = "YourWiFiName";
const char* WIFI_PASSWORD = "YourWiFiPassword";
const char* SERVER_URL    = "https://your-backend.onrender.com";
```

5. If running locally, use **ngrok** to expose your backend:
   ```bash
   ngrok http 5000
   ```
   Then set `SERVER_URL` to the ngrok HTTPS URL.

6. Select board: **ESP32 Dev Module**
7. Upload to your ESP32
8. Open Serial Monitor (115200 baud) to see debug logs

### ESP32 Connection Diagram

| ESP32 Pin | Function            |
|-----------|---------------------|
| GPIO4     | Touch sensor (T0)   |
| GPIO0     | BOOT button (built-in) |
| GPIO2     | Built-in LED        |

**Touch calibration:** The default threshold is `40`. Use the Serial Monitor to see raw touch values and adjust in the code if needed. Lower values = more sensitive.

---

## 4. Deployment

### Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   - `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`
5. Deploy
6. Seed the user: `curl -X POST https://your-app.onrender.com/api/auth/seed`

### Frontend → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo, set:
   - **Root Directory:** `frontend`
   - **Framework:** Vite
4. Add Environment Variables:
   - `VITE_API_URL=https://your-app.onrender.com`
   - `VITE_SOCKET_URL=https://your-app.onrender.com`
5. Deploy

---

## API Reference

### Authentication

| Method | Endpoint           | Description          | Auth |
|--------|--------------------|----------------------|------|
| POST   | `/api/auth/login`  | Login, returns JWT   | No   |
| GET    | `/api/auth/me`     | Get current user     | Yes  |
| POST   | `/api/auth/seed`   | Create default user  | No   |

### Alerts

| Method | Endpoint               | Description             | Auth |
|--------|------------------------|-------------------------|------|
| GET    | `/api/alerts`          | Paginated alert list    | Yes  |
| GET    | `/api/alerts/latest`   | Most recent alert       | Yes  |
| GET    | `/api/alerts/stats`    | Alert statistics        | Yes  |

### Device (ESP32)

| Method | Endpoint                | Description             | Auth |
|--------|-------------------------|-------------------------|------|
| POST   | `/api/device/alert`     | Send alert from ESP32   | No   |
| POST   | `/api/device/heartbeat` | ESP32 keep-alive        | No   |

### Health

| Method | Endpoint      | Description              |
|--------|---------------|--------------------------|
| GET    | `/api/health` | Server health check      |

### Alert Payload

```json
{
  "device": "ESP32",
  "status": "Touch Detected",
  "message": "Capacitive touch triggered"
}
```

Valid statuses: `Touch Detected`, `Button Pressed`, `Device Online`, `Device Offline`, `Motion Detected`

---

## WebSocket Events

| Event             | Direction     | Payload                          |
|-------------------|---------------|----------------------------------|
| `alert`           | Server → Client | `{ device, status, message, createdAt }` |
| `notification`    | Server → Client | `{ message, timestamp }`          |
| `device-status`   | Server → Client | `{ device, status, lastSeen }`    |
| `esp32-alert`     | Client → Server | `{ device, status, message }`     |
| `esp32-connect`   | Client → Server | `{ device }`                      |
| `esp32-disconnect`| Client → Server | —                                |

---

## Git Workflow Example

```bash
git checkout -b feature/auth-system
git add .
git commit -m "Add JWT authentication middleware"
git commit -m "Implement bcrypt password hashing for User model"
git commit -m "Create login route with token generation"

git checkout -b feature/websocket-alerts
git commit -m "Implement Socket.IO alert broadcasting"
git commit -m "Add real-time dashboard with live activity feed"

git checkout -b fix/socket-reconnect
git commit -m "Fix ESP32 reconnection logic with exponential backoff"
git commit -m "Add heartbeat mechanism for connection stability"

git checkout -b chore/ui-cleanup
git commit -m "Refactor TailwindCSS classes for consistency"
git commit -m "Add responsive layout for mobile devices"
```

---

## For Your Friends — Quick Start

Each person needs their own **WiFi credentials** and **server URL**. Here's how:

### 1. Clone & install
```bash
git clone <your-repo-url>
cd touchguard32

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

### 2. Set up the ESP32 config
```bash
# Copy the example config (DO NOT edit the example file)
cp esp32/touchguard32/config.example.h esp32/touchguard32/config.h
```
Then open `esp32/touchguard32/config.h` and replace with their own:
```cpp
const char* WIFI_SSID     = "TheirWiFi";
const char* WIFI_PASSWORD = "TheirPassword";
const char* SERVER_URL    = "http://192.168.x.x:5000";  // their PC's IP
```

### 3. Backend `.env`
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env` with their own `JWT_SECRET` and `MONGODB_URI` (or leave blank for in-memory DB).

### 4. Frontend `.env`
```bash
cp frontend/.env.example frontend/.env
```

### 5. Run
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev

# Upload ESP32 firmware (compile via Arduino IDE or arduino-cli)
```

Login: `admin` / `admin123`

### What files each person MUST change
| File | What to set |
|------|-------------|
| `esp32/touchguard32/config.h` | Their WiFi SSID, password, PC's local IP |
| `backend/.env` | Their `JWT_SECRET` + `MONGODB_URI` (optional) |

### What's gitignored (stays private)
- `esp32/touchguard32/config.h`
- `backend/.env`
- `frontend/.env`
- `node_modules/`

---

## Security Features

- **JWT authentication** with Bearer token scheme
- **bcrypt** password hashing (12 salt rounds)
- **Input validation** on all endpoints
- **Rate limiting** ready structure
- **Environment variables** — no hardcoded secrets
- **CORS** configured for frontend origin only
- **Request body size limit** (10kb)
- **HTTPS-ready** backend structure

## Troubleshooting

| Problem | Solution |
|---------|----------|
| ESP32 not connecting to WiFi | Check SSID/password, ensure 2.4GHz network |
| Touch not triggering | Open Serial Monitor, note raw values, adjust `TOUCH_THRESHOLD` |
| Backend connection refused | Check CORS `FRONTEND_URL` matches your frontend origin |
| MongoDB connection error | Whitelist your IP in MongoDB Atlas Network Access |
| WebSocket not connecting | Ensure `VITE_SOCKET_URL` points to the correct backend URL |
| Alerts not appearing | Check Socket.IO browser console for connection status |

## License

MIT — Built for educational purposes.
