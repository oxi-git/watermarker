// Simple i18n system
import itMessages from '../public/locales/it.json';
import enMessages from '../public/locales/en.json';

let currentLang = localStorage.getItem('language') || (navigator.language.startsWith('en') ? 'en' : 'it');
let translations = { it: itMessages, en: enMessages };

export async function initI18n() {
  console.log('[i18n] Initializing with translations:', Object.keys(translations));
  console.log('[i18n] IT keys:', Object.keys(translations.it).length);
  console.log('[i18n] EN keys:', Object.keys(translations.en).length);
  applyLanguage(currentLang);
  console.log('[i18n] Applied language:', currentLang);
  return currentLang;
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
  console.log('[i18n] setLanguage called with:', lang);
  console.log('[i18n] Available translations:', Object.keys(translations));
  console.log('[i18n] translations[lang] exists?', !!translations[lang]);

  if (!translations[lang]) {
    console.warn(`[i18n] No translations for language: ${lang}`);
    return;
  }

  console.log('[i18n] Switching language to:', lang);
  currentLang = lang;
  localStorage.setItem('language', lang);
  applyLanguage(lang);
  console.log('[i18n] Language switched successfully');
}

export function getLanguage() {
  return currentLang;
}

function applyLanguage(lang) {
  console.log('[i18n] applyLanguage called with:', lang);

  // Update all elements with data-i18n attribute
  const i18nElements = document.querySelectorAll('[data-i18n]');
  console.log('[i18n] Found', i18nElements.length, 'elements with data-i18n');

  i18nElements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    console.log(`[i18n] Updating "${key}" →`, text);
    el.textContent = text;
  });

  // Update all elements with data-i18n-placeholder attribute
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  console.log('[i18n] Found', placeholderElements.length, 'elements with data-i18n-placeholder');

  placeholderElements.forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = t(key);
    console.log(`[i18n] Updating placeholder "${key}" →`, text);
    el.placeholder = text;
  });
}

export const langs = ['it', 'en'];
export const langNames = { it: 'Italiano', en: 'English' };
