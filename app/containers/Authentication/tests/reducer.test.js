import { Map } from 'immutable'
import authenticationReducer from '../reducer'
import { userMe } from '../actions'

describe('Authentication reducer', () => {
  const userData = {
    staffId: -2,
    username: 'api',
    firstName: 'john',
    lastName: 'doe',
    activeCaseLoadId: 'LEI',
    accessRoles: [],
    staffRoles: [],
  }

  it('should return state with a user as a key worker', () => {
    const user = {
      ...userData,
      staffRoles: [{ role: 'KW', roleDescription: 'Key Worker' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.isKeyWorker).toBe(true)
  })
  it('should return state with a user having the Recategoriser role', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'CREATE_RECATEGORISATION', roleDescription: 'Recategoriser' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.isRecategoriser).toBe(true)
  })
  it('should return state with a user as a key worker admin', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'OMIC_ADMIN', roleDescription: 'Key Worker Admin' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.isKeyWorkerAdmin).toBe(true)
  })
  it('should return state with a user as a custodial manager', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'KEYWORKER_MONITOR', roleDescription: 'Keyworker Monitor' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.isKeyWorkerAdmin).toBe(true)
  })
  it('should handle situations where accessRoles and staffRoles are undefined', () => {
    const user = {
      ...userData,
      accessRoles: undefined,
      staffRoles: undefined,
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.isKeyWorkerAdmin).toBe(false)
    expect(userState.isKeyWorker).toBe(false)
    expect(userState.isRecategoriser).toBe(false)
  })

  it('should return a user with global search access', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'GLOBAL_SEARCH', roleDescription: 'Global search' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.canGlobalSearch).toBe(true)
  })

  it('should return a user with admin rights if they have KW_MIGRATION role', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'KW_MIGRATION', roleDescription: 'Key worker migration' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.hasAdminRights).toBe(true)
  })

  it('should return a user with admin rights if they have MAINTAIN_ACCESS_ROLES role', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'MAINTAIN_ACCESS_ROLES', roleDescription: 'Maintain access roles' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.hasAdminRights).toBe(true)
  })

  it('should return a user with admin rights if they have MAINTAIN_ACCESS_ROLES_ADMIN role', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'MAINTAIN_ACCESS_ROLES_ADMIN', roleDescription: 'Maintain access roles admin' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.hasAdminRights).toBe(true)
  })
})
