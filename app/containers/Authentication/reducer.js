/*
 *
 * Authentication reducer
 *
 */

/*
 * TODO:
 *   Logout if not in use
 *   Complete proper authentication! use redux saga for log in messages...
 */

import { fromJS } from 'immutable';
import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  CHANGE_USERNAME_INPUT,
  CHANGE_PASSWORD_INPUT,
} from './constants';
// import { push } from 'react-router-redux';

const initialState = fromJS({
  user: null,
  loginData: null,
  loggedIn: false,
  lastLogin: null,
  usernameInput: '',
  passwordInput: '',
});

function authenticationReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return state
        .set('user', { ...action.payload.user })
        .set('loginData', action.payload.loginData)
        .set('loggedIn', true)
        .set('lastLogin', Date().toString());
    }
    case LOGOUT_SUCCESS: {
      return state
        .set('user', null)
        .set('loggedIn', false);
    }
    case CHANGE_USERNAME_INPUT: {
      return state
        .set('usernameInput', action.username);
    }
    case CHANGE_PASSWORD_INPUT: {
      return state
        .set('passwordInput', action.password);
    }
    default: {
      return state;
    }
  }
}

export default authenticationReducer;
