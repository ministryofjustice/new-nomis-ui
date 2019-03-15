import React, { Component } from 'react'
import moment from 'moment'
import getTheNotification from './notificationSource'
import dismissState from './dismissState'
import NotificationBar from './NotificationBar'
import RichText from './RichText'

export default class NotificationBarContainer extends Component {
  constructor(props) {
    super(props)
    this.dismissState = dismissState() // Ugly, but needed for testing.
    this.dismissed = this.dismissed.bind(this)
    this.state = {}
  }

  componentDidMount() {
    this.initialise()
  }

  async initialise() {
    const n = await getTheNotification()
    this.retrieved(n)
  }

  retrieved(notification) {
    if (!notification) return

    const { body, expiryTime } = notification

    if (!body) return
    if (moment().isAfter(expiryTime)) return
    if (this.dismissState.alreadyDismissed(notification)) return

    this.setState({ notification })
  }

  dismissed() {
    const { notification } = this.state
    this.dismissState.rememberDismissed(notification)
    this.setState({ notification: undefined })
  }

  render() {
    const { notification } = this.state
    if (!notification) return null
    const { body, type } = notification

    return (
      <NotificationBar type={type} onDismiss={this.dismissed}>
        <RichText content={body} />
      </NotificationBar>
    )
  }
}
