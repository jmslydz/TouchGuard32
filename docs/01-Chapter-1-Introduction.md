# Chapter 1: The Problem and Its Background

## Introduction

The rapid advancement of the Internet of Things (IoT) has transformed how physical environments are monitored and controlled. IoT systems integrate sensors, connectivity, and cloud-based analytics to provide real-time awareness of physical spaces. Among the various sensing modalities, capacitive touch sensing offers a unique combination of low cost, low power consumption, and reliable human-interaction detection, making it ideal for security and alert applications.

Traditional security systems often rely on expensive dedicated hardware, proprietary software, and professional installation services. These systems typically require monthly subscription fees and lack the flexibility for customization. The emergence of low-cost microcontrollers with built-in wireless connectivity, such as the ESP32, has democratized access to IoT security solutions. The ESP32, developed by Espressif Systems, integrates WiFi, Bluetooth, and capacitive touch sensing capabilities on a single chip at a cost of under five dollars, making it an attractive platform for building custom security systems.

TouchGuard32 is designed to address the need for an accessible, real-time touch detection and alert system that can be implemented with minimal hardware investment. By leveraging the ESP32's built-in capacitive touch pins (T0 through T9) and its BOOT button as input sources, the system can detect physical interactions and broadcast alerts to a web-based dashboard in real time via WebSocket communication.

## Background of the Study

Capacitive touch sensing works by measuring the capacitance of a conductive pad connected to a microcontroller pin. When a human finger approaches or contacts the pad, the capacitance increases, causing a measurable change in the sensor reading. The ESP32's touch sensor controller provides ten capacitive touch pins (GPIO4, GPIO0, GPIO2, GPIO15, GPIO13, GPIO12, GPIO14, GPIO27, GPIO33, and GPIO32) that return raw digital values typically ranging from 0 to 255. These values decrease when touch is detected, allowing a threshold-based detection mechanism.

While the concept of capacitive touch sensing is well-established, its application in a networked alert system presents several engineering challenges. These include reliable detection amidst environmental noise, debouncing to prevent false triggers, maintaining persistent WiFi connectivity, and ensuring that alert data is delivered in real time to end users through a secure, authenticated web interface.

Several existing solutions address subsets of these requirements. Commercial IoT platforms such as Blynk and Cayenne provide dashboards for visualizing sensor data but require cloud subscriptions and offer limited customization. Home automation systems like Home Assistant support custom sensor integration but require significant configuration. Open-source frameworks like ESPHome facilitate ESP32 firmware development but abstract away the underlying touch sensing logic.

TouchGuard32 differentiates itself by providing a complete, end-to-end solution that includes custom ESP32 firmware, a Node.js backend with WebSocket support, and a React-based frontend dashboard. The system is designed to be self-hosted, giving users full control over their data.

## Statement of the Problem

The development of TouchGuard32 addresses the following specific problems:

1. **Lack of accessible touch-based alert systems** — Existing IoT security solutions are either too expensive, require proprietary hardware, or are overly complex for average users to configure and maintain.

2. **Absence of real-time WebSocket integration in DIY solutions** — Many DIY IoT alert systems rely on polling-based HTTP requests, which introduce latency and are inefficient for real-time monitoring.

3. **Inadequate security in student-built IoT projects** — Many academic IoT projects neglect authentication, input validation, and secure communication, leaving them vulnerable to unauthorized access and data tampering.

4. **Limited multi-touch support in existing ESP32 firmware examples** — Most ESP32 touch examples demonstrate single-pin detection and do not handle multiple simultaneous touch inputs with proper debouncing and reporting.

## Objectives

### General Objective

To design, develop, and evaluate TouchGuard32, a real-time ESP32-based touch alert system that provides low-latency notifications through a secure web dashboard.

### Specific Objectives

1. **Develop ESP32 firmware** capable of scanning eight capacitive touch pins and the BOOT button simultaneously, with configurable thresholds and debounce timing.

2. **Build a Node.js backend server** that receives touch alerts via HTTP POST, broadcasts them in real time via Socket.IO WebSockets, persists alert data to MongoDB, and provides a REST API for the frontend.

3. **Create a React-based web dashboard** that displays live alerts, historical data, device status, and alert statistics in a responsive dark-themed interface with JWT-authenticated access.

4. **Implement security measures** including password hashing (bcrypt, 12 rounds), JWT token authentication, Helmet security headers, CORS restriction, request body size limiting, and input validation on all endpoints.

5. **Deploy the system** to cloud platforms (Render for backend, Vercel for frontend) with HTTPS encryption to ensure secure remote access.

## Significance of the Study

The study is significant in the following areas:

- **Students and Educators** — Provides a practical, real-world example of full-stack IoT development integrating embedded systems, backend engineering, frontend development, and cybersecurity principles.

- **Home Users** — Offers a low-cost, customizable security alert system that can be deployed in home environments for monitoring doors, windows, or valuable objects.

- **Researchers** — Serves as a foundation for exploring capacitive touch sensing applications in human-computer interaction, smart environments, and assistive technology.

- **Developers** — Demonstrates best practices in IoT system architecture, including WebSocket-based real-time communication, JWT authentication, and modular code organization.

## Scope and Limitations

### Scope

- The system detects touch events on up to eight capacitive touch pins (T0, T3-T9) of the ESP32, plus the built-in BOOT button.
- Alerts are transmitted over WiFi to a backend server and displayed on a web dashboard in real time.
- The dashboard supports user authentication via JWT, live alert streaming, historical alert browsing with pagination, and alert statistics.
- The system includes a heartbeat mechanism to monitor ESP32 connectivity status.

### Limitations

- The system operates within WiFi range (approximately 30-50 meters indoors).
- The ESP32's T1 (GPIO0) and T2 (GPIO2) pins are excluded from touch scanning due to conflicts with the BOOT button and built-in LED.
- The in-memory MongoDB option does not persist data across server restarts; production deployments require MongoDB Atlas.
- The system does not include SMS, email, or push notification integration beyond the web dashboard.
- Touch sensitivity is affected by environmental factors such as humidity, temperature, and the type of material covering the touch pad.

## Definition of Terms

- **Capacitive Touch Sensing** — A technology that detects human touch by measuring changes in capacitance on a conductive surface.

- **Debouncing** — A technique to prevent multiple signal detections from a single physical event by enforcing a minimum time interval between triggers.

- **WebSocket** — A communication protocol that provides full-duplex communication channels over a single TCP connection, enabling real-time data transfer.

- **JWT (JSON Web Token)** — A compact, URL-safe token format used for securely transmitting claims between parties, commonly used for authentication.

- **ESP32** — A low-cost, low-power system-on-chip microcontroller with integrated WiFi and Bluetooth, developed by Espressif Systems.

- **IoT (Internet of Things)** — A network of physical devices embedded with sensors, software, and connectivity to exchange data over the internet.

- **Helmet** — A middleware for Express.js applications that sets various HTTP headers to secure against well-known web vulnerabilities.

- **Socket.IO** — A JavaScript library enabling real-time, bidirectional, event-based communication between web clients and servers.

- **MongoDB** — A NoSQL document-oriented database program that stores data in flexible, JSON-like documents.

- **Vite** — A modern frontend build tool that provides fast development server startup and optimized production builds.
