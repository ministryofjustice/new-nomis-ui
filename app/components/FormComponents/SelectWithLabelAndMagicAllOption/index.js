import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inputType, metaType } from '../types'

class SelectWithLabelAndMagicAllOption extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAllOption: false,
    }
  }

  updateDefaulted() {
    const { showAllOption } = this.state
    const {
      input: { value },
    } = this.props
    this.state.showAllOption = showAllOption || (true && value)
  }

  render() {
    const {
      resetValue,
      options,
      input,
      title,
      meta: { touched, error },
    } = this.props

    this.updateDefaulted()

    const { showAllOption } = this.state

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
          {showAllOption ? (
            <option value="">— Show all —</option>
          ) : (
            <option value="" disabled hidden>
              Select
            </option>
          )}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    )
  }
}

SelectWithLabelAndMagicAllOption.propTypes = {
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

SelectWithLabelAndMagicAllOption.defaultProps = {
  resetValue: false,
}

export default SelectWithLabelAndMagicAllOption
