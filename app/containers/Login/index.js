import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { createFormAction } from 'redux-form-saga';


import TitleBlock from 'components/TitleBlock';
import translations from './translations';

import { LOGIN_SUCCESS, LOGIN_ERROR } from '../Authentication/constants';

import { logIn } from '../Authentication/actions';
import { selectLoggedIn, selectUser, selectUsername, selectPassword } from '../Authentication/selectors';
import LoginForm from './loginForm';
import "./login.scss";

import Footer from 'containers/Footer';

class Login extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    onSubmitForm: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div>
          <div className="header">
            <TitleBlock title={<FormattedMessage {...translations.title} />} subtitle={<FormattedMessage {...translations.subtitle} />} />
          </div>

          <LoginForm onSubmit={this.props.onSubmitForm}/>

          <Footer  />
      </div>
    );
  }
}

export function mapDispatchToProps() {
  return {
    onSubmitForm: createFormAction(logIn, [LOGIN_SUCCESS, LOGIN_ERROR]),
  };
}

const mapStateToProps = createStructuredSelector({
  user: selectUser(),
  loggedIn: selectLoggedIn(),
  username: selectUsername(),
  password: selectPassword(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Login));
