import React from 'react';
import PropTypes from 'prop-types';
import DP from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { InputLabel, InputGroup, Base } from 'components/FormComponents/Input/input.theme';
import styled from 'styled-components';

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

const makeNotImmutable = (obj) => obj && obj.toJS ? obj.toJS() : obj;

class renderDateRangePicker extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
      value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.array.isRequired]),
    }).isRequired,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.bool,
    }).isRequired,
    placeholder: PropTypes.string,
    title: PropTypes.string,
  }

  static defaultProps = {
    placeholder: '',
    title: '',
  }

  constructor(props) {
    super(props);
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
  }

  handleChangeStart(date) {
    if (date === null) {
      this.props.input.onChange([null, null]);
      return;
    }
    const vals = makeNotImmutable(this.props.input.value);
    const startDateString = moment(date).format(dateFormat);
    // console.log('changeStart', vals, date);
    if (!vals[1] || moment(vals[1], dateFormat).isBefore(moment(date))) {
      this.props.input.onChange([startDateString, startDateString]); // `${moment(date).format('YYYY-MM-DD')}%%%${vals[1]}`);
    } else {
      this.props.input.onChange([startDateString, vals[1]]); // `${moment(date).format('YYYY-MM-DD')}%%%${vals[1]}`);
    }
  }

  handleChangeEnd(date) {
    if (date === null) {
      this.props.input.onChange([null, null]);
      return;
    }
    const vals = makeNotImmutable(this.props.input.value);
    const endDateString = moment(date).format(dateFormat);
    // console.log('changeEnd', vals);
    if (!vals[0] || moment(vals[0], dateFormat).isAfter(moment(date))) {
      this.props.input.onChange([endDateString, endDateString]); // `${moment(date).format('YYYY-MM-DD')}%%%${vals[1]}`);
    } else {
      this.props.input.onChange([vals[0], endDateString]); // `${moment(date).format('YYYY-MM-DD')}%%%${vals[1]}`);
    }
  }

  render() {
    const {
      input, placeholder,
      meta: { touched, error },
      title,
    } = this.props;
    const val = makeNotImmutable(input.value);
    const vals = val !== '' ? val : [null, null]; // val.split('%%%').map((x) => x && x !== '' ? moment(x, 'YYYY-MM-DD') : null) : [null, null];
    const momentVals = vals.map((x) => x && x !== '' ? moment(x, dateFormat) : null);
    // console.log(vals);
    // console.log(momentVals);
    return (
      <DatePickerInputGroup>
        <InputLabel>{title}</InputLabel>
        <DatePicker
          selectsStart
          startDate={momentVals[0]}
          endDate={momentVals[1]}
          placeholder={placeholder}
          dateFormat={dateFormat}
          selected={momentVals[0]}
          onChange={this.handleChangeStart}
          onFocus={() => input.onFocus()}
          onBlur={() => input.onBlur()}
        />
        <DatePicker
          selectsEnd
          startDate={momentVals[0]}
          endDate={momentVals[1]}
          placeholder={placeholder}
          dateFormat={dateFormat}
          selected={momentVals[1]}
          onChange={this.handleChangeEnd}
          onFocus={() => input.onFocus()}
          onBlur={() => input.onBlur()}
        />
        {touched && error && <span>{error}</span>}
      </DatePickerInputGroup>
    );
  }
}

export default renderDateRangePicker;
