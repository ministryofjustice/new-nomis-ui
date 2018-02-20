import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectUser } from '../Authentication/selectors';

import './index.scss';


class FeedbackLink extends React.Component {
  componentWillReceiveProps(props) {
    if (!props.user) { return; }

    if (this.state && this.state.url) { return; }

    axios.get('/feedbackUrl').then(response => {
      this.setState(response.data);
    });
  }

  render() {
    return (this.props.user && this.state && this.state.url &&
      <div className="feedback-link">
        <div className="container">
          <div className="main-content">
            <span> Your <a
              href="#" onClick={(e) => {
                e.preventDefault();
                if (window) {
                  window.open(this.state.url);
                }
              }}
            > feedback </a> will to help us improve this service. </span>
          </div>
        </div>
      </div>) || <div></div>;
  }
}

const mapStateToProps = createStructuredSelector({
  user: selectUser(),
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackLink);