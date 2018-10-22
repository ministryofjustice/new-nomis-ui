import React from 'react'
import PropTypes from 'prop-types'
import DP from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import { DEFAULT_MOMENT_DATE_FORMAT_SPEC } from 'containers/App/constants'
import styled from 'styled-components'

const DatePicker = styled(DP)`
  height: 36px !important;
`

// stolen from https://github.com/Hacker0x01/react-datepicker/issues/543

const asMoment = t => (t ? moment(t, DEFAULT_MOMENT_DATE_FORMAT_SPEC) : null)

const className = showError => (showError ? 'form-control form-control-error' : 'form-control')

class renderDatePicker extends React.Component {
  static propTypes = {
    locale: PropTypes.string,
    input: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.bool,
    }).isRequired,
    placeholder: PropTypes.string,
    title: PropTypes.string,
    showError: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    locale: 'en',
    placeholder: '',
    title: '',
  }

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(date) {
    const { input } = this.props
    input.onChange(moment(date).format(DEFAULT_MOMENT_DATE_FORMAT_SPEC))
  }

  render() {
    const {
      locale,
      input,
      placeholder,
      meta: { touched, error },
      title,
      showError,
    } = this.props

    moment.locale(locale)

    return (
      <div className="date-picker">
        {touched && error ? <div className="error-message">{error}</div> : null}
        <label className="form-label">{title}</label>
        <DatePicker
          {...input}
          placeholder={placeholder}
          dateFormat={DEFAULT_MOMENT_DATE_FORMAT_SPEC}
          selected={input.value ? asMoment(input.value) : null}
          onChange={this.handleChange}
          className={className(showError || (touched && error))}
        />
      </div>
    )
  }
}

export default renderDatePicker
