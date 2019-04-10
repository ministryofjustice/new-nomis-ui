import React from 'react'
import GovUKSelect from '@govuk-react/select'
import PropTypes from 'prop-types'

import { inputType } from '../../../types'

const Select = ({ children, input, resetValue, ...props }) => {
  if (resetValue === true) setTimeout(() => input.onChange(null), 100)

  return (
    <GovUKSelect input={input} {...props} mb={6}>
      <option value="" disabled hidden>
        Select
      </option>
      {children}
    </GovUKSelect>
  )
}

Select.propTypes = {
  children: PropTypes.node,
  input: inputType.isRequired,
  resetValue: PropTypes.bool,
}

Select.defaultProps = {
  children: undefined,
  resetValue: false,
}

export default Select
