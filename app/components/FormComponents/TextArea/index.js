import React from 'react'
import PropTypes from 'prop-types'
import { inputType, metaType } from '../types'

const TextArea = ({ input, title, meta: { touched, error }, placeholder }) => (
  <div className={!(touched && error) ? 'form-group' : 'form-group form-group-error'}>
    <label htmlFor={input.name} className="form-label">
      {title}
    </label>
    {error && touched && <div className="error-message">{error}</div>}
    <textarea
      id={input.name}
      className={!(touched && error) ? 'form-control' : 'form-control form-control-error'}
      {...input}
      autoComplete="off"
      placeholder={placeholder}
      cols="30"
      rows="10"
    />
  </div>
)

TextArea.propTypes = {
  input: inputType.isRequired,
  title: PropTypes.string,
  meta: metaType.isRequired,
  placeholder: PropTypes.string,
}

TextArea.defaultProps = {
  title: '',
  placeholder: '',
}

export default TextArea
