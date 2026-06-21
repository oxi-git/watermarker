#!/usr/bin/env bash
set -euo pipefail

echo "══ [1/3] Dipendenze npm..."
npm ci

echo "══ [2/3] Generazione icone placeholder..."
mkdir -p src-tauri/icons
python3 - <<'PYEOF'
import struct, zlib

def make_png(w, h, r, g, b):
    row  = b'\x00' + bytes([r, g, b]) * w
    raw  = row * h
    idat = zlib.compress(raw, 9)
    def chunk(tag, data):
        body = tag + data
        return struct.pack('>I', len(data)) + body + struct.pack('>I', zlib.crc32(body) & 0xffffffff)
    ihdr = struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')

with open('src-tauri/icons/icon.png', 'wb') as f:
    f.write(make_png(512, 512, 102, 126, 234))   # #667eea
PYEOF
npx tauri icon src-tauri/icons/icon.png

echo "══ [3/3] Build Tauri (esegue Vite + compila Rust)..."
# tauri build esegue automaticamente beforeBuildCommand (npm run build)
npx tauri build --bundles appimage,deb

echo ""
echo "✓ Build completata. Artifacts:"
find src-tauri/target/release/bundle -name "*.AppImage" -o -name "*.deb" 2>/dev/null | sort
