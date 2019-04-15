import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BORDER_COLOUR } from 'govuk-colours'
import { spacing } from '@govuk-react/lib'

const Container = styled.div`
  display: flex;
  ${spacing.withWhiteSpace({ marginBottom: 3 })};
  border-bottom: 1px solid ${BORDER_COLOUR};
`

const Item = styled.div`
  flex: 1 50%;
`

const ValueWithLabel = ({ label, children }) => (
  <Container>
    <Item>{label}</Item>
    <Item>
      <strong>{children}</strong>
    </Item>
  </Container>
)

ValueWithLabel.propTypes = {
  label: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node, PropTypes.object]),
}

ValueWithLabel.defaultProps = {
  label: '',
  children: '--',
}

export default ValueWithLabel
