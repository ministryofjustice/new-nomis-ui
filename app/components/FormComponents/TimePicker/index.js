import React, { Component } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'

import { DATE_TIME_FORMAT_SPEC, DATE_ONLY_FORMAT_SPEC } from 'containers/App/constants'

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
    const { initialiseToNow, now } = this.props
    if (initialiseToNow) {
      const time = {
        hours: now.hours().toString(),
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
      <div className={!(touched && error) ? 'time-picker form-group' : 'time-picker form-group form-group-error'}>
        <label htmlFor={name} className="form-label">
          {title}
        </label>

        <div className="error-message">{touched && (error && <span>{error}</span>)}</div>

        <select
          disabled={!date}
          className={
            !(touched && error)
              ? 'form-control add-gutter-margin-right select-hours'
              : 'form-control form-control-error add-gutter-margin-right'
          }
          name="hours"
          id={name}
          onChange={this.onHoursChange}
          defaultValue="--"
          value={hours}
        >
          {constructedHours.map(hour => (
            <option key={hour}>{hour}</option>
          ))}
        </select>

        <select
          disabled={!date}
          className={!(touched && error) ? 'form-control select-minutes' : 'form-control form-control-error'}
          name="minutes"
          onChange={this.onMinutesChange}
          defaultValue="--"
          value={minutes}
        >
          {constructedMinutes.map(minute => (
            <option key={minute}>{minute}</option>
          ))}
        </select>
      </div>
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
  input: PropTypes.shape({ name: PropTypes.string.isRequired, value: PropTypes.string }).isRequired,
  meta: PropTypes.shape({ touched: PropTypes.bool, error: PropTypes.string }).isRequired,
}

TimePicker.defaultProps = {
  date: null,
  initialiseToNow: false,
  pastTimeOnly: false,
  futureTimeOnly: false,
}

export default TimePicker
