#!/usr/bin/env bash
# Regenerate all concept renders into public/images.
# Usage: BLENDER_PY=/path/to/python-with-bpy ./run_all.sh            (final quality)
#        RENDER_SCALE=0.5 RENDER_SAMPLES=28 ./run_all.sh               (fast draft)
set -euo pipefail
cd "$(dirname "$0")"
PY="${BLENDER_PY:-python3}"
ORDER="hero riverstone-1 sierra-1 oakmeadow-1 style-california-modern style-modern-farmhouse style-contemporary-luxury style-mediterranean style-not-sure final-cta intro-living intro-detail about riverstone-2 riverstone-3 riverstone-4 sierra-2 sierra-3 sierra-4 oakmeadow-2 oakmeadow-3 oakmeadow-4 service-custom service-designbuild service-planning service-luxury"
for s in $ORDER; do "$PY" scenes.py "$s"; done
