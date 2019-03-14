import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import LabelText from '@govuk-react/label-text'
import { SelectInput } from '@govuk-react/select'
import { SPACING } from '@govuk-react/constants'

const DropdownContainer = styled.div`
  margin-left: ${SPACING.SCALE_3};

  span {
    font-weight: 700;
  }
`

const PerPageDropdown = ({ handleChange, totalResults, perPage }) => (
  <DropdownContainer>
    <label htmlFor="perPage">
      <LabelText>Results per page</LabelText>
    </label>
    <SelectInput id="perPage" onChange={event => handleChange(event.target.value)} value={perPage}>
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
      <option value="100">100</option>
      <option value={totalResults}>All</option>
    </SelectInput>
  </DropdownContainer>
)

PerPageDropdown.propTypes = {
  handleChange: PropTypes.func.isRequired,
  totalResults: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
}

export default PerPageDropdown
