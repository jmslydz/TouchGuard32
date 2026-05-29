# ESP32 Touch Calibration Guide

## Understanding Touch Values

The ESP32 touch sensor returns raw values typically in the range of 0-255.
**Lower values = stronger touch detection.**

When untouched, most pins read between 60-120.
When touched, values drop below the threshold (default: 40).

## Pin Mapping

| Touch Pin | GPIO | Function | Notes |
|-----------|------|----------|-------|
| T0        | 4    | Touch    | Use in firmware |
| T1        | 0    | BOOT     | Used as button, not touch |
| T2        | 2    | LED      | Built-in LED |
| T3        | 15   | Touch    | Use in firmware |
| T4        | 13   | Touch    | Use in firmware |
| T5        | 12   | Touch    | Use in firmware |
| T6        | 14   | Touch    | Use in firmware |
| T7        | 27   | Touch    | Use in firmware |
| T8        | 33   | Touch    | Use in firmware |
| T9        | 32   | Touch    | Use in firmware |

## Steps to Calibrate

1. Open Arduino IDE Serial Monitor at 115200 baud
2. Observe debug output (printed every 5 seconds):
   ```
   [DEBUG] GPIO4 (T0):85, GPIO15 (T3):92, ...
   ```
3. Note the **untouched baseline** for each pin
4. Set threshold to `baseline - 30` (adjust as needed)
5. Touch each pad and confirm value drops below threshold
6. Update threshold in `touchguard32.ino` if needed

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| False triggers | Raise threshold, increase DEBOUNCE_DELAY |
| No detection | Lower threshold, check electrode connection |
| High baseline noise | Add 10kΩ pull-down resistor to ground |
| T0 erratic | T0 is sensitive; shield with grounded copper |
