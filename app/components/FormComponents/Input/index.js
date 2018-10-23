import React from 'react'
import PropTypes from 'prop-types'
import { InputGroup, Input, InputLabel, InputError } from './input.theme'

const renderInput = ({ input, title, type, meta: { touched, error }, placeholder }) => (
  <InputGroup error={touched && error}>
    <InputLabel>{title}</InputLabel>
    <InputError error={touched && error}>{error}</InputError>
    <Input {...input} error={touched && error} type={type} autoComplete="off" placeholder={placeholder} />
  </InputGroup>
)

renderInput.propTypes = {
  input: PropTypes.object.isRequired,
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
}

renderInput.defaultProps = {
  title: '',
  placeholder: '',
}

export default renderInput
