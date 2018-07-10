import React, { Component } from 'react';
import moment from 'moment';

import {
  DATE_TIME_FORMAT_SPEC,
  DATE_ONLY_FORMAT_SPEC,
} from 'containers/App/constants';

const formatNumbersUpTo = (total) => [...Array(total).keys()].map(i => {
  if (i < 10) return `0${i}`;
  return i;
});

const constructHours = ({ dateTime ,futureTimeOnly, enableFilters }) => {
  const hours = ['--', ...formatNumbersUpTo(24)];
  if (!enableFilters) {
    return hours;
  }
  const filter = futureTimeOnly ? (unit => unit >= dateTime.hour()) : (unit => unit <= dateTime.hour());
  return ['--', ...hours.filter(filter)];
};

const constructMinutes = ({ selectedHour, dateTime, futureTimeOnly, enableFilters }) => {
  const minutes = ['--', '00','05','10','15','20','25','30','35','40','45','50','55'];
  if (!enableFilters) {
    return minutes;
  }

  if (dateTime.hour() === parseInt(selectedHour)) {
    const filter = futureTimeOnly ? (unit => unit >= dateTime.minute()) : (unit => unit <= dateTime.minute());
    return ['--', ...minutes.filter(filter)];
  }

  return minutes;
};


class TimePicker extends Component {
  constructor() {
    super();
    this.onHoursChange = this.onHoursChange.bind(this);
    this.onMinutesChange = this.onMinutesChange.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (!this.props.input.value) {
      return;
    }

    const selectedDate = moment(this.props.input.value,DATE_TIME_FORMAT_SPEC);
    const newDate = moment(newProps.date, DATE_TIME_FORMAT_SPEC);

    if (selectedDate.format(DATE_ONLY_FORMAT_SPEC) !== newDate.format(DATE_ONLY_FORMAT_SPEC)) {
      newDate.hour(selectedDate.hours());
      newDate.minutes(selectedDate.minutes());
      newDate.seconds(0);
      this.props.input.onChange(newDate.format(DATE_TIME_FORMAT_SPEC));
    }
  }

  onHoursChange(event) {
    if (event && event.target) {
      this.setInputValue({
        ...this.state,
        hours: event.target.value,
      });
    }
  }

  onMinutesChange(event) {
    if (event && event.target) {
      this.setInputValue({
        ...this.state,
        minutes: event.target.value,
      });
    }
  }

  setInputValue(data) {
    if (data.hours && data.hours !== '--' && data.minutes !== '--') {
      const date = (this.props.date && moment(this.props.date, DATE_ONLY_FORMAT_SPEC)) || moment();

      date.hours(parseInt(data.hours));
      date.minutes(parseInt(data.minutes || 0));
      date.seconds(0);

      this.props.input.onChange(date.format(DATE_TIME_FORMAT_SPEC));
    } else {
      this.props.input.onChange('');
    }
    this.setState(data);
  }

  render() {
    const { title,meta: { touched, error }, now, date, futureTimeOnly, pastTimeOnly } = this.props;

    const dateTime = moment(now, DATE_TIME_FORMAT_SPEC);
    const dateOnly = moment(date, DATE_ONLY_FORMAT_SPEC);
    const isToday = dateOnly.isSame(dateTime, 'day');
    const enableFilters = (isToday && (futureTimeOnly || pastTimeOnly));
    const selectedHour = this.state && this.state.hours;

    const hours = constructHours({ dateTime, dateOnly, futureTimeOnly, pastTimeOnly,enableFilters });
    const minutes = constructMinutes({ selectedHour ,dateTime,dateOnly,futureTimeOnly, pastTimeOnly, enableFilters });

    return (<div className={!(touched && error) ? 'time-picker form-group' : 'time-picker form-group form-group-error'}>

      <label className="form-label">
        {title}
      </label>

      <div className="error-message">
        {touched && ((error && <span>{error}</span>))}
      </div>

      <select disabled={!this.props.date} className={!(touched && error) ? 'form-control add-gutter-margin-right select-hours' : 'form-control form-control-error add-gutter-margin-right'} name="hours" onChange={this.onHoursChange} defaultValue={'--'}>
        {hours.map(hour => (
          <option key={hour}>
            {hour}
          </option>
        ))}
      </select>

      <select disabled={!this.props.date} className={!(touched && error) ? 'form-control select-minutes' : 'form-control form-control-error'} name="minutes" onChange={this.onMinutesChange} defaultValue={'--'}>
        {minutes.map(minute => (
          <option key={minute}>
            {minute}
          </option>
        ))}
      </select>
    </div>)
  }
}

export default TimePicker;