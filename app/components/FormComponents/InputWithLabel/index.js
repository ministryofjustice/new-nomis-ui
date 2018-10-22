import React from 'react'
import PropTypes from 'prop-types'

const Input = props => (
  <div>
    <input className="form-control" {...props} />
  </div>
)

const renderField = ({ input, title, type, placeholder, meta: { touched, error } }) => (
  <div className={!(touched && error) ? 'form-group' : 'form-group form-group-error'}>
    <label className="form-label">{title}</label>
    <div className="error-message">{touched && (error && <span>{error}</span>)}</div>
    <Input
      className={!(touched && error) ? 'form-control' : 'form-control form-control-error'}
      {...input}
      type={type}
      placeholder={placeholder}
    />
  </div>
)

renderField.propTypes = {
  input: PropTypes.object.isRequired,
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
}

renderField.defaultProps = {
  title: '',
  placeholder: '',
}

export default renderField
