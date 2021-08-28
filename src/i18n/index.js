import i18n from 'i18n-js';
import translationsEN from './en/en.json';
import translationsAR from './ar/ar.json';

i18n.translations = {
  en: translationsEN,
  ar: translationsAR,
};

i18n.locale = 'ar';
i18n.dir = 'RTL';

export default i18n;
