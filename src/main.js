import JSZip from 'jszip';
import { save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';
import { initI18n, setLanguage, getLanguage, t, getWord, langs, langNames } from './i18n';

// ── Initialization ─────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

async function initializeApp() {
  try {
    await initI18n();
  } catch (e) {
    console.error('Failed to initialize i18n:', e);
  }
  initializeTheme();
  initializeLanguage();
}

// ── Theme Toggle ───────────────────────────────────────────
function initializeTheme() {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

document.getElementById('theme-toggle').addEventListener('click', () => {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

// ── Language Toggle ────────────────────────────────────────
function initializeLanguage() {
  const langBtn = document.getElementById('lang-toggle');
  if (!langBtn) return;

  updateLanguageButton();

  langBtn.addEventListener('click', () => {
    const currentLang = getLanguage();
    const newLang = currentLang === 'it' ? 'en' : 'it';
    setLanguage(newLang);
    updateLanguageButton();
    updateFileListCount();
  });
}

function updateLanguageButton() {
  const langBtn = document.getElementById('lang-toggle');
  if (!langBtn) return;

  const current = getLanguage();
  langBtn.textContent = current === 'it' ? '🇬🇧' : '🇮🇹';
  langBtn.title = `Switch to ${langNames[current === 'it' ? 'en' : 'it']}`;
}

// ── State ──────────────────────────────────────────────────
const files = [];       // [{file, name, img, thumbCanvas, thumbCtx}]
let mode = 'empty';     // 'empty' | 'grid' | 'preview'
let previewIdx = -1;
let thumbTimer = null;
let watermarkImage = null;  // PNG watermark image

// ── File loading ───────────────────────────────────────────
const dropzone = document.getElementById('dropzone');
dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('drag-over'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.classList.remove('drag-over');
  [...e.dataTransfer.files].filter(f => f.type.startsWith('image/')).forEach(loadFile);
});
document.getElementById('wmimg').addEventListener('change', e => {
  [...e.target.files].forEach(loadFile);
  e.target.value = '';
});

document.getElementById('wmimage-png').addEventListener('change', e => {
  if (e.target.files.length === 0) return;
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      watermarkImage = img;
      document.getElementById('wmimage-info').textContent = `✓ ${file.name} (${img.naturalWidth}×${img.naturalHeight})`;
      if (mode === 'preview') {
        const canvas = document.getElementById('MainCanvas');
        applyWatermarkToCanvas(files[previewIdx].img, canvas, canvas.getContext('2d'), 1);
      } else if (mode === 'grid') {
        redrawAllThumbs();
      }
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
  e.target.value = '';
});

function loadFile(file) {
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const thumbCanvas = document.createElement('canvas');
      files.push({ file, name: file.name, img, thumbCanvas, thumbCtx: thumbCanvas.getContext('2d') });
      updateSidebar();
      if (mode !== 'preview') showGridView();
      else addThumbToGrid(files.length - 1);
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

// ── Sidebar ────────────────────────────────────────────────
function updateFileListCount() {
  const countEl = document.getElementById('filelist-count');
  const count = files.length;
  const text = count === 1 ? getWord('app.image_one') : `${count} ${getWord('app.image_many')}`;
  countEl.textContent = text;
}

function updateSidebar() {
  const section = document.getElementById('filelist-section');
  const listEl  = document.getElementById('filelist');

  section.style.display = files.length ? '' : 'none';
  updateFileListCount();

  dropzone.classList.toggle('compact', files.length > 0);
  dropzone.innerHTML = files.length > 0
    ? `<p style="color:#888;font-size:12px;">+ Aggiungi altre immagini</p>`
    : `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:6px">
         <rect x="3" y="3" width="18" height="18" rx="2"/>
         <circle cx="8.5" cy="8.5" r="1.5"/>
         <path d="M21 15l-5-5L5 21"/>
       </svg>
       <p>Clicca o trascina le immagini</p>
       <p class="hint">JPG · PNG · WEBP · più file contemporaneamente</p>`;

  listEl.innerHTML = '';
  files.forEach((entry, i) => {
    const item = document.createElement('div');
    item.className = 'file-item' + (i === previewIdx && mode === 'preview' ? ' selected' : '');

    const thumb = document.createElement('img');
    thumb.className = 'file-thumb';
    thumb.src = entry.img.src;

    const info = document.createElement('div');
    info.className = 'file-info';

    const nameDiv = document.createElement('div');
    nameDiv.className = 'file-name';
    nameDiv.textContent = entry.name;
    nameDiv.title = entry.name;

    const sizeDiv = document.createElement('div');
    sizeDiv.className = 'file-size';
    sizeDiv.textContent = `${entry.img.naturalWidth}×${entry.img.naturalHeight}`;

    info.appendChild(nameDiv);
    info.appendChild(sizeDiv);

    const rm = document.createElement('span');
    rm.className = 'file-remove';
    rm.textContent = '×';
    rm.onclick = e => { e.stopPropagation(); removeFile(i); };

    item.appendChild(thumb);
    item.appendChild(info);
    item.appendChild(rm);
    item.onclick = () => openPreview(i);
    listEl.appendChild(item);
  });

  const hasSel = mode === 'preview' && previewIdx >= 0;
  document.getElementById('dlpng').disabled    = !hasSel;
  document.getElementById('dljpg').disabled    = !hasSel;
  document.getElementById('dlzippng').disabled = files.length === 0;
  document.getElementById('dlzipjpg').disabled = files.length === 0;
}

function removeFile(idx) {
  files.splice(idx, 1);
  if (files.length === 0) { clearAll(); return; }
  if (previewIdx >= files.length) previewIdx = files.length - 1;
  if (mode === 'preview') openPreview(previewIdx);
  else showGridView();
  updateSidebar();
}

window.clearAll = function () {
  files.length = 0;
  previewIdx = -1;
  mode = 'empty';
  setView('empty');
  updateSidebar();
};

// ── Views ──────────────────────────────────────────────────
function setView(v) {
  document.getElementById('placeholder').style.display  = v === 'empty'   ? 'flex'  : 'none';
  document.getElementById('grid-view').style.display    = v === 'grid'    ? 'block' : 'none';
  document.getElementById('preview-view').style.display = v === 'preview' ? 'flex'  : 'none';
}

window.showGridView = function () {
  mode = 'grid';
  previewIdx = -1;
  setView('grid');
  buildGrid();
  updateSidebar();
};

function buildGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  files.forEach((entry, i) => {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.onclick = () => openPreview(i);
    entry.thumbCanvas.className = 'grid-canvas';
    const label = document.createElement('div');
    label.className = 'cell-label';
    label.textContent = entry.name;
    cell.appendChild(entry.thumbCanvas);
    cell.appendChild(label);
    grid.appendChild(cell);
  });
  redrawAllThumbs();
}

function addThumbToGrid(i) {
  const entry = files[i];
  const grid  = document.getElementById('grid');
  const cell  = document.createElement('div');
  cell.className = 'grid-cell';
  cell.onclick = () => openPreview(i);
  entry.thumbCanvas.className = 'grid-canvas';
  const label = document.createElement('div');
  label.className = 'cell-label';
  label.textContent = entry.name;
  cell.appendChild(entry.thumbCanvas);
  cell.appendChild(label);
  grid.appendChild(cell);
  drawThumb(entry);
}

function openPreview(idx) {
  mode = 'preview';
  previewIdx = idx;
  setView('preview');
  const entry = files[idx];
  document.getElementById('preview-filename').textContent = entry.name;
  document.getElementById('preview-counter').textContent  = `${idx + 1} / ${files.length}`;
  document.getElementById('btn-prev').disabled = idx === 0;
  document.getElementById('btn-next').disabled = idx === files.length - 1;
  const canvas = document.getElementById('MainCanvas');
  applyWatermarkToCanvas(entry.img, canvas, canvas.getContext('2d'), 1);
  updateSidebar();
}

window.navigatePreview = function (delta) {
  const next = previewIdx + delta;
  if (next >= 0 && next < files.length) openPreview(next);
};

// ── Watermark ──────────────────────────────────────────────
function getParams() {
  return {
    lines:        ['wmline1','wmline2','wmline3'].map(id => document.getElementById(id).value).filter(l => l.trim()),
    sizePct:      Number(document.getElementById('wmsize').value),
    alpha:        Number(document.getElementById('wmalpha').value) / 100,
    rotation:     Number(document.getElementById('wmrotation').value) * Math.PI / 180,
    spacingXPct:  Number(document.getElementById('wmspacingx').value),
    spacingYPct:  Number(document.getElementById('wmspacingy').value),
    font:         document.getElementById('wmfont').value,
    color:        document.getElementById('wmcolor').value,
    imageSizePct: Number(document.getElementById('wmimage-size').value),
  };
}

function applyWatermarkToCanvas(srcImg, canvas, ctx, scale) {
  const W = canvas.width  = Math.round(srcImg.naturalWidth  * scale);
  const H = canvas.height = Math.round(srcImg.naturalHeight * scale);
  ctx.drawImage(srcImg, 0, 0, W, H);

  const p = getParams();
  const hasText = p.lines.length > 0;
  const hasImage = watermarkImage !== null;
  if (!hasText && !hasImage) return;

  const dim = Math.sqrt(W * W + H * H);

  ctx.save();
  ctx.globalAlpha  = p.alpha;
  ctx.translate(W / 2, H / 2);
  ctx.rotate(p.rotation);

  // Disegna immagine PNG se caricata
  if (hasImage) {
    const imgSize = (p.imageSizePct / 100) * dim;
    const imgWidth = imgSize * (watermarkImage.naturalWidth / watermarkImage.naturalHeight);
    const imgHeight = imgSize;

    const spacingX = imgWidth * 1.3;
    const spacingY = imgHeight * 1.3;

    const cols = Math.ceil(dim / spacingX) + 2;
    const rows = Math.ceil(dim / spacingY) + 2;

    for (let row = -rows; row <= rows; row++) {
      for (let col = -cols; col <= cols; col++) {
        const x = col * spacingX - imgWidth / 2;
        const y = row * spacingY - imgHeight / 2;
        ctx.drawImage(watermarkImage, x, y, imgWidth, imgHeight);
      }
    }
  }

  // Disegna testo se presente
  if (hasText) {
    const size = (p.sizePct / 100) * dim;
    ctx.font         = `bold ${size}px ${p.font}`;
    ctx.fillStyle    = p.color;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';

    const lineHeight  = size * 1.4;
    const blockHeight = p.lines.length * lineHeight;

    // Misura la larghezza effettiva delle linee di testo
    const textWidth = Math.max(...p.lines.map(line => ctx.measureText(line).width));

    // Spacing dinamico basato sulla grandezza effettiva del testo
    const spacingX = textWidth * (1.2 + p.spacingXPct / 100);
    const spacingY = blockHeight * (1.5 + p.spacingYPct / 150);

    const cols = Math.ceil(dim / spacingX) + 2;
    const rows = Math.ceil(dim / (blockHeight + spacingY)) + 2;

    for (let row = -rows; row <= rows; row++) {
      for (let col = -cols; col <= cols; col++) {
        const x = col * spacingX;
        const y = row * (blockHeight + spacingY);
        p.lines.forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight));
      }
    }
  }

  ctx.restore();
}

function drawThumb(entry) {
  const MAX   = 450;
  const scale = Math.min(1, MAX / Math.max(entry.img.naturalWidth, entry.img.naturalHeight));
  applyWatermarkToCanvas(entry.img, entry.thumbCanvas, entry.thumbCtx, scale);
}

function redrawAllThumbs() {
  files.forEach(drawThumb);
}

// ── Settings sync ──────────────────────────────────────────
document.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('input', () => {
    syncLabels();
    if (mode === 'preview') {
      const canvas = document.getElementById('MainCanvas');
      applyWatermarkToCanvas(files[previewIdx].img, canvas, canvas.getContext('2d'), 1);
    }
    clearTimeout(thumbTimer);
    thumbTimer = setTimeout(redrawAllThumbs, 120);
  });
});

function syncLabels() {
  document.getElementById('wmsizeval').textContent     = parseFloat(document.getElementById('wmsize').value).toFixed(1) + '%';
  document.getElementById('wmalphaval').textContent    = document.getElementById('wmalpha').value + '%';
  document.getElementById('wmrotationval').textContent = document.getElementById('wmrotation').value + '°';
  document.getElementById('wmspacingxval').textContent = document.getElementById('wmspacingx').value + '%';
  document.getElementById('wmspacingyval').textContent = document.getElementById('wmspacingy').value + '%';
  document.getElementById('wmimageval').textContent    = document.getElementById('wmimage-size').value + '%';
}

// ── Download (native Tauri dialog) ─────────────────────────
window.downloadSingle = async function (format) {
  if (previewIdx < 0) return;
  const canvas = document.getElementById('MainCanvas');
  const entry  = files[previewIdx];
  const stem   = entry.name.replace(/\.[^.]+$/, '');
  const ext    = format === 'png' ? 'png' : 'jpg';

  const filePath = await save({
    defaultPath: `${stem}_watermark.${ext}`,
    filters: [{ name: format === 'png' ? 'PNG Image' : 'JPEG Image', extensions: [ext] }],
  });
  if (!filePath) return;

  const dataUrl = format === 'png'
    ? canvas.toDataURL('image/png')
    : canvas.toDataURL('image/jpeg', 0.95);
  const bytes = Uint8Array.from(atob(dataUrl.split(',')[1]), c => c.charCodeAt(0));
  await writeFile(filePath, bytes);
};

window.downloadZip = async function (format) {
  if (!files.length) return;

  const btnPng = document.getElementById('dlzippng');
  const btnJpg = document.getElementById('dlzipjpg');
  const prog   = document.getElementById('zip-progress');
  const bar    = document.getElementById('zip-bar');
  const lbl    = document.getElementById('zip-label');

  // Ask where to save before processing (better UX)
  const filePath = await save({
    defaultPath: `watermarked_${files.length}_files.zip`,
    filters: [{ name: 'ZIP Archive', extensions: ['zip'] }],
  });
  if (!filePath) return;

  btnPng.disabled = btnJpg.disabled = true;
  prog.style.display = '';

  const zip    = new JSZip();
  const canvas = document.createElement('canvas');
  const ctx    = canvas.getContext('2d');
  const ext    = format === 'png' ? 'png' : 'jpg';

  for (let i = 0; i < files.length; i++) {
    lbl.textContent = t('download.processing', { current: i + 1, total: files.length, name: files[i].name });
    bar.style.width = (i / files.length * 100) + '%';
    await new Promise(r => setTimeout(r, 0));

    applyWatermarkToCanvas(files[i].img, canvas, ctx, 1);
    const b64  = (format === 'png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.95)).split(',')[1];
    const stem = files[i].name.replace(/\.[^.]+$/, '');
    zip.file(`${stem}_watermark.${ext}`, b64, { base64: true });
  }

  bar.style.width = '100%';
  lbl.textContent = t('download.creating');

  const zipBytes = await zip.generateAsync({ type: 'uint8array' }, meta => {
    bar.style.width = meta.percent.toFixed(0) + '%';
  });

  await writeFile(filePath, zipBytes);

  prog.style.display  = 'none';
  bar.style.width     = '0%';
  btnPng.disabled = btnJpg.disabled = false;
};

syncLabels();
