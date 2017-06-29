import React from 'react';
import PropTypes from 'prop-types';
import DP from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { InputLabel, InputGroup, Base } from 'components/FormComponents/Input/input.theme';
import styled from 'styled-components';
import { Map } from 'immutable';

const dateFormat = 'L';

const DatePicker = styled(DP)`
  ${Base}
`;

const DatePickerInputGroup = styled(InputGroup)`
  .react-datepicker__input-container {
    width: 50%;
  }
`;
// stolen from https://github.com/Hacker0x01/react-datepicker/issues/543

const asMoment = (t) => t ? moment(t, dateFormat) : null;

class DateRangePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
  }

  handleChangeStart(dateMoment) {
    if (dateMoment === null) {
      this.props.input.onChange(Map({ startDate: null, endDate: null }));
      return;
    }
    const currentValue = this.props.input.value;
    const currentEndDate = currentValue.get('endDate');
    const startDateString = dateMoment.format(dateFormat);

    if (!currentEndDate || moment(currentEndDate, dateFormat).isBefore(dateMoment)) {
      this.props.input.onChange(Map({ startDate: startDateString, endDate: startDateString }));
    } else {
      this.props.input.onChange(currentValue.set('startDate', startDateString));
    }
  }

  handleChangeEnd(dateMoment) {
    if (dateMoment === null) {
      this.props.input.onChange(Map({ startDate: null, endDate: null }));
      return;
    }
    const currentValue = this.props.input.value;
    const currentStartDate = currentValue.get('startDate');
    const endDateString = dateMoment.format(dateFormat);

    if (!currentStartDate || moment(currentStartDate, dateFormat).isAfter(dateMoment)) {
      this.props.input.onChange(Map({ startDate: endDateString, endDate: endDateString }));
    } else {
      this.props.input.onChange(currentValue.set('endDate', endDateString));
    }
  }

  render() {
    const {
      input, placeholder,
      meta: { touched, error },
      title,
    } = this.props;

    const startDate = asMoment(input.value.get('startDate'));
    const endDate = asMoment(input.value.get('endDate'));

    return (
      <DatePickerInputGroup>
        <InputLabel>{title}</InputLabel>
        <DatePicker
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholder={placeholder}
          dateFormat={dateFormat}
          selected={startDate}
          onChange={this.handleChangeStart}
          onFocus={() => input.onFocus()}
          onBlur={() => input.onBlur()}
        />
        <DatePicker
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholder={placeholder}
          dateFormat={dateFormat}
          selected={endDate}
          onChange={this.handleChangeEnd}
          onFocus={() => input.onFocus()}
          onBlur={() => input.onBlur()}
        />
        {touched && error && <span>{error}</span>}
      </DatePickerInputGroup>
    );
  }
}

DateRangePicker.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.bool,
  }).isRequired,
  placeholder: PropTypes.string,
  title: PropTypes.string,
};

DateRangePicker.defaultProps = {
  placeholder: '',
  title: '',
};

export default DateRangePicker;
