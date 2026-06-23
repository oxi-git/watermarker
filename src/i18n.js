// Simple i18n system
import itMessages from './locales/it.json';
import enMessages from './locales/en.json';

let currentLang = localStorage.getItem('language') || (navigator.language.startsWith('en') ? 'en' : 'it');
let translations = { it: itMessages, en: enMessages };

export async function initI18n() {
  applyLanguage(currentLang);
  return currentLang;
}

export function t(key, vars = {}) {
  const lang = translations[currentLang] || translations.it;

  // JSON keys are flat (e.g., "app.title"), not nested (e.g., app.title)
  let text = lang[key] || key;

  // Simple variable substitution: {varName} → value
  Object.entries(vars).forEach(([k, v]) => {
    text = text.replace(`{${k}}`, String(v));
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
