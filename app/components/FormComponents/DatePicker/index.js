import React, { Component } from 'react'
import Datetime from 'react-datetime'
import moment from 'moment'
import 'react-datetime/css/react-datetime.css'
import PropTypes from 'prop-types'

import { DEFAULT_MOMENT_DATE_FORMAT_SPEC } from '../../../containers/App/constants'
import './index.scss'

export class DatePicker extends Component {
  constructor() {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.renderInput = this.renderInput.bind(this)
  }

  handleChange(date) {
    const { input } = this.props
    input.onChange(moment(date).format(DEFAULT_MOMENT_DATE_FORMAT_SPEC))
  }

  renderInput(props) {
    return (
      <div>
        <input {...props} readOnly />
      </div>
    )
  }

  render() {
    const {
      title,
      defaultValue,
      shouldShowDay,
      locale,
      showError,
      input: { name, value },
      meta: { touched, error },
    } = this.props

    return (
      <div className="date-picker-component">
        <div className={((showError || (touched && error)) && 'form-group form-group-error') || 'form-group'}>
          <label htmlFor={name} className="form-label">
            {title}
          </label>

          <div className="error-message">{touched && error && <span>{error}</span>}</div>

          <Datetime
            className={(showError || (touched && error)) && 'form-control-error'}
            onChange={this.handleChange}
            timeFormat={false}
            isValidDate={shouldShowDay}
            locale={locale}
            closeOnSelect
            strictParsing
            renderInput={this.renderInput}
            defaultValue={defaultValue}
            value={value}
            inputProps={{ id: name }}
          />
        </div>
      </div>
    )
  }
}

DatePicker.propTypes = {
  title: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  shouldShowDay: PropTypes.func.isRequired,
  input: PropTypes.shape({ name: PropTypes.string.isRequired, value: PropTypes.string }).isRequired,
  meta: PropTypes.shape({ touched: PropTypes.bool, error: PropTypes.string }).isRequired,
}

DatePicker.defaultProps = {}

export const momentToLocalizedDate = locale => theMoment =>
  theMoment ? theMoment.format(DEFAULT_MOMENT_DATE_FORMAT_SPEC, locale) : theMoment
export const localizedDateToMoment = locale => localizedDateString =>
  localizedDateString ? moment(localizedDateString, DEFAULT_MOMENT_DATE_FORMAT_SPEC, locale) : localizedDateString
