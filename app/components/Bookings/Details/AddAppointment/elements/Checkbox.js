import React from 'react'
import PropTypes from 'prop-types'
import GovUkCheckbox from '@govuk-react/checkbox'

import { metaType } from '../../../../../types'

const Checkbox = ({ input, meta, children }) => (
  <GovUkCheckbox {...input} meta={meta} mb={6}>
    {children}
  </GovUkCheckbox>
)
Checkbox.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  }).isRequired,
  meta: metaType.isRequired,
  children: PropTypes.node.isRequired,
}

export default Checkbox
