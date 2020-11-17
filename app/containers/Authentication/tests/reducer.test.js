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

  it.each`
    role                             | description                          | flag                           | hasAccess
    ${'CREATE_RECATEGORISATION'}     | ${'Recategoriser'}                   | ${'isCatToolUser'}             | ${true}
    ${'OMIC_ADMIN'}                  | ${'Key Worker Admin'}                | ${'isKeyWorkerAdmin'}          | ${true}
    ${'KEYWORKER_MONITOR'}           | ${'Keyworker Monitor'}               | ${'isKeyWorkerAdmin'}          | ${true}
    ${'PECS_OCA'}                    | ${'PECS O.C.A Officer'}              | ${'isPecsUser'}                | ${true}
    ${'PECS_PRISON'}                 | ${'PECS Prison Officer'}             | ${'isPecsUser'}                | ${true}
    ${'GLOBAL_SEARCH'}               | ${'Global search'}                   | ${'canGlobalSearch'}           | ${true}
    ${'MAINTAIN_ACCESS_ROLES'}       | ${'Maintain access roles'}           | ${'hasAdminRights'}            | ${true}
    ${'MAINTAIN_ACCESS_ROLES_ADMIN'} | ${'Maintain access roles admin'}     | ${'hasAdminRights'}            | ${true}
    ${'MAINTAIN_OAUTH_USERS'}        | ${'Maintain access roles'}           | ${'hasAdminRights'}            | ${true}
    ${'AUTH_GROUP_MANAGER'}          | ${'Maintain access roles'}           | ${'hasAdminRights'}            | ${true}
    ${'VIEW_PROBATION_DOCUMENTS'}    | ${'View probation documents'}        | ${'canViewProbationDocuments'} | ${true}
    ${'POM'}                         | ${'View probation documents'}        | ${'canViewProbationDocuments'} | ${true}
    ${'SOME_OTHER_ROLE'}             | ${'Cannot view probation documents'} | ${'canViewProbationDocuments'} | ${false}
    ${'PRISON'}                      | ${'View probation documents'}        | ${'isPrisonUser'}              | ${true}
    ${'LICENCE_CA'}                  | ${'Licence Case Admin'}              | ${'isLicenceUser'}             | ${true}
    ${'LICENCE_DM'}                  | ${'Licence Decision Maker'}          | ${'isLicenceUser'}             | ${true}
    ${'LICENCE_VARY'}                | ${'Vary Licence role'}               | ${'isLicenceUser'}             | ${true}
    ${'NOMIS_BATCHLOAD'}             | ${'Licence Administrator'}           | ${'isLicenceUser'}             | ${true}
    ${'LICENCE_READONLY'}            | ${'Read-only Licence Access'}        | ${'isLicenceUser'}             | ${true}
    ${'NOT_A_LICENCE_ROLE'}          | ${'Not a licence role'}              | ${'isLicenceUser'}             | ${false}
    ${'PF_PSYCHOLOGIST'}             | ${'Pathfinder Psychologist'}         | ${'isPathfinderUser'}          | ${true}
    ${'PF_STD_PRISON'}               | ${'Pathfinder standard prison'}      | ${'isPathfinderUser'}          | ${true}
    ${'ANOTHER_ROLE'}                | ${'Not pathfinder'}                  | ${'isPathfinderUser'}          | ${false}
    ${'ALLOC_MGR'}                   | ${'POM Allocation Manager'}          | ${'isPomAllocUser'}            | ${true}
    ${'PF_STD_PROBATION'}            | ${'Pathfinder standard probation'}   | ${'isPathfinderUser'}          | ${true}
    ${'OTHER'}                       | ${'Some'}                            | ${'isPathfinderUser'}          | ${false}
    ${'SOC_CUSTODY'}                 | ${'SOC Prison Role'}                 | ${'isSocUser'}                 | ${true}
    ${'SOC_COMMUNITY'}               | ${'SOC Probation Role'}              | ${'isSocUser'}                 | ${true}
    ${'NOT_A_SOC_ROLE'}              | ${'Not a SOC Role'}                  | ${'isSocUser'}                 | ${false}
  `('For role $role - $description, $flag should be $hasAccess', ({ role, description, flag, hasAccess }) => {
    const user = {
      ...userData,
      accessRoles: [{ roleCode: role, roleDescription: description }],
    }
    const state = authenticationReducer(Map({}), userMe({ user }))
    const userState = state.get('user')

    expect(userState[flag]).toBe(hasAccess)
  })
})
