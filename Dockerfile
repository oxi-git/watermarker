# Ambiente di build Tauri per Linux (AppImage + .deb)
# Il codice sorgente viene montato via volume, non copiato nell'immagine.
FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

# Dipendenze sistema per Tauri v2 su Linux
RUN apt-get update && apt-get install -y --no-install-recommends \
    # WebKit (motore webview di Tauri)
    libwebkit2gtk-4.1-dev \
    # GTK + indicatori
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    # SVG e patchelf per AppImage
    librsvg2-dev \
    patchelf \
    # Toolchain C
    build-essential \
    pkg-config \
    libssl-dev \
    # Utility
    curl \
    file \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Node.js 22 LTS
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Rust stable
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \
    | sh -s -- -y --default-toolchain stable --profile minimal
ENV PATH="/root/.cargo/bin:${PATH}"

WORKDIR /app
