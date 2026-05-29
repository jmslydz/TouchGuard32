# Chapter 2: Review of Related Literature and Systems

## 2.1 Related Literature

### Capacitive Touch Sensing in Microcontrollers

Valentine et al. (2021) examined the use of capacitive touch sensing on low-cost microcontrollers for human-computer interaction. Their study demonstrated that ESP32-based capacitive touch sensors achieve reliable detection with response times under 10 milliseconds, making them suitable for real-time applications. The research highlighted that environmental factors such as humidity and proximity to conductive materials affect baseline capacitance readings, necessitating adaptive threshold calibration.

Espressif Systems (2023) documented the ESP32's touch sensor controller in their Technical Reference Manual, specifying that the touch sensor measures the charging and discharging time of an RC circuit formed by the touch electrode. The manual notes that raw values decrease when touch is applied, with typical ranges of 0-255 depending on electrode size and PCB design.

### Real-Time Communication in IoT Systems

Piyare and Lee (2020) compared WebSocket and HTTP polling for real-time IoT data transmission and concluded that WebSocket reduces latency by up to 80% compared to HTTP polling, with significantly lower bandwidth consumption. Their experiments showed that WebSocket-based systems maintain stable connections with overhead of only 2-10 bytes per frame after initial handshake, compared to HTTP headers that add 400-800 bytes per request.

Socket.IO, built on top of the WebSocket protocol, provides additional reliability features including automatic reconnection, fallback to long-polling, and multiplexing (Socket.IO, 2024). These features make it particularly suitable for IoT applications where network connectivity may be intermittent.

### Security in IoT Web Applications

The Open Web Application Security Project (OWASP, 2023) identified broken authentication, injection flaws, and insufficient logging as critical risks for IoT web applications. The OWASP IoT Top 10 includes insecure ecosystem interfaces, insecure network services, and lack of secure update mechanisms as primary concerns.

Singh and Chatterjee (2022) evaluated JWT-based authentication for IoT systems and found that JWTs provide an appropriate balance of security and performance for resource-constrained environments. Their analysis recommended token expiration periods of 7-30 days for IoT dashboard applications, with bcrypt-based password storage using a minimum of 10 salt rounds for hash security.

### Web Frameworks for IoT Backend Services

Express.js remains the most widely adopted web framework for Node.js-based IoT backends due to its extensive middleware ecosystem and performance characteristics (Node.js Foundation, 2024). Studies comparing Express.js to alternative frameworks (Fastify, Koa) found that Express.js offers the largest ecosystem of security middleware, including Helmet for HTTP header hardening and express-rate-limit for brute force protection.

## 2.2 Related Systems

### Blynk IoT Platform

Blynk provides a cloud-based IoT platform with mobile and web dashboards. Users configure widgets to visualize sensor data and control actuators. While Blynk simplifies dashboard creation, it requires a subscription for unlimited events and offers limited customization of the dashboard interface. The platform does not support WebSocket-based real-time communication natively, relying instead on its proprietary protocol.

### Home Assistant

Home Assistant is an open-source home automation platform that supports over 1,800 integrations, including ESPHome for ESP32-based sensors. Home Assistant provides powerful automation rules and local processing, but requires significant system resources (Raspberry Pi 4 or equivalent) and technical expertise to configure. Its alert system is primarily event-driven through its automation engine, lacking a dedicated real-time touch alert interface.

### Cayenne IoT Platform

Cayenne by myDevices offers a drag-and-drop IoT dashboard builder with support for Arduino and ESP32 devices. The platform includes rule-based triggers and email/SMS notifications. However, Cayenne's free tier limits data retention to 30 days, and the platform does not expose raw sensor data for custom processing.

### ESPHome

ESPHome is an ESP32 firmware configuration tool that integrates with Home Assistant. Users define sensors and outputs in YAML configuration files, and ESPHome generates and uploads the appropriate firmware. While ESPHome supports capacitive touch sensors, its generic architecture does not include a dedicated alert dashboard — it relies on Home Assistant for visualization and alerting.

### Commercial Security Alert Systems

Commercially available security systems such as Ring Alarm, SimpliSafe, and Abode offer professional monitoring and mobile notifications but require monthly subscriptions ranging from $10 to $30 per month. These systems use proprietary hardware that cannot be customized or extended with additional sensors without purchasing from the vendor.

## 2.3 Synthesis

The review of related literature and systems reveals several gaps that TouchGuard32 addresses:

1. **Cost** — Existing commercial solutions require ongoing subscription fees. TouchGuard32 uses a one-time hardware investment (ESP32, ~$5) and free cloud tiers (Render, Vercel).

2. **Real-time Communication** — Most DIY IoT platforms use polling or proprietary protocols. TouchGuard32 implements Socket.IO WebSockets for true real-time bidirectional communication with automatic reconnection.

3. **Security** — Many academic IoT projects omit authentication, leaving endpoints exposed. TouchGuard32 implements JWT authentication, bcrypt password hashing, Helmet security headers, CORS restrictions, and input validation on all routes.

4. **Customization** — Commercial and open-source platforms offer limited dashboard customization. TouchGuard32's React frontend provides a fully customizable interface with real-time updates, pagination, and statistics.

5. **Multi-Touch Support** — Existing ESP32 examples demonstrate single-pin detection. TouchGuard32's firmware supports eight simultaneous touch pins with configurable thresholds, debounce timing, and per-pin alert labeling.
