import React, { Component } from 'react'
import { instanceOf } from 'prop-types'
import { Cookies } from 'react-cookie'
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import moment from 'moment'
import getContent from './notificationBarContent'
import { Container, Notification, Paragraph } from './NotificationBar.styles'
import Dismiss from './Dismiss'

const COOKIE_NAME = 'new-nomis-ui-notification-bar'

const options = {
  renderMark: {
    [MARKS.BOLD]: text => <strong>{text}</strong>,
    [MARKS.ITALIC]: text => <em>{text}</em>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Paragraph>{children}</Paragraph>,
    [INLINES.HYPERLINK]: (node, children) => (
      // Update to @govuk-react/link when out of Alpha
      <a className="link" href={node.data.uri}>
        {children}
      </a>
    ),
  },
}

export default class NotificationBar extends Component {
  constructor(props) {
    super(props)
    this.dismiss = this.dismiss.bind(this)
    this.state = {}
  }

  componentDidMount() {
    this.fetchContent()
  }

  dismissed(revision) {
    const { cookies } = this.props
    const lastRevision = cookies.get(COOKIE_NAME)
    return lastRevision && lastRevision >= revision
  }

  async fetchContent() {
    const content = await getContent()

    if (!content) return

    const { revision, body, type, expiryTime } = content

    if (!body) return
    if (moment().isAfter(expiryTime)) return
    if (this.dismissed(revision)) return

    const bodyComponents = documentToReactComponents(body, options)
    this.setState({ bodyComponents, type, revision })
  }

  dismiss() {
    const { cookies } = this.props
    const { revision } = this.state
    cookies.set(COOKIE_NAME, revision)
    this.setState({ bodyComponents: undefined })
  }

  render() {
    const { bodyComponents, type } = this.state
    if (!bodyComponents) return null
    return (
      <Container type={type}>
        <Notification>{bodyComponents}</Notification>
        <Dismiss type={type} onClick={this.dismiss}>
          Dismiss
        </Dismiss>
      </Container>
    )
  }
}

NotificationBar.propTypes = {
  cookies: instanceOf(Cookies).isRequired,
}
