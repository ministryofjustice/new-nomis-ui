import React from 'react'
import PropTypes from 'prop-types'
import { DismissBox, SlashLeft, SlashRight } from './Dismiss.styles'

const Dismiss = ({ onClick }) => (
  <DismissBox onClick={onClick}>
    <SlashLeft />
    <SlashRight />
  </DismissBox>
)

Dismiss.propTypes = {
  onClick: PropTypes.func,
}

Dismiss.defaultProps = {
  onClick: undefined,
}

export default Dismiss
