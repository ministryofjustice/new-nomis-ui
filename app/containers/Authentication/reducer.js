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
  USER,
} from 'containers/EliteApiLoader/constants';

import {
  CHANGE_USERNAME_INPUT,
  CHANGE_PASSWORD_INPUT,
  USER_ME,
} from './constants';


export const initialState = fromJS({
  user: null,
  usernameInput: '',
  passwordInput: '',
});

function authenticationReducer(state = initialState, action) {
  switch (action.type) {
    case USER_ME: {
      return state
        .set('user', { ...action.payload.user })
    }

    case CHANGE_USERNAME_INPUT: {
      return state
        .set('usernameInput', action.username);
    }
    case CHANGE_PASSWORD_INPUT: {
      return state
        .set('passwordInput', action.password);
    }
    case USER.SWITCHCASELOAD.SUCCESS: {
      return state.update('user', (userState) => ({ ...userState, activeCaseLoadId: action.payload.caseLoadId }));
    }
    default: {
      return state;
    }
  }
}

export default authenticationReducer;
