import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, TextArea, InputLabel, InputError } from '../Input/input.theme';

const renderTextArea = ({ input, title, type, meta: { touched, error }, placeholder }) => (<InputGroup error={touched && error}>
  <InputLabel>{title}</InputLabel>
  <InputError error={touched && error}>{error}</InputError>
  <TextArea {...input} error={touched && error} type={type} autoComplete="off" placeholder={placeholder} />
</InputGroup>);

renderTextArea.propTypes = {
  input: PropTypes.object.isRequired,
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
};

renderTextArea.defaultProps = {
  title: '',
  placeholder: '',
};

export default renderTextArea;
