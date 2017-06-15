import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { createFormAction } from 'redux-form-saga';

import { CenteredFlexColumn } from 'components/DesktopWrappers';

import SearchForm from './SearchForm';

import { SEARCH, SEARCH_SUCCESS, SEARCH_ERROR } from '../constants';

class Login extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    onSubmitForm: PropTypes.func.isRequired,
  }

  render() {
    return (
      <CenteredFlexColumn>
        <SearchForm onSubmit={this.props.onSubmitForm} />
      </CenteredFlexColumn>
    );
  }
}

export function mapDispatchToProps() {
  return {
    onSubmitForm: createFormAction((formData) => ({ type: SEARCH, payload: { query: formData.toJS(), resetPagination: true } }), [SEARCH_SUCCESS, SEARCH_ERROR]), //onSubmitActions(SEARCH, SEARCH_SUCCESS, SEARCH_ERROR), // (x) => { console.log(x); }, //
  };
}

const mapStateToProps = createStructuredSelector({
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Login);
