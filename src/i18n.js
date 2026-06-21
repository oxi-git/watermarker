// Simple i18n system
let currentLang = localStorage.getItem('language') || (navigator.language.startsWith('en') ? 'en' : 'it');
let translations = {};

export async function initI18n() {
  try {
    const [itData, enData] = await Promise.all([
      fetch('/locales/it.json').then(r => r.json()),
      fetch('/locales/en.json').then(r => r.json()),
    ]);
    translations = { it: itData, en: enData };
    applyLanguage(currentLang);
    return currentLang;
  } catch (e) {
    console.error('Failed to load translations:', e);
  }
}

export function t(key, vars = {}) {
  const lang = translations[currentLang] || translations.it;
  let text = key.split('.').reduce((obj, k) => obj?.[k], lang) || key;

  // Simple variable substitution: {varName} → value
  Object.entries(vars).forEach(([k, v]) => {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
  });

  return text;
}

// Helper: get word or phrase in current language
export function getWord(key) {
  const lang = translations[currentLang] || translations.it;
  return key.split('.').reduce((obj, k) => obj?.[k], lang) || key;
}

export function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('language', lang);
  applyLanguage(lang);
}

export function getLanguage() {
  return currentLang;
}

function applyLanguage(lang) {
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Update all elements with data-i18n-placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
}

export const langs = ['it', 'en'];
export const langNames = { it: 'Italiano', en: 'English' };
