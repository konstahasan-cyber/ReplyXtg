#!/usr/bin/env bash
# Restart the production server on port ${PORT:-3100} in the background (used by local QA).
PORT=${PORT:-3100}
for p in $(pgrep -f "next-serve[r]"); do kill "$p"; done
sleep 1
nohup npx next start -p "$PORT" > "${LOG:-/tmp/next-qa.log}" 2>&1 &
for _ in $(seq 1 30); do curl -sf "http://localhost:$PORT/" > /dev/null && exit 0; sleep 0.5; done
echo "server did not start" >&2; exit 1
