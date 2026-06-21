#!/usr/bin/env bash
set -euo pipefail

echo "══ [1/3] Dipendenze npm..."
npm ci

echo "══ [2/3] Generazione icone da SVG..."
mkdir -p src-tauri/icons
cp watermarker-logo.svg src-tauri/icons/icon.svg
npx tauri icon src-tauri/icons/icon.svg

echo "══ [3/3] Build Tauri (esegue Vite + compila Rust)..."
# tauri build esegue automaticamente beforeBuildCommand (npm run build)
npx tauri build --bundles appimage,deb

echo ""
echo "✓ Build completata. Artifacts:"
find src-tauri/target/release/bundle -name "*.AppImage" -o -name "*.deb" 2>/dev/null | sort
