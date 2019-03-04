import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledImage = styled.img`
  max-width: ${props => (props.listView ? '90px' : '100%')};
`

const EliteImage = ({ src, listView }) => <StyledImage src={src} listView={listView} />

EliteImage.propTypes = {
  src: PropTypes.string.isRequired,
  listView: PropTypes.bool,
}

EliteImage.defaultProps = {
  listView: false,
}

export default EliteImage
