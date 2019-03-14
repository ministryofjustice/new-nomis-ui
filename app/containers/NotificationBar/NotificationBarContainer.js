import React, { Component } from 'react'
import moment from 'moment'
import getTheNotification from './notificationSource'
import { alreadyDismissed, rememberDismissed } from './revisionState'
import NotificationBar from './NotificationBar'
import RichText from './RichText'

export default class NotificationBarContainer extends Component {
  constructor(props) {
    super(props)
    this.dismissed = this.dismissed.bind(this)
    this.state = {}
  }

  componentDidMount() {
    this.initialise()
  }

  async initialise() {
    this.retrieved(await getTheNotification())
  }

  retrieved(notification) {
    if (!notification) return

    const { body, expiryTime } = notification

    if (!body) return
    if (moment().isAfter(expiryTime)) return
    if (alreadyDismissed(notification)) return

    this.setState({ notification })
  }

  dismissed() {
    const { notification } = this.state
    rememberDismissed(notification)
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
