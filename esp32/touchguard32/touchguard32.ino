/*
 * TouchGuard32 - ESP32 Multi-Touch Alert Firmware
 *
 * Detects capacitive touch on ALL 10 touch pins (T0-T9) and the BOOT button.
 * Each pin reports its specific label in the alert message.
 *
 * Touch pins available on ESP32:
 *   T0 = GPIO4   T1 = GPIO0   T2 = GPIO2   T3 = GPIO15
 *   T4 = GPIO13  T5 = GPIO12  T6 = GPIO14  T7 = GPIO27
 *   T8 = GPIO33  T9 = GPIO32
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Load your personal config (WiFi, server URL)
// Edit 'config.h' — it's gitignored so your credentials stay private
#include "config.h"

#ifndef DEVICE_NAME
#define DEVICE_NAME "ESP32"
#endif

// ===== PIN DEFINITIONS =====
#define BUTTON_PIN     0       // GPIO0 - BOOT button (LOW = pressed)
#define LED_PIN        2       // Built-in LED

struct TouchPin {
  int     pin;        // touchRead pin number (T0..T9)
  int     gpio;       // actual GPIO number
  const char* label;  // human-readable label
  int     threshold;  // touch threshold (lower = more sensitive)
  unsigned long lastTrigger;  // debounce timer
};

// Touch-capable pins (T1=GPIO0 and T2=GPIO2 excluded:
//   T1=GPIO0 is the BOOT button, T2=GPIO2 is the built-in LED)
TouchPin touchPins[] = {
  { T0,   4,  "GPIO4 (T0)",  40, 0 },
  { T3,  15,  "GPIO15 (T3)", 40, 0 },
  { T4,  13,  "GPIO13 (T4)", 40, 0 },
  { T5,  12,  "GPIO12 (T5)", 40, 0 },
  { T6,  14,  "GPIO14 (T6)", 40, 0 },
  { T7,  27,  "GPIO27 (T7)", 40, 0 },
  { T8,  33,  "GPIO33 (T8)", 40, 0 },
  { T9,  32,  "GPIO32 (T9)", 40, 0 },
};

const int NUM_TOUCH_PINS = sizeof(touchPins) / sizeof(touchPins[0]);

#define DEBOUNCE_DELAY     300  // ms between alerts per pin
#define HEARTBEAT_INTERVAL 30000

// ===== STATE =====
unsigned long lastHeartbeatTime = 0;
bool lastButtonState = HIGH;

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println("========================================");
  Serial.println("  TouchGuard32 - Multi-Touch Alert");
  Serial.println("  Touch any GPIO pin labeled T0-T9");
  Serial.println("  or press the BOOT button");
  Serial.println("========================================");

  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  connectToWiFi();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
    delay(1000);
    return;
  }

  unsigned long now = millis();

  // --- Scan all touch pins ---
  for (int i = 0; i < NUM_TOUCH_PINS; i++) {
    int value = touchRead(touchPins[i].pin);
    if (value < touchPins[i].threshold &&
        (now - touchPins[i].lastTrigger > DEBOUNCE_DELAY)) {
      Serial.printf("[TOUCH] %s - value: %d (threshold: %d)\n",
        touchPins[i].label, value, touchPins[i].threshold);
      digitalWrite(LED_PIN, HIGH);
      sendAlert("Touch Detected", touchPins[i].label);
      touchPins[i].lastTrigger = now;
      delay(100);
      digitalWrite(LED_PIN, LOW);
    }
  }

  // --- Detect BOOT Button ---
  bool buttonState = digitalRead(BUTTON_PIN);
  if (buttonState == LOW && lastButtonState == HIGH) {
    bool canSend = true;
    for (int i = 0; i < NUM_TOUCH_PINS; i++) {
      if (now - touchPins[i].lastTrigger < DEBOUNCE_DELAY) {
        canSend = false;
        break;
      }
    }
    if (canSend) {
      Serial.println("[BUTTON] BOOT button pressed!");
      digitalWrite(LED_PIN, HIGH);
      sendAlert("Button Pressed", "BOOT button (GPIO0)");
      delay(100);
      digitalWrite(LED_PIN, LOW);
    }
  }
  lastButtonState = buttonState;

  // --- Heartbeat ---
  if (now - lastHeartbeatTime > HEARTBEAT_INTERVAL) {
    sendHeartbeat();
    lastHeartbeatTime = now;
  }

  // --- Debug print every 5s ---
  static unsigned long lastDebugPrint = 0;
  if (now - lastDebugPrint > 5000) {
    Serial.print("[DEBUG]");
    for (int i = 0; i < NUM_TOUCH_PINS; i++) {
      Serial.printf(" %s:%d", touchPins[i].label, touchRead(touchPins[i].pin));
      if (i < NUM_TOUCH_PINS - 1) Serial.print(",");
    }
    Serial.printf(" | Button:%s\n",
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

  Serial.printf("[SEND] %s | %s\n", status, message);

  int httpCode = http.POST(jsonString);

  if (httpCode > 0) {
    String response = http.getString();
    Serial.printf("[RESP] HTTP %d: %s\n", httpCode, response.c_str());
  } else {
    Serial.printf("[ERROR] HTTP failed: %s\n", http.errorToString(httpCode).c_str());
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
    Serial.println("[HEARTBEAT] Sent");
  }

  http.end();
}
