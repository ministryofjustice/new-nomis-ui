import React, { Component } from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import {
  DEFAULT_MOMENT_DATE_FORMAT_SPEC,
  DEFAULT_MOMENT_TIME_FORMAT_SPEC,
  DATE_TIME_FORMAT_SPEC,
} from 'containers/App/constants';

class DatePicker extends Component {
  constructor() {
    super();
    this.renderInput = this.renderInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.props.input.onChange(moment(date).format(DEFAULT_MOMENT_DATE_FORMAT_SPEC));
  }

  renderInput(props, openCalendar) {
    return <input type="date" {...props} onClick={openCalendar} />
  }

  render() {
    const { title,shouldShowDay,locale, meta: { touched, error } } = this.props;

    return (<div className={!(touched && error) ? 'form-group' : 'form-group form-group-error'}>

      <label className="form-label">
        {title}
      </label>

      <div className="error-message">
        {touched && ((error && <span>{error}</span>))}
      </div>


      <Datetime
        className={touched && error && 'form-control form-control-error'}
        renderInput={this.renderInput}
        onChange={this.handleChange}
        timeFormat={false}
        isValidDate={shouldShowDay}
        locale={locale}
      />
     </div>)
  }
}

export default DatePicker;