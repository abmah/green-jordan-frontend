import 'intl-pluralrules';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import enTranslation from '../locales/en.json';
import arTranslation from '../locales/ar.json';

const LANGUAGE_STORAGE_KEY = 'appLanguage';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation },
    },
    lng: 'ar', // Default language, will be overridden by AsyncStorage if available
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
  });

// Function to save the selected language to AsyncStorage
const setLanguage = async (lang) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    i18n.changeLanguage(lang);
  } catch (error) {
    console.error('Failed to save language to AsyncStorage', error);
  }
};

// Function to load the saved language from AsyncStorage
const loadLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.error('Failed to load language from AsyncStorage', error);
  }
};

// Call the loadLanguage function when the app starts
loadLanguage();

export { setLanguage };
export default i18n;
