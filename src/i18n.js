// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';
import arTranslation from './locales/ar/translation.json';

const browserLanguage = navigator.language || navigator.languages[0];
const languageCode = browserLanguage.substring(0, 2);
const supportedLanguages = ['en', 'fr', 'ar'];
const detectedLanguage = supportedLanguages.includes(languageCode) ? languageCode : 'en';

document.documentElement.lang = detectedLanguage;
document.documentElement.dir = detectedLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.classList.add(detectedLanguage === 'ar' ? 'rtl' : 'ltr');

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
      ar: { translation: arTranslation },
    },
    lng: detectedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
