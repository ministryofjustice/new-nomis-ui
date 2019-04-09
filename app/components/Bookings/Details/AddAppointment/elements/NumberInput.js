import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import InputField from '@govuk-react/input-field'

const StyledNumberInput = styled(InputField)`
  input {
    width: 50%;
  }
`

const NumberInput = ({ input, meta, children, hint }) => (
  <StyledNumberInput
    input={{
      ...input,
      type: 'number',
    }}
    meta={meta}
    hint={hint}
    mb={6}
  >
    {children}
  </StyledNumberInput>
)

NumberInput.propTypes = {
  hint: PropTypes.node,
  input: PropTypes.shape({
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    value: PropTypes.any,
  }),
  meta: PropTypes.shape({
    active: PropTypes.bool,
    dirty: PropTypes.bool,
    dirtySinceLastSubmit: PropTypes.bool,
    error: PropTypes.any,
    initial: PropTypes.any,
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    submitError: PropTypes.any,
    submitFailed: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    touched: PropTypes.bool,
    valid: PropTypes.bool,
    visited: PropTypes.bool,
  }),
  children: PropTypes.node.isRequired,
}

NumberInput.defaultProps = {
  hint: undefined,
  input: {},
  meta: {},
}

export default NumberInput
