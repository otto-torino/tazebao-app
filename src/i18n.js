import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import itLocales from './i18n/it.json'

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  it: itLocales
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'it',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'code', 'a'],
      transSupportBasicHtmlNodes: true
    }
  })

export default i18n
