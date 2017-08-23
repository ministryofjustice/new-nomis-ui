import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';
import { InputLabel, InputGroup, Base } from 'components/FormComponents/Input/input.theme';
import DP from 'react-datepicker';

const dateFormat = 'L';


const DatePicker = styled(DP)`
   height: 36px !important;   
`;
// stolen from https://github.com/Hacker0x01/react-datepicker/issues/543

const asMoment = (t) => t ? moment(t, dateFormat) : null;

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
  }

  static defaultProps = {
    locale: 'en',
    placeholder: '',
    title: '',
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.props.input.onChange(moment(date).format(dateFormat));
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

    return (
      <div className="date-picker">
        <label className="form-label">{title}</label>
        <DatePicker
          {...input}
          placeholder={placeholder}
          dateFormat={dateFormat}
          selected={input.value ? asMoment(input.value) : null}
          onChange={this.handleChange}
          className="form-control"
        />
        {touched && error && <span>{error}</span>}
      </div>
    );
  }
}

export default renderDatePicker;
