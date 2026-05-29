# Contribution Matrix — TouchGuard32 Team

| # | Member | GitHub Username | Role | Contributions |
|---|--------|-----------------|------|---------------|
| 1 | Lloyd | **jmslydz** | Project Lead & Full-Stack Developer | System architecture design, ESP32 firmware development (multi-touch scanning, HTTP alerts, heartbeats, WiFi reconnection), backend server implementation (Express, Socket.IO, JWT auth, MongoDB integration), frontend dashboard (React components, TailwindCSS theming, real-time context providers), deployment configuration (Render, Vercel), documentation (Chapters 1-5), Git workflow setup, repository management |
| 2 | Aiken | **aikendormidoa** | Frontend Developer | Alert history page design and implementation, API integration for paginated alert fetching, UI testing and bug reporting, responsive layout testing on mobile devices |
| 3 | Adrian | **Twobein07** | Backend Developer | MongoDB schema design (User and Alert models), REST API route implementation (auth, alerts, device endpoints), API testing and validation, rate limiting research and documentation |
| 4 | Jericho | **Salupantantan2003** | Firmware & Hardware Engineer | ESP32 hardware setup and pin configuration, touch sensitivity calibration testing, electrode design and assembly, hardware documentation and wiring diagrams, serial debugging and threshold tuning |
| 5 | Jin | **ITSMEJIN7** | QA & Deployment | System integration testing, cross-browser compatibility testing, WebSocket reliability testing, deployment verification on Render and Vercel, README documentation and friend setup instructions |

## Work Distribution Summary

| Area | Lead | Support |
|------|------|---------|
| ESP32 Firmware | jmslydz | Salupantantan2003 |
| Backend API | jmslydz | Twobein07 |
| Frontend UI | jmslydz | aikendormidoa |
| Database | Twobein07 | jmslydz |
| Hardware | Salupantantan2003 | jmslydz |
| Testing | ITSMEJIN7 | All members |
| Documentation | jmslydz | All members |
| Deployment | ITSMEJIN7 | jmslydz |
| Git Management | jmslydz | All members |

## Branch Ownership

| Branch | Purpose | Primary Author |
|--------|---------|----------------|
| `master` | Production-ready code | jmslydz |
| `feature/auth-system` | JWT auth + login | jmslydz |
| `feature/websocket-alerts` | Real-time WebSocket alerts | jmslydz |
| `fix/socket-reconnect` | WebSocket reconnection fix | jmslydz |
| `chore/ui-cleanup` | UI polish and refactoring | jmslydz |
| `feature/alert-history` | Paginated history page | aikendormidoa |
| `feature/mongodb-models` | Database schema design | Twobein07 |
| `feature/hardware-calibration` | Touch threshold tuning | Salupantantan2003 |
| `chore/testing` | QA and deployment | ITSMEJIN7 |

## PIT Rubric Coverage

| Criterion | Points | Covered By |
|-----------|--------|------------|
| Git & Version Control | 25 | jmslydz (all members contribute via branches) |
| Deployment | 20 | ITSMEJIN7, jmslydz |
| WebSocket | 20 | jmslydz, Twobein07 |
| Security | 20 | jmslydz, Twobein07 |
| IoT Integration | 15 | Salupantantan2003, jmslydz |
| **Total** | **100** | |
