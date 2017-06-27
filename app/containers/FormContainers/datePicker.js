import React from 'react';
import PropTypes from 'prop-types';
import DP from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import { InputLabel, InputGroup, Base } from 'components/FormComponents/Input/input.theme';
import styled from 'styled-components';

const DatePicker = styled(DP)`
  ${Base}
`;

// stolen from https://github.com/Hacker0x01/react-datepicker/issues/543

class renderDatePicker extends React.Component {
  static propTypes = {
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
    placeholder: '',
    title: '',
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.props.input.onChange(moment(date).format('YYYY-MM-DD'));
  }

  render() {
    const {
      input, placeholder,
      meta: { touched, error },
      title,
    } = this.props;

    return (
      <InputGroup>
        <InputLabel>{title}</InputLabel>
        <DatePicker
          {...input}
          placeholder={placeholder}
          dateFormat="YYYY-MM-DD"
          selected={input.value ? moment(input.value, 'YYYY-MM-DD') : null}
          onChange={this.handleChange}
        />
        {touched && error && <span>{error}</span>}
      </InputGroup>
    );
  }
}

export default renderDatePicker;
