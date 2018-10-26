/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 */
import { addLocaleData } from 'react-intl'

import enLocaleData from 'react-intl/locale-data/en'
import frLocaleData from 'react-intl/locale-data/fr'
import { DEFAULT_LOCALE } from '../containers/App/constants'

import enTranslationMessages from './en'
import frTranslationMessages from './fr'

export const appLocales = ['en', 'fr']

addLocaleData(enLocaleData)
addLocaleData(frLocaleData)

export const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages) : {}
  return Object.keys(messages).reduce((formattedMessages, key) => {
    let message = messages[key]
    if (!message && locale !== DEFAULT_LOCALE) {
      message = defaultFormattedMessages[key]
    }
    return Object.assign(formattedMessages, { [key]: message })
  }, {})
}

export const translationMessages = {
  en: formatTranslationMessages('en', enTranslationMessages),
  'en-GB': formatTranslationMessages('en-GB', enTranslationMessages),
  'en-US': formatTranslationMessages('en-US', enTranslationMessages),
  fr: formatTranslationMessages('fr', frTranslationMessages),
}
