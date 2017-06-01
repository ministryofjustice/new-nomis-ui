import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// import translations from './translations';
import Header from '../../../components/Header';

// import { SEARCH, SEARCH_SUCCESS, SEARCH_ERROR } from './constants';

import {
  Wrapper,
  // Heading,
  // Form,
  // Input,
  // Button,
  // Label,
} from './details.theme';

// import { search } from './actions';

class Login extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    onSubmitForm: PropTypes.func.isRequired,
  }

  render() {
    return (
      <Wrapper>
        <Header>
          <div></div>
          <div>Details</div>
          <div></div>
        </Header>

      </Wrapper>
    );
  }
}

export function mapDispatchToProps() {
  return {
  };
}

const mapStateToProps = createStructuredSelector({
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Login);
