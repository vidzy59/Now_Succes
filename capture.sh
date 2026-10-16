#!/usr/bin/env bash
# Pokit capture: screenshot CAPTURE_URL at desktop + mobile sizes into CAPTURE_DIR.
# Exit 75 = temporary navigation/browser infrastructure failure.
# Exit 1  = script misuse or rendering defect. Leaves the app server running.
set -euo pipefail
cd "$(dirname "$0")" # builtin: /usr/bin/time cannot time shell builtins
if [[ -z "${CAPTURE_URL:-}" ]]; then echo 'CAPTURE_URL is required.' >&2; exit 1; fi
if [[ -z "${CAPTURE_DIR:-}" ]]; then echo 'CAPTURE_DIR is required.' >&2; exit 1; fi
/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
/usr/bin/time -p node "${RUNTIME_DIR:?}/scripts/default-capture.mjs"
/usr/bin/time -p test -s "$CAPTURE_DIR/final-desktop.png"
/usr/bin/time -p test -s "$CAPTURE_DIR/final-mobile.png"
/usr/bin/time -p ls -l "$CAPTURE_DIR/final-desktop.png" "$CAPTURE_DIR/final-mobile.png"
echo 'capture ok'
