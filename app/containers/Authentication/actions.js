/*
 *
 * Authentication actions
 *
 */

import { CHANGE_USERNAME_INPUT, CHANGE_PASSWORD_INPUT, USER_ME, RETRIEVE_USER_ME } from './constants'

export function retrieveUserMe() {
  return {
    type: RETRIEVE_USER_ME,
  }
}

export function userMe(payload) {
  return {
    type: USER_ME,
    payload,
  }
}

export function changeUsernameInput(username) {
  return {
    type: CHANGE_USERNAME_INPUT,
    username,
  }
}

export function changePasswordInput(password) {
  return {
    type: CHANGE_PASSWORD_INPUT,
    password,
  }
}
