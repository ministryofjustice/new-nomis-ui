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
    isLicenceUser: false,
    isPomAllocUser: false,
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

const PECS_ROLES = ['PECS_OCA', 'PECS_PRISON']

const PATHFINDER_ROLES = [
  'PF_STD_PRISON',
  'PF_STD_PROBATION',
  'PF_APPROVAL',
  'PF_NATIONAL_READER',
  'PF_LOCAL_READER',
  'PF_POLICE',
  'PF_HQ',
  'PF_PSYCHOLOGIST',
]

const ADMIN_ROLES = [
  'MAINTAIN_ACCESS_ROLES',
  'MAINTAIN_ACCESS_ROLES_ADMIN',
  'MAINTAIN_OAUTH_USERS',
  'AUTH_GROUP_MANAGER',
]

const LICENCE_ROLES = ['NOMIS_BATCHLOAD', 'LICENCE_CA', 'LICENCE_DM', 'LICENCE_RO', 'LICENCE_VARY', 'LICENCE_READONLY']

const SOC_ROLES = ['SOC_CUSTODY', 'SOC_COMMUNITY']

function authenticationReducer(state = initialState, action) {
  switch (action.type) {
    case USER_ME: {
      const { user } = action.payload

      window.currentCaseLoadId = user.activeCaseLoadId

      const hasRoleIn = roles => Boolean(user.accessRoles && user.accessRoles.some(r => roles.includes(r.roleCode)))

      const isKeyWorker = Boolean(user.staffRoles && user.staffRoles.some(r => r.role === 'KW'))

      return state.set('user', {
        hasAdminRights: hasRoleIn(ADMIN_ROLES),
        isKeyWorkerAdmin: hasRoleIn(['OMIC_ADMIN', 'KEYWORKER_MONITOR']),
        isKeyWorker,
        canGlobalSearch: hasRoleIn(['GLOBAL_SEARCH']),
        canAddBulkAppointments: hasRoleIn(['BULK_APPOINTMENTS']),
        ...action.payload.user,
        isCatToolUser: hasRoleIn(CAT_ROLES),
        canUpdateAlerts: hasRoleIn(['UPDATE_ALERT']),
        canViewProbationDocuments: hasRoleIn(['VIEW_PROBATION_DOCUMENTS', 'POM']),
        isPathfinderUser: hasRoleIn(PATHFINDER_ROLES),
        isLicenceUser: hasRoleIn(LICENCE_ROLES),
        isPecsUser: hasRoleIn(PECS_ROLES),
        isPomAllocUser: hasRoleIn(['ALLOC_MGR', 'ALLOC_CASE_MGR']),
        isPrisonUser: hasRoleIn(['PRISON']),
        isSocUser: hasRoleIn(SOC_ROLES),
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
