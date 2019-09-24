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

import { Map } from 'immutable'

import { USER } from '../EliteApiLoader/constants'

import { CHANGE_USERNAME_INPUT, CHANGE_PASSWORD_INPUT, USER_ME } from './constants'

export const initialState = Map({
  user: {
    isKeyWorkerAdmin: false,
    isKeyWorker: false,
    isWhereabouts: false,
    hasAdminRights: false,
    canGlobalSearch: false,
    canAddBulkAppointments: false,
    isCatToolUser: false,
  },
  usernameInput: '',
  passwordInput: '',
})

const CAT_ROLES = [
  'CREATE_CATEGORISATION',
  'CREATE_RECATEGORISATION',
  'APPROVE_CATEGORISATION',
  'CATEGORISATION_SECURITY',
]

function authenticationReducer(state = initialState, action) {
  switch (action.type) {
    case USER_ME: {
      const { user } = action.payload

      window.currentCaseLoadId = user.activeCaseLoadId

      const isKeyWorkerAdmin = Boolean(
        user.accessRoles &&
          user.accessRoles.some(r => r.roleCode === 'OMIC_ADMIN' || r.roleCode === 'KEYWORKER_MONITOR')
      )
      const isCatToolUser = Boolean(user.accessRoles && user.accessRoles.some(r => CAT_ROLES.includes(r.roleCode)))

      const isKeyWorker = Boolean(user.staffRoles && user.staffRoles.some(r => r.role === 'KW'))

      const canGlobalSearch = Boolean(user.accessRoles && user.accessRoles.some(r => r.roleCode === 'GLOBAL_SEARCH'))

      const canAddBulkAppointments = Boolean(
        user.accessRoles && user.accessRoles.some(r => r.roleCode === 'BULK_APPOINTMENTS')
      )

      const hasAdminRights = Boolean(
        user.accessRoles &&
          user.accessRoles.some(
            r =>
              r.roleCode === 'KW_MIGRATION' ||
              r.roleCode === 'MAINTAIN_ACCESS_ROLES' ||
              r.roleCode === 'MAINTAIN_ACCESS_ROLES_ADMIN' ||
              r.roleCode === 'MAINTAIN_OAUTH_USERS' ||
              r.roleCode === 'AUTH_GROUP_MANAGER'
          )
      )

      const canUpdateAlerts = Boolean(user.accessRoles && user.accessRoles.some(r => r.roleCode === 'UPDATE_ALERT'))
      const canViewProbationDocuments = Boolean(
        user.accessRoles && user.accessRoles.some(r => r.roleCode === 'VIEW_PROBATION_DOCUMENTS')
      )

      return state.set('user', {
        hasAdminRights,
        isKeyWorkerAdmin,
        isKeyWorker,
        canGlobalSearch,
        canAddBulkAppointments,
        ...action.payload.user,
        isCatToolUser,
        canUpdateAlerts,
        canViewProbationDocuments,
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
