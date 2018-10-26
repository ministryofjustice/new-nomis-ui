import React from 'react'
import { connect } from 'react-redux'

import './index.scss'

export const FeedbackLink = ({ user, feedbackUrl, openWindow }) =>
  (user &&
    feedbackUrl && (
      <div className="feedback-link">
        <div className="container">
          <div className="main-content">
            <span>
              Your{' '}
              <a
                href="#"
                onClick={e => {
                  if (e && e.preventDefault) {
                    e.preventDefault()
                  }
                  openWindow(feedbackUrl)
                }}
              >
                {' '}
                feedback{' '}
              </a>{' '}
              will to help us improve this service.{' '}
            </span>
          </div>
        </div>
      </div>
    )) || <div />

class FeedbackLinkContainer extends React.Component {
  openWindow = url => {
    if (window) {
      window.open(url)
    }
  }

  render() {
    const { user, feedbackUrl } = this.props
    return <FeedbackLink openWindow={this.openWindow} user={user} feedbackUrl={feedbackUrl} />
  }
}

const mapStateToProps = imState => {
  const state = imState.toJS()

  return {
    user: state.authentication.user,
    feedbackUrl: state.app.feedbackUrl,
  }
}

export default connect(mapStateToProps)(FeedbackLinkContainer)
