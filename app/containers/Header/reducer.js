/*
 *
 * Header reducer
 *
 * Controls what is shown in the header.
 *
 */

import { fromJS } from 'immutable';
import {

} from './constants';

const initialState = fromJS({
  logo: true,
  logoText: 'HMPPS',
  title: 'Prison-NOMIS',
  search: true,
  userMenu: true,
});

function headerReducer(state = initialState, action) {
  switch (action.type) {
    // case LOGIN_SUCCESS: {
    //   const username = state.get('usernameInput');
    //   return state
    //     .set('user', { username, ...action.userObj })
    //     .set('loggedIn', true)
    //     .set('lastLogin', Date().toString())
    //     .set('passwordInput', '')
    //     .set('usernameInput', '');
    // }
    // case LOGOUT_SUCCESS: {
    //   return state
    //     .set('user', null)
    //     .set('loggedIn', false);
    // }
    // case CHANGE_USERNAME_INPUT: {
    //   return state
    //     .set('usernameInput', action.username);
    // }
    // case CHANGE_PASSWORD_INPUT: {
    //   return state
    //     .set('passwordInput', action.password);
    // }
    default: {
      return state;
    }
  }
}

export default headerReducer;
