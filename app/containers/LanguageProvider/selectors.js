import { createSelector } from 'reselect'
import { IntlProvider } from 'react-intl'

/**
 * Direct selector to the languageToggle state domain
 */
const selectLanguage = () => state => state.get('language')

/**
 * Select the language locale
 */
const selectLocale = () =>
  createSelector(
    selectLanguage(),
    languageState =>
      (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      navigator.browserLanguage ||
      languageState.get('locale')
  )

/**
 * A selector to provide access to the react-intl imperative API (e.g. formatDate(), formatNumber(), formatMessage(), etc.)
 * in other selectors. Where possible use global IntlProvider within React components via <FormatXXXX> tags but there
 * may be occassions where it is necessary to format values or access locale-specific messages outside the scope of a
 * component. See 'containers/Bookings/selectors#selectOffenderDetails' for an example of how to use intlSelector.
 */
const intlSelector = () =>
  createSelector(selectLocale(), currentLocale =>
    new IntlProvider({ locale: currentLocale, messages: {} }, {}).getChildContext()
  )

export { selectLanguage, selectLocale, intlSelector }
