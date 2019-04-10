import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Datetime from 'react-datetime'
import moment from 'moment'
import 'react-datetime/css/react-datetime.css'
import styled from 'styled-components'
import LabelText from '@govuk-react/label-text'
import Label from '@govuk-react/label'
import ErrorText from '@govuk-react/error-text'
import Input from '@govuk-react/input'
import { MEDIA_QUERIES } from '@govuk-react/constants'

import { DEFAULT_MOMENT_DATE_FORMAT_SPEC } from '../../../containers/App/constants'
import { inputType, metaType } from '../../../types'

const StyledDatePicker = styled.div`
  ${MEDIA_QUERIES.TABLET} {
    max-width: 155px;
  }
`

export class DatePicker extends Component {
  handleChange = date => {
    const { input } = this.props
    input.onChange(date.format(DEFAULT_MOMENT_DATE_FORMAT_SPEC))
  }

  renderInput = props => {
    const {
      title,
      input: { name },
      meta: { touched, error },
    } = this.props
    const hasError = touched && error

    return (
      <StyledDatePicker>
        <Label error={hasError} mb={6}>
          <LabelText>{title}</LabelText>
          {hasError && <ErrorText>{error}</ErrorText>}
          <Input {...props} name={name} error={hasError} readOnly />
        </Label>
      </StyledDatePicker>
    )
  }

  render() {
    const {
      defaultValue,
      shouldShowDay,
      locale,
      input: { name, value },
    } = this.props

    return (
      <div className="date-picker-component">
        <Datetime
          onChange={this.handleChange}
          value={value}
          timeFormat={false}
          isValidDate={shouldShowDay}
          locale={locale}
          closeOnSelect
          strictParsing
          defaultValue={defaultValue}
          renderInput={this.renderInput}
          inputProps={{ id: name }}
        />
      </div>
    )
  }
}

DatePicker.propTypes = {
  title: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  shouldShowDay: PropTypes.func.isRequired,
  input: inputType.isRequired,
  meta: metaType.isRequired,
  defaultValue: PropTypes.string,
  showError: PropTypes.bool,
}

DatePicker.defaultProps = {
  defaultValue: '',
  showError: false,
}

export const momentToLocalizedDate = locale => theMoment =>
  theMoment ? theMoment.format(DEFAULT_MOMENT_DATE_FORMAT_SPEC, locale) : theMoment
export const localizedDateToMoment = locale => localizedDateString =>
  localizedDateString ? moment(localizedDateString, DEFAULT_MOMENT_DATE_FORMAT_SPEC, locale) : localizedDateString
