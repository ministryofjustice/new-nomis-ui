import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import moment from 'moment'

const InternalFormattedDate = ({ value, intl }) => {
  const m = moment(value)
  m.locale(intl.locale)
  return <span>{m.format('L')}</span>
}

InternalFormattedDate.propTypes = {
  value: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
}

export const FormattedDate = injectIntl(InternalFormattedDate)

const InternalFormattedTime = ({ value, intl }) => {
  const m = moment(value)
  m.locale(intl.locale)
  return <span>{m.format('LT')}</span>
}

InternalFormattedTime.propTypes = {
  value: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
}

export const FormattedTime = injectIntl(InternalFormattedTime)

export const FormattedDay = ({ value }) => <span>{moment(value).format('dddd')}</span>

FormattedDay.propTypes = {
  value: PropTypes.string.isRequired,
}
