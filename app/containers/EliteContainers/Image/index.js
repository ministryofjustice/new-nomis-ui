import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { BREAKPOINTS } from '@govuk-react/constants'

const StyledImage = styled.img`
  max-width: ${props => (props.listView ? '70px' : '100%')};

  @media print, (min-width: ${BREAKPOINTS.DESKTOP}) {
    max-width: ${props => (props.listView ? '90px' : '100%')};
  }
`

const EliteImage = ({ src, listView, ...props }) => <StyledImage src={src} listView={listView} {...props} />

EliteImage.propTypes = {
  src: PropTypes.string.isRequired,
  listView: PropTypes.bool,
}

EliteImage.defaultProps = {
  listView: false,
}

export default EliteImage
