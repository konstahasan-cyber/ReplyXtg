#!/usr/bin/env bash
# Builds a server-less static HTML version into out/ (forms save locally; no API, no proxy).
set -euo pipefail
cd "$(dirname "$0")/.."
tmp=$(mktemp -d)
mv src/app/api "$tmp/api"; mv src/proxy.ts "$tmp/proxy.ts"
trap 'mv "$tmp/api" src/app/api; mv "$tmp/proxy.ts" src/proxy.ts' EXIT
rm -rf out
STATIC_EXPORT=true npx next build
echo "Static site written to out/ — serve it with: npx serve out"
