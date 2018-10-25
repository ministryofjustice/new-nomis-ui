import React from 'react'
import PropTypes from 'prop-types'

const renderTextArea = ({ input, title, meta: { touched, error }, placeholder }) => (
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

renderTextArea.propTypes = {
  input: PropTypes.shape({ name: PropTypes.string.isRequired, value: PropTypes.string }).isRequired,
  title: PropTypes.string,
  meta: PropTypes.shape({ touched: PropTypes.bool, error: PropTypes.string }).isRequired,
  placeholder: PropTypes.string,
}

renderTextArea.defaultProps = {
  title: '',
  placeholder: '',
}

export default renderTextArea
