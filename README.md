<div align="center">
  <img src="watermarker-logo.svg" alt="Watermarker" width="128" height="128">

  # Watermarker

  **Aggiungi filigrane ai tuoi documenti in pochi secondi.**  
  App desktop leggera e professionale per proteggere immagini con watermark personalizzati. Interfaccia elegante con tema dark/light e glassmorphism macOS Tahoe.

  [![Release](https://img.shields.io/github/v/release/oxi-git/watermarker?style=flat-square)](https://github.com/oxi-git/watermarker/releases)
  [![License](https://img.shields.io/github/license/oxi-git/watermarker?style=flat-square)](LICENSE)
  [![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey?style=flat-square)](#installazione)
  [![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri-FFC131?style=flat-square&logo=tauri&logoColor=black)](https://tauri.app)

  [**Download**](#installazione) · [Segnala un bug](https://github.com/oxi-git/watermarker/issues) · [Richiedi una feature](https://github.com/oxi-git/watermarker/issues)

</div>

---

## Funzionalità

- 🖼️ **Watermark su immagini** — supporto PNG, JPEG, WebP
- 🔤 **Testo personalizzato** — fino a 3 linee, font, dimensione, colore, opacità
- 🎨 **Rotazione e spaziatura** — posizionamento preciso con percentuali responsive
- 📁 **Elaborazione batch** — applica lo stesso watermark a decine di file simultaneamente
- 👁️ **Anteprima in tempo reale** — vedi il risultato mentre modifichi i parametri
- 🎯 **Griglia thumbnail** — visualizza tutte le immagini con anteprima watermark
- 💾 **Esporta flessibile** — scarica singoli file o ZIP compresso
- 🎭 **Tema dark/light** — interfaccia elegante con glassmorphism Tahoe
- 🔒 **100% offline** — nessun dato lascia il tuo dispositivo

---

## Installazione

### Download diretto (consigliato)

Scarica l'ultima versione dalla [pagina Releases](https://github.com/oxi-git/watermarker/releases):

| Piattaforma | File |
|---|---|
| macOS (Intel + Apple Silicon) | `Watermarker_x.x.x_universal.dmg` |
| Windows | `Watermarker_x.x.x_x64-setup.exe` |
| Linux (Debian/Ubuntu) | `watermarker_x.x.x_amd64.deb` |
| Linux (AppImage) | `Watermarker_x.x.x_amd64.AppImage` |

### macOS — primo avvio

Se macOS blocca l'app (sviluppatore non verificato):

```bash
xattr -cr /Applications/Watermarker.app
```

---

## Compilare dal sorgente

### Prerequisiti

- [Node.js](https://nodejs.org) ≥ 18
- [Rust](https://rustup.rs) (stable toolchain)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites)

### Setup

```bash
# Clona il repository
git clone https://github.com/oxi-git/watermarker.git
cd watermarker

# Installa le dipendenze
npm install

# Avvia in modalità sviluppo
npm run dev

# Compila per la produzione
npm run build
```

---

## Utilizzo

1. **Apri** uno o più file (PDF o immagini) tramite drag & drop o il menu File
2. **Configura** il watermark: testo, font, opacità, posizione
3. **Anteprima** del risultato nel pannello di destra
4. **Esporta** i file nella cartella di output

---

## Stack tecnico

| Layer | Tecnologia |
|---|---|
| Shell desktop | [Tauri 2](https://tauri.app) + Rust |
| Frontend | HTML5, CSS3 (Glassmorphism Tahoe), JavaScript vanilla |
| Canvas rendering | Web Canvas API (elaborazione immagini lato client) |
| Build | Vite + npm |
| Packaging | macOS (DMG universal), Windows (NSIS + MSI), Linux (AppImage + deb) |

---

## Contribuire

Le contribuzioni sono benvenute! Per bug fix minori apri direttamente una Pull Request. Per nuove feature, apri prima una Issue per discuterne.

```bash
# Crea un branch per la tua feature
git checkout -b feat/nome-feature

# Committa le modifiche
git commit -m "feat: descrizione"

# Apri una Pull Request verso main
```

Per favore segui il [Conventional Commits](https://www.conventionalcommits.org) style.

---

## Licenza

Distribuito sotto licenza **MIT**. Vedi [`LICENSE`](LICENSE) per i dettagli.

---

<div align="center">
  <sub>Fatto con ♥ · <a href="../../issues">Feedback</a></sub>
</div>
