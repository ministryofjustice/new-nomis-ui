import React, { Component } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import Label from '@govuk-react/label'
import LabelText from '@govuk-react/label-text'
import { SelectInput } from '@govuk-react/select'
import ErrorText from '@govuk-react/error-text'
import styled from 'styled-components'
import { spacing } from '@govuk-react/lib'
import { MEDIA_QUERIES } from '@govuk-react/constants'

import { DATE_TIME_FORMAT_SPEC, DATE_ONLY_FORMAT_SPEC } from '../../../containers/App/constants'
import { inputType, metaType } from '../../../types'

const formatNumbersUpTo = total =>
  [...Array(total).keys()].map(i => {
    if (i < 10) return `0${i}`
    return i
  })

const constructHours = ({ dateTime, futureTimeOnly, enableFilters }) => {
  const hours = ['--', ...formatNumbersUpTo(24)]
  if (!enableFilters) {
    return hours
  }
  const filter = futureTimeOnly ? unit => unit >= dateTime.hour() : unit => unit <= dateTime.hour()
  return ['--', ...hours.filter(filter)]
}

const constructMinutes = ({ selectedHour, dateTime, futureTimeOnly, enableFilters }) => {
  const minutes = ['--', '00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
  if (!enableFilters) {
    return minutes
  }

  if (dateTime.hour() === parseInt(selectedHour, 10)) {
    const filter = futureTimeOnly ? unit => unit >= dateTime.minute() : unit => unit <= dateTime.minute()
    return ['--', ...minutes.filter(filter)]
  }

  return minutes
}

const Container = styled('div')`
  display: flex;
  margin-left: -${spacing.simple(3)}px;

  select {
    margin-left: ${spacing.simple(3)}px !important;

    ${MEDIA_QUERIES.TABLET} {
      width: 70px; /* Generally used with DatePicker which is 155 (155px width - 15px margin / 2) */
    }
  }
`

class TimePicker extends Component {
  constructor() {
    super()
    this.onHoursChange = this.onHoursChange.bind(this)
    this.onMinutesChange = this.onMinutesChange.bind(this)
    this.setInputValue = this.setInputValue.bind(this)
    this.shouldEnableFilters = this.shouldEnableFilters.bind(this)
    this.getNearestMinute = this.getNearestMinute.bind(this)

    this.state = {}
  }

  componentDidMount() {
    const { initialiseToNow } = this.props
    if (initialiseToNow) {
      const time = {
        hours: this.getCurrentHour(),
        minutes: this.getNearestMinute().toString(),
      }

      this.setInputValue(time)
    }
  }

  componentWillReceiveProps(newProps) {
    const { input } = this.props
    if (!input.value) {
      return
    }

    const selectedDate = moment(input.value, DATE_TIME_FORMAT_SPEC)
    const newDate = moment(newProps.date, DATE_TIME_FORMAT_SPEC)

    if (selectedDate.format(DATE_ONLY_FORMAT_SPEC) !== newDate.format(DATE_ONLY_FORMAT_SPEC)) {
      newDate.hour(selectedDate.hours())
      newDate.minutes(selectedDate.minutes())
      newDate.seconds(0)
      input.onChange(newDate.format(DATE_TIME_FORMAT_SPEC))
    }
  }

  onHoursChange(event) {
    if (event && event.target) {
      this.setInputValue({
        ...this.state,
        hours: event.target.value,
      })
    }
  }

  onMinutesChange(event) {
    if (event && event.target) {
      this.setInputValue({
        ...this.state,
        minutes: event.target.value,
      })
    }
  }

  setInputValue(data) {
    const { date, input } = this.props
    if (data.hours && data.hours !== '--' && data.minutes !== '--') {
      const selectedDate = (date && moment(date, DATE_ONLY_FORMAT_SPEC)) || moment()

      selectedDate.hours(parseInt(data.hours, 10))
      selectedDate.minutes(parseInt(data.minutes || 0, 10))
      selectedDate.seconds(0)

      input.onChange(selectedDate.format(DATE_TIME_FORMAT_SPEC))
    } else {
      input.onChange('')
    }
    this.setState(data)
  }

  getCurrentHour() {
    const { now } = this.props
    const currentHour = now.hours().toString()

    return (currentHour < 10 ? '0' : '') + currentHour
  }

  getNearestMinute() {
    const { now, futureTimeOnly, pastTimeOnly } = this.props
    const minutes = constructMinutes({
      selectedHour: now.hour(),
      dateTime: now,
      futureTimeOnly,
      pastTimeOnly,
      enableFilters: this.shouldEnableFilters(),
    })

    return minutes[minutes.length - 1]
  }

  shouldEnableFilters() {
    const { date, now, futureTimeOnly, pastTimeOnly } = this.props
    if (!date || !now) {
      return false
    }

    const isToday = now.isSame(date, 'day')
    return isToday && (futureTimeOnly || pastTimeOnly)
  }

  render() {
    const {
      title,
      meta: { touched, error },
      now,
      date,
      futureTimeOnly,
      pastTimeOnly,
      input: { name },
    } = this.props
    const { hours, minutes } = this.state

    const dateTime = moment(now, DATE_TIME_FORMAT_SPEC)
    const dateOnly = moment(date, DATE_ONLY_FORMAT_SPEC)
    const enableFilters = this.shouldEnableFilters()
    const selectedHour = this.state && hours

    const constructedHours = constructHours({ dateTime, dateOnly, futureTimeOnly, pastTimeOnly, enableFilters })
    const constructedMinutes = constructMinutes({
      selectedHour,
      dateTime,
      dateOnly,
      futureTimeOnly,
      pastTimeOnly,
      enableFilters,
    })

    return (
      <Label error={touched && error} mb={6}>
        {title && <LabelText> {title} </LabelText>}
        {touched && error && <ErrorText>{error}</ErrorText>}
        <Container error={Boolean(error)} name={name}>
          <SelectInput
            disabled={!date}
            name="hours"
            id={name}
            onChange={this.onHoursChange}
            defaultValue="--"
            value={hours}
            error={touched && error}
          >
            {constructedHours.map(hour => (
              <option key={hour}>{hour}</option>
            ))}
          </SelectInput>
          <SelectInput
            disabled={!date}
            name="minutes"
            onChange={this.onMinutesChange}
            defaultValue="--"
            value={minutes}
            error={touched && error}
          >
            {constructedMinutes.map(minute => (
              <option key={minute}>{minute}</option>
            ))}
          </SelectInput>
        </Container>
      </Label>
    )
  }
}

TimePicker.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(moment),
  now: PropTypes.instanceOf(moment).isRequired,
  initialiseToNow: PropTypes.bool,
  pastTimeOnly: PropTypes.bool,
  futureTimeOnly: PropTypes.bool,
  input: inputType.isRequired,
  meta: metaType.isRequired,
}

TimePicker.defaultProps = {
  date: null,
  initialiseToNow: false,
  pastTimeOnly: false,
  futureTimeOnly: false,
}

export default TimePicker
