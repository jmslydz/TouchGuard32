// ===== YOUR CONFIGURATION =====
// 1. Rename this file to 'config.h'
// 2. Fill in your WiFi credentials and server URL
// 3. Upload to ESP32
//
// For local testing (backend on your PC):
//   SERVER_URL = "http://192.168.x.x:5000"   <- your PC's local IP
//
// For production (backend on Render/Railway):
//   SERVER_URL = "https://your-app.onrender.com"

#ifndef CONFIG_H
#define CONFIG_H

const char* WIFI_SSID     = "YourWiFiSSID";
const char* WIFI_PASSWORD = "YourWiFiPassword";
const char* SERVER_URL    = "http://192.168.1.100:5000";

#endif
