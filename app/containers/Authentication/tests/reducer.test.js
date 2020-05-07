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
  it('should return state with a user having a cat tool role', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'CREATE_RECATEGORISATION', roleDescription: 'Recategoriser' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.isCatToolUser).toBe(true)
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
  it('should return state with a user having a pecs role if user has pecs o.c.a role', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'PECS_OCA', roleDescription: 'PECS O.C.A Officer' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.isPecsUser).toBe(true)
  })
  it('should return state with a user having a pecs role if user has pecs prisoner officer role', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'PECS_PRISON', roleDescription: 'PECS Prison Officer' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.isPecsUser).toBe(true)
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
    expect(userState.isCatToolUser).toBe(false)
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

  it('should return a user with admin rights if they have MAINTAIN_OAUTH_USERS role', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'MAINTAIN_OAUTH_USERS', roleDescription: 'Maintain access roles' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.hasAdminRights).toBe(true)
  })

  it('should return a user with admin rights if they have AUTH_GROUP_MANAGER role', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'AUTH_GROUP_MANAGER', roleDescription: 'Maintain access roles' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.hasAdminRights).toBe(true)
  })

  it('should return a user that can view probation documents if they have VIEW_PROBATION_DOCUMENTS role', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'VIEW_PROBATION_DOCUMENTS', roleDescription: 'View probation documents' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.canViewProbationDocuments).toBe(true)
  })

  it('should return a user that can view probation documents if they have POM role', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'POM', roleDescription: 'View probation documents' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.canViewProbationDocuments).toBe(true)
  })

  it("should not return a user that can view probation documents if they don't VIEW_PROBATION_DOCUMENTS role", () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'SOME_OTHER_ROLE', roleDescription: 'A role' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.canViewProbationDocuments).toBe(false)
  })

  it('should return a user with access to Pathfinder links where a PF_STD_PRISON role is present', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'PF_STD_PRISON', roleDescription: 'Pathfinder standard prison' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.isPathfinderUser).toBe(true)
  })

  it('should return a user with access to Licences links where a LICENCE role is present', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'LICENCE_CA', roleDescription: 'Licence Case Admin' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.isLicenceUser).toBe(true)
  })

  it('should return a user with access to Pom Alloc link where a ALLOC_MGR role is present', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'ALLOC_MGR', roleDescription: 'POM Allocation Manager' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.isPomAllocUser).toBe(true)
  })

  it('should return a user with access to Pathfinder links where a PF_STD_PROBATION role is present', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'PF_STD_PROBATION', roleDescription: 'Pathfinder standard probation' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.isPathfinderUser).toBe(true)
  })

  it('should return a user that has no access to Pathfinder', () => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: 'ANOTHER_ROLE', roleDescription: 'Not pathfinder' }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState.isPathfinderUser).toBe(false)
  })
})
