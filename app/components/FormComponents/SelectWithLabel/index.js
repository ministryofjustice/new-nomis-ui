import React from 'react'
import PropTypes from 'prop-types'
import { inputType, metaType } from '../../../types'

const SelectWithLabel = ({ resetValue, options, input, title, meta: { touched, error } }) => {
  if (resetValue === true) {
    setTimeout(() => input.onChange(null), 100)
  }

  return (
    <div className={!(touched && error) ? 'form-group' : 'form-group form-group-error'}>
      <label htmlFor={input.name} className="form-label">
        {title}
      </label>

      <div className="error-message">{touched && (error && <span>{error}</span>)}</div>

      <select
        id={input.name}
        className={!(touched && error) ? 'form-control' : 'form-control form-control-error'}
        {...input}
      >
        <option value="" disabled hidden>
          Select
        </option>

        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

SelectWithLabel.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
    }).isRequired
  ).isRequired,
  resetValue: PropTypes.bool,
  input: inputType.isRequired,
  meta: metaType.isRequired,
  title: PropTypes.string.isRequired,
}

SelectWithLabel.defaultProps = {
  resetValue: false,
}

export default SelectWithLabel
