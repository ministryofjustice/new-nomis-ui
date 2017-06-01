/*
 *
 * Authentication actions
 *
 */

import {
  LOGIN,
  LOGOUT,
  CHANGE_USERNAME_INPUT,
  CHANGE_PASSWORD_INPUT,
} from './constants';

export function logIn(payload) {
  return {
    type: LOGIN,
    payload,
  };
}

export function logOut() {
  return {
    type: LOGOUT,
  };
}

export function changeUsernameInput(username) {
  return {
    type: CHANGE_USERNAME_INPUT,
    username,
  };
}

export function changePasswordInput(password) {
  return {
    type: CHANGE_PASSWORD_INPUT,
    password,
  };
}
