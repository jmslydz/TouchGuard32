/*
 * TouchGuard32 - ESP32 Touch/Button Alert Firmware
 * 
 * Detects capacitive touch on GPIO pins or BOOT button press,
 * sends alerts to the TouchGuard32 backend server.
 * 
 * Pins used:
 *   - Touch 0 (GPIO4):  Default touch sensor
 *   - GPIO0:            BOOT button (built-in)
 *   - LED_BUILTIN (GPIO2): Status indicator
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ===== CONFIGURATION =====
// Replace with your WiFi credentials
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Backend server URL (your Render/Railway/ngrok URL)
const char* SERVER_URL    = "https://your-backend.onrender.com";

// Device name sent with alerts
const char* DEVICE_NAME   = "ESP32";

// ===== PIN CONFIGURATION =====
#define TOUCH_PIN      T0      // GPIO4 - Capacitive touch pin
#define BUTTON_PIN     0       // GPIO0 - BOOT button (HIGH = not pressed, LOW = pressed)
#define LED_PIN        2       // Built-in LED

// ===== THRESHOLDS =====
#define TOUCH_THRESHOLD    40   // Lower = more sensitive (default ~40-50)
#define DEBOUNCE_DELAY     300  // ms between alerts
#define HEARTBEAT_INTERVAL 30000 // ms between heartbeat pings

// ===== STATE =====
unsigned long lastAlertTime = 0;
unsigned long lastHeartbeatTime = 0;
bool lastButtonState = HIGH;
bool wifiReconnectPrinted = false;

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println("========================================");
  Serial.println("  TouchGuard32 - ESP32 Alert System");
  Serial.println("========================================");

  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  connectToWiFi();
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
    delay(1000);
    return;
  }

  unsigned long now = millis();

  // --- Detect Capacitive Touch ---
  int touchValue = touchRead(TOUCH_PIN);
  if (touchValue < TOUCH_THRESHOLD && (now - lastAlertTime > DEBOUNCE_DELAY)) {
    Serial.printf("[TOUCH] Value: %d (threshold: %d)\n", touchValue, TOUCH_THRESHOLD);
    digitalWrite(LED_PIN, HIGH);
    sendAlert("Touch Detected", "Capacitive touch triggered");
    lastAlertTime = now;
    delay(100);
    digitalWrite(LED_PIN, LOW);
  }

  // --- Detect BOOT Button Press ---
  bool buttonState = digitalRead(BUTTON_PIN);
  if (buttonState == LOW && lastButtonState == HIGH && (now - lastAlertTime > DEBOUNCE_DELAY)) {
    Serial.println("[BUTTON] BOOT button pressed!");
    digitalWrite(LED_PIN, HIGH);
    sendAlert("Button Pressed", "BOOT button triggered");
    lastAlertTime = now;
    delay(100);
    digitalWrite(LED_PIN, LOW);
  }
  lastButtonState = buttonState;

  // --- Heartbeat ---
  if (now - lastHeartbeatTime > HEARTBEAT_INTERVAL) {
    sendHeartbeat();
    lastHeartbeatTime = now;
  }

  // --- Touch value debug (every 5 seconds) ---
  static unsigned long lastDebugPrint = 0;
  if (now - lastDebugPrint > 5000) {
    int val = touchRead(TOUCH_PIN);
    Serial.printf("[DEBUG] Touch value: %d | Button: %s\n",
      val,
      digitalRead(BUTTON_PIN) == LOW ? "PRESSED" : "released");
    lastDebugPrint = now;
  }

  delay(50);
}

void connectToWiFi() {
  Serial.printf("Connecting to WiFi: %s\n", WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 40) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.printf("WiFi connected! IP: %s\n", WiFi.localIP().toString().c_str());
    digitalWrite(LED_PIN, HIGH);
    delay(300);
    digitalWrite(LED_PIN, LOW);
    delay(300);
    digitalWrite(LED_PIN, HIGH);
    delay(300);
    digitalWrite(LED_PIN, LOW);

    // Send device online notification
    sendAlert("Device Online", "ESP32 has connected to the network");
  } else {
    Serial.println();
    Serial.println("WiFi connection failed! Retrying...");
  }
}

void sendAlert(const char* status, const char* message) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[ERROR] Cannot send alert: WiFi not connected");
    return;
  }

  HTTPClient http;
  http.begin(String(SERVER_URL) + "/api/device/alert");
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<256> doc;
  doc["device"] = DEVICE_NAME;
  doc["status"] = status;
  doc["message"] = message;

  String jsonString;
  serializeJson(doc, jsonString);

  Serial.printf("[SEND] POST /api/device/alert | %s: %s\n", status, message);

  int httpCode = http.POST(jsonString);

  if (httpCode > 0) {
    String response = http.getString();
    Serial.printf("[RESP] HTTP %d: %s\n", httpCode, response.c_str());
  } else {
    Serial.printf("[ERROR] HTTP request failed: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
}

void sendHeartbeat() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(String(SERVER_URL) + "/api/device/heartbeat");
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<64> doc;
  doc["device"] = DEVICE_NAME;

  String jsonString;
  serializeJson(doc, jsonString);

  int httpCode = http.POST(jsonString);

  if (httpCode > 0) {
    Serial.println("[HEARTBEAT] Sent successfully");
  }

  http.end();
}
