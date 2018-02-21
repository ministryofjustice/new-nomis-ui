import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setFeedbackUrl } from 'globalReducers/app';

import './index.scss';

export const FeedbackLink = ({ user, feedbackUrl, requestFeedbackUrl, openWindow }) => {
  if (user && !feedbackUrl) {
    requestFeedbackUrl();
  }

  return (user && feedbackUrl &&
    <div className="feedback-link">
      <div className="container">
        <div className="main-content">
            <span> Your <a
              href="#" onClick={(e) => {
                if (e && e.preventDefault) {
                  e.preventDefault();
                }
                openWindow(feedbackUrl);
              }}
            > feedback </a> will to help us improve this service. </span>
        </div>
      </div>
    </div>) || <div></div>;
}

class FeedbackLinkContainer extends React.Component {

  constructor() {
    super();
    this.requestFeedbackUrl = this.requestFeedbackUrl.bind(this);
    this.openWindow = this.openWindow.bind(this);
  }

  requestFeedbackUrl() {
    axios.get('/feedbackUrl').then(response => {
      this.props.setFeedbackUrl(response.data.url);
    });
  }

  openWindow(url) {
    if (window) {
      window.open(url);
    }
  }

  render() {
    return (<FeedbackLink
      requestFeedbackUrl={this.requestFeedbackUrl}
      openWindow={this.openWindow}
      user={this.props.user}
      feedbackUrl={this.props.feedbackUrl}
    />)
  }
}

const mapStateToProps = (imState) => {
  const state = imState.toJS();

  return ({
    user: state.authentication.user,
    feedbackUrl: state.app.feedbackUrl,
  });
};

const mapDispatchToProps = (dispatch) => ({
  setFeedbackUrl: (url) => dispatch(setFeedbackUrl(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackLinkContainer);