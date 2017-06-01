import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, Input, InputLabel, InputError } from './input.theme';

const renderInput = ({ input, title, type, meta: { touched, error } }) => (<InputGroup error={touched && error}>
  <InputLabel>{title}</InputLabel>
  <InputError error={touched && error}>{error}</InputError>
  <Input {...input} error={touched && error} type={type} />
</InputGroup>);

renderInput.propTypes = {
  input: PropTypes.object.isRequired,
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  // error: PropTypes.string.isRequired,
};

renderInput.defaultProps = {
  title: '',
};

export default renderInput;
