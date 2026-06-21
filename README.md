<div align="center">
  <img src="watermarker-logo.svg" alt="Watermarker" width="128" height="128">

  # Watermarker

  **Aggiungi filigrane ai tuoi documenti in pochi secondi.**  
  App desktop leggera e professionale per proteggere PDF e immagini con watermark personalizzati.

  [![Release](https://img.shields.io/github/v/release/YOUR_USERNAME/watermarker?style=flat-square)](https://github.com/YOUR_USERNAME/watermarker/releases)
  [![License](https://img.shields.io/github/license/YOUR_USERNAME/watermarker?style=flat-square)](LICENSE)
  [![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey?style=flat-square)](#installazione)
  [![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri-FFC131?style=flat-square&logo=tauri&logoColor=black)](https://tauri.app)

  [**Download**](#installazione) · [Segnala un bug](../../issues) · [Richiedi una feature](../../issues)

</div>

---

## Screenshot

> _Screenshot o GIF dell'app in uso_

---

## Funzionalità

- 📄 **Watermark su PDF** — sovrapponi testo o immagine a ogni pagina
- 🖼️ **Watermark su immagini** — supporto PNG, JPEG, WebP
- 🔤 **Testo personalizzato** — font, dimensione, colore, opacità, rotazione
- 📍 **Posizionamento libero** — angoli, centro, tiled su tutto il documento
- 🔁 **Elaborazione in batch** — applica a più file in una volta sola
- 👁 **Anteprima in tempo reale** — vedi il risultato prima di esportare
- 💾 **Esporta senza perdita di qualità** — output ottimizzato per ogni formato
- 🔒 **100% offline** — nessun dato lascia il tuo dispositivo

---

## Installazione

### Download diretto (consigliato)

Scarica l'ultima versione dalla [pagina Releases](../../releases):

| Piattaforma | File |
|---|---|
| macOS (Apple Silicon + Intel) | `Watermarker_x.x.x_universal.dmg` |
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
git clone https://github.com/YOUR_USERNAME/watermarker.git
cd watermarker

# Installa le dipendenze
npm install

# Avvia in modalità sviluppo
npm run tauri dev

# Compila per la produzione
npm run tauri build
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
| Frontend | <!-- React / Svelte / Vue --> |
| Elaborazione PDF | <!-- libreria usata --> |
| Build | Vite |

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
