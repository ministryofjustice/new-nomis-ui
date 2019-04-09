import GovUKSelect from '@govuk-react/select'
import PropTypes from 'prop-types'

import React from 'react'

const Select = ({ children, ...props }) => (
  <GovUKSelect {...props}>
    <option value="" disabled hidden>
      Select
    </option>
    {children}
  </GovUKSelect>
)

Select.propTypes = {
  children: PropTypes.node,
}

Select.defaultProps = {
  children: undefined,
}

export default Select
