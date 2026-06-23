<div align="center">
  <img src="watermarker-logo.svg" alt="Watermarker" width="128" height="128">

  # Watermarker

  **Add watermarks to your images in seconds.**  
  Lightweight and professional desktop app to protect images with custom watermarks. Elegant interface with dark/light theme and macOS Tahoe glassmorphism design.

  [![Release](https://img.shields.io/badge/release-v1.1.0-blue?style=flat-square)](https://github.com/oxi-git/watermarker/releases)
  [![License](https://img.shields.io/badge/license-GPL%203.0-green?style=flat-square)](LICENSE)
  [![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey?style=flat-square)](#installation)
  [![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri-FFC131?style=flat-square&logo=tauri&logoColor=black)](https://tauri.app)

  [**Download**](#installation) · [Report a bug](https://github.com/oxi-git/watermarker/issues) · [Request a feature](https://github.com/oxi-git/watermarker/issues)

</div>

---

## Features

- 🖼️ **Image watermarks** — support for PNG, JPEG, WebP
- 🔤 **Custom text watermarks** — up to 3 lines, fonts, size, color, opacity
- 🖼️ **Image watermarks (PNG)** — tessellated with dynamic spacing
- 🎨 **Rotation and spacing** — precise positioning with responsive percentages
- 📁 **Batch processing** — apply the same watermark to dozens of files simultaneously
- 👁️ **Real-time preview** — see results as you modify parameters
- 🎯 **Thumbnail grid** — view all images with watermark preview
- 💾 **Flexible export** — download individual files or compressed ZIP
- 🎭 **Dark/light theme** — elegant interface with macOS Tahoe glassmorphism
- 🌍 **Multilingue** — Italian and English support
- 🔒 **100% offline** — no data leaves your device

---

## Installation

### Direct download (recommended)

Download the latest version from the [Releases page](https://github.com/oxi-git/watermarker/releases):

| Platform | File |
|---|---|
| macOS (Intel + Apple Silicon) | `Watermarker_x.x.x_universal.dmg` |
| Windows | `Watermarker_x.x.x_x64-setup.exe` |
| Linux (Debian/Ubuntu) | `watermarker_x.x.x_amd64.deb` |
| Linux (AppImage) | `Watermarker_x.x.x_amd64.AppImage` |

### macOS — First launch

If macOS blocks the app (unverified developer):

```bash
xattr -cr /Applications/Watermarker.app
```

---

## Building from source

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 18
- [Rust](https://rustup.rs) (stable toolchain)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites)

### Setup

```bash
# Clone the repository
git clone https://github.com/oxi-git/watermarker.git
cd watermarker

# Install dependencies
npm install

# Start development mode
npm run dev

# Build for production
npm run build
```

---

## Usage

1. **Open** one or more images via drag & drop or the file selector
2. **Configure** the watermark: text and/or PNG, font, opacity, position
3. **Preview** the result in the right panel
4. **Export** the files individually or as a ZIP archive

---

## Tech stack

| Layer | Technology |
|---|---|
| Desktop shell | [Tauri 2](https://tauri.app) + Rust |
| Frontend | HTML5, CSS3 (Glassmorphism Tahoe), vanilla JavaScript |
| Canvas rendering | Web Canvas API (client-side image processing) |
| Build | Vite + npm |
| Packaging | macOS (DMG universal), Windows (NSIS + MSI), Linux (AppImage + deb) |

---

## Contributing

Contributions are welcome! For minor bug fixes, open a Pull Request directly. For new features, open an Issue first to discuss it.

```bash
# Create a branch for your feature
git checkout -b feat/feature-name

# Commit your changes
git commit -m "feat: description"

# Open a Pull Request to main
```

Please follow the [Conventional Commits](https://www.conventionalcommits.org) style.

---

## License

Distributed under the **GPL 3.0** license. See [`LICENSE`](LICENSE) for details.

---

<div align="center">
  <sub>Made with ♥ · <a href="../../issues">Feedback</a></sub>
</div>
