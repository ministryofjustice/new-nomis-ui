/* LanguageSelect */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import Toggle from 'components/Toggle'
import translations from './translations'
import { appLocales } from '../../translations/i18n'
import changeLocale from '../LanguageProvider/actions'
import { selectLocale } from '../LanguageProvider/selectors'

// eslint-disable-next-line react/prefer-stateless-function
export class LocaleToggle extends Component {
  static propTypes = {
    onLocaleToggle: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  }

  render() {
    const { locale, onLocaleToggle } = this.props
    return <Toggle value={locale} messages={translations} values={appLocales} onToggle={onLocaleToggle} />
  }
}

const mapStateToProps = createSelector(selectLocale(), locale => ({ locale }))

export function mapDispatchToProps(dispatch) {
  return {
    onLocaleToggle: evt => dispatch(changeLocale(evt.target.value)),
    dispatch,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocaleToggle)
