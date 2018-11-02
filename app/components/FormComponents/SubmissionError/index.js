import React from 'react'
import PropTypes from 'prop-types'
import { inputType, metaType } from '../types'

export const InputError = () => <div />

const Input = props => (
  <div>
    <input className="form-control" {...props} />
  </div>
)

const FormGroup = ({ children }) => <div className="form-group">{children}</div>

FormGroup.propTypes = {
  children: PropTypes.element.isRequired,
}

const SubmissionError = ({ input, title, type, meta: { touched, error } }) => (
  <FormGroup error={touched && error}>
    <label>{title}</label>
    <InputError error={touched && error}>{error}</InputError>
    <Input {...input} type={type} />
  </FormGroup>
)

SubmissionError.propTypes = {
  input: inputType.isRequired,
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
  meta: metaType.isRequired,
}

SubmissionError.defaultProps = {
  title: '',
}

export default SubmissionError
