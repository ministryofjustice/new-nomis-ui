import React from 'react';
import PropTypes from 'prop-types';
import { SelectStyle } from './select.theme';
import { InputGroup, InputLabel, InputError } from '../Input/input.theme';

const SubSelect = (props) => {
  const { input, options, title, meta: { touched, error } } = props;
  console.log(input);
  return (
    <InputGroup error={touched && error}>
      <InputLabel>{title}</InputLabel>
      <InputError error={touched && error}>{error}</InputError>
      <SelectStyle {...input} >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label || opt.value}</option>
        ))}
      </SelectStyle>
    </InputGroup>
  );
};

SubSelect.propTypes = {
  input: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  meta: PropTypes.object.isRequired,
  title: PropTypes.string,
};

SubSelect.defaultProps = {
  title: '',
};

export default SubSelect;
