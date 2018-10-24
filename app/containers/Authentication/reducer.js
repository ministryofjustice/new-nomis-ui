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

import { fromJS } from 'immutable'

import { USER } from 'containers/EliteApiLoader/constants'

import { CHANGE_USERNAME_INPUT, CHANGE_PASSWORD_INPUT, USER_ME } from './constants'

export const initialState = fromJS({
  user: null,
  usernameInput: '',
  passwordInput: '',
})

function authenticationReducer(state = initialState, action) {
  switch (action.type) {
    case USER_ME: {
      const { user } = action.payload

      window.currentCaseLoadId = user.activeCaseLoadId

      const isKeyWorkerAdmin = Boolean(
        user.accessRoles && user.accessRoles.filter(r => r.roleCode === 'OMIC_ADMIN').length > 0
      )

      const isKeyWorker = Boolean(user.staffRoles && user.staffRoles.filter(r => r.role === 'KW').length > 0)

      return state.set('user', {
        isKeyWorkerAdmin,
        isKeyWorker,
        ...action.payload.user,
      })
    }

    case CHANGE_USERNAME_INPUT: {
      return state.set('usernameInput', action.username)
    }
    case CHANGE_PASSWORD_INPUT: {
      return state.set('passwordInput', action.password)
    }
    case USER.SWITCHCASELOAD.SUCCESS: {
      return state.update('user', userState => ({ ...userState, activeCaseLoadId: action.payload }))
    }
    default: {
      return state
    }
  }
}

export default authenticationReducer
