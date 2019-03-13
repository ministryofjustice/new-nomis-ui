import React from 'react'
import PropTypes from 'prop-types'
import { DismissBox, SlashLeft, SlashRight } from './Dismiss.styles'

const Dismiss = ({ type, onClick }) => (
  <DismissBox onClick={onClick}>
    <SlashLeft type={type} />
    <SlashRight type={type} />
  </DismissBox>
)

Dismiss.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.string,
}

Dismiss.defaultProps = {
  onClick: undefined,
  type: 'Alert',
}

export default Dismiss
