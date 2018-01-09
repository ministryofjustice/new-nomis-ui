import React,{ Component } from 'react';
import moment from 'moment';

import {
  DATE_TIME_FORMAT_SPEC,
} from 'containers/App/constants';


const formatNumbersUpTo = (total) => [...Array(total).keys()].map(i => {
  if (i < 10) return `0${i}`;
  return i;
});

class TimePicker extends Component {

  constructor() {
    super();
    this.onHoursChange = this.onHoursChange.bind(this);
    this.onMinutesChanged = this.onMinutesChanged.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
  }

  onHoursChange(event) {
    if (event && event.target) {
      this.setInputValue({
        ...this.state,
        hours: event.target.value,
      });
    }
  }

  onMinutesChanged(event) {
    if (event && event.target) {
      this.setInputValue({
        ...this.state,
        minutes: event.target.value,
      });
    }
  }

  setInputValue(data) {
    if (data.hours && data.hours !== '--' && data.minutes !== '--') {
      const today = moment();

      today.hours(parseInt(data.hours));
      today.minutes(parseInt(data.minutes || 0));
      today.seconds(0);

      this.props.input.onChange(today.format(DATE_TIME_FORMAT_SPEC));
    } else {
      this.props.input.onChange('');
    }
    this.setState(data);
  }

  render() {
    const { title,meta: { touched, error } } = this.props;
    const hours = ['--', ...formatNumbersUpTo(24)];
    const minutes = ['--', ...formatNumbersUpTo(60)];

    return (<div className={!(touched && error) ? 'time-picker form-group' : 'time-picker form-group form-group-error'}>

      <label className="form-label">
        {title}
      </label>

      <div className="error-message">
        {touched && ((error && <span>{error}</span>))}
      </div>

      <select className={!(touched && error) ? 'form-control add-gutter-margin-right"' : 'form-control form-control-error add-gutter-margin-right"'} name="hours" onChange={this.onHoursChange} defaultValue={'--'}>
        {hours.map(hour => <option key={hour}>
          {hour}
        </option>)}
      </select>

      <select className={!(touched && error) ? 'form-control' : 'form-control form-control-error'} name="minutes" onChange={this.onMinutesChanged} defaultValue={'--'}>
        {minutes.map(minute => <option key={minute}>
          {minute}
        </option>)}
      </select>
    </div>)
  }
}

export default TimePicker;