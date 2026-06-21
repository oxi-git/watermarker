// Simple i18n system
let currentLang = localStorage.getItem('language') || (navigator.language.startsWith('en') ? 'en' : 'it');
let translations = {};

export async function initI18n() {
  try {
    console.log('Loading translations...');
    const [itRes, enRes] = await Promise.all([
      fetch('/locales/it.json'),
      fetch('/locales/en.json'),
    ]);

    if (!itRes.ok || !enRes.ok) {
      throw new Error(`Failed to fetch: IT ${itRes.status}, EN ${enRes.status}`);
    }

    const [itData, enData] = await Promise.all([
      itRes.json(),
      enRes.json(),
    ]);

    translations = { it: itData, en: enData };
    console.log('Translations loaded successfully:', Object.keys(translations));
    applyLanguage(currentLang);
    console.log('Applied language:', currentLang);
    return currentLang;
  } catch (e) {
    console.error('Failed to load translations:', e);
    // Fallback: translations remain empty but app doesn't crash
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
