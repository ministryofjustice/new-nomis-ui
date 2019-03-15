import React from 'react'
import PropTypes from 'prop-types'
import { Container, Notification } from './NotificationBar.styles'
import Dismiss from './Dismiss'

const NotificationBar = ({ type, children, onDismiss }) => (
  <Container type={type}>
    <Notification>{children}</Notification>
    <Dismiss onClick={onDismiss}>Dismiss</Dismiss>
  </Container>
)

NotificationBar.propTypes = {
  type: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default NotificationBar
