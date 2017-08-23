import React from 'react';
import PropTypes from 'prop-types';
import DP from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { InputLabel, InputGroup, Base } from 'components/FormComponents/Input/input.theme';
import styled from 'styled-components';
import { Map } from 'immutable';
import { DEFAULT_MOMENT_DATE_FORMAT_SPEC } from 'containers/App/constants';

const DatePicker = styled(DP)`
  ${Base}
`;

const DatePickerInputGroup = styled(InputGroup)`
  .react-datepicker__input-container {
    width: 50%;
  }
`;

// stolen from https://github.com/Hacker0x01/react-datepicker/issues/543

const asMoment = (t) => t ? moment(t, DEFAULT_MOMENT_DATE_FORMAT_SPEC) : null;

class DateRangePicker extends React.Component {
  static propTypes = {
    locale: PropTypes.string,
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
  }

  static defaultProps = {
    locale: 'en',
    placeholder: '',
    title: '',
  }

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
    const startDateString = dateMoment.format(DEFAULT_MOMENT_DATE_FORMAT_SPEC);

    if (!currentEndDate || moment(currentEndDate, DEFAULT_MOMENT_DATE_FORMAT_SPEC).isBefore(dateMoment)) {
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
    const endDateString = dateMoment.format(DEFAULT_MOMENT_DATE_FORMAT_SPEC);

    if (!currentStartDate || moment(currentStartDate, DEFAULT_MOMENT_DATE_FORMAT_SPEC).isAfter(dateMoment)) {
      this.props.input.onChange(Map({ startDate: endDateString, endDate: endDateString }));
    } else {
      this.props.input.onChange(currentValue.set('endDate', endDateString));
    }
  }

  render() {
    const {
      locale,
      input,
      placeholder,
      meta: { touched, error },
      title,
    } = this.props;

    moment.locale(locale);

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
          dateFormat={DEFAULT_MOMENT_DATE_FORMAT_SPEC}
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
          dateFormat={DEFAULT_MOMENT_DATE_FORMAT_SPEC}
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

export default DateRangePicker;
