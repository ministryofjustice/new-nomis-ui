const { userServiceFactory } = require('./user')

describe('User service', () => {
  const details = {
    staffId: -2,
    username: 'ITAG_USER',
    firstName: 'API',
    lastName: 'User',
  }

  const accessRoles = [
    { roleId: -201, roleCode: 'OMIC_ADMIN', roleName: 'Omic Admin', caseloadId: 'NWEB' },
    { roleId: -100, roleCode: 'LICENCE_CA', roleName: 'Case Admin', caseloadId: 'NWEB' },
  ]

  const staffRoles = [{ role: 'KW', roleDescription: 'Key Worker' }]

  // The api will be stubbed so there's no need to provide a real client for it to use.
  const elite2Api = {}
  const oauthApi = {}
  const userService = userServiceFactory(elite2Api, oauthApi)

  beforeEach(() => {
    oauthApi.getMyInformation = jest.fn()
    oauthApi.getUserAccessRoles = jest.fn()
    elite2Api.getCaseLoads = jest.fn()
    elite2Api.put = jest.fn()
    elite2Api.getStaffRoles = jest.fn()
    elite2Api.getWhereaboutsConfig = jest.fn()

    oauthApi.getMyInformation.mockReturnValueOnce(details)
    oauthApi.getUserAccessRoles.mockReturnValueOnce(accessRoles)
    elite2Api.getStaffRoles.mockReturnValueOnce(staffRoles)
    elite2Api.getWhereaboutsConfig.mockReturnValueOnce({ enabled: true })
  })

  it('should call all expected elite2Api and oauthApi services with the correct params', async () => {
    const context = { hello: 'Hello!' }
    elite2Api.getCaseLoads.mockReturnValueOnce([{ caseLoadId: 'LEI', currentlyActive: true }, { caseLoadId: 'SECOND' }])
    await userService.me(context)

    expect(oauthApi.getMyInformation).toBeCalledWith(context)
    expect(oauthApi.getUserAccessRoles).toBeCalledWith(context)
    expect(elite2Api.getStaffRoles).toBeCalledWith(context, -2, 'LEI')
    expect(elite2Api.getWhereaboutsConfig).toBeCalledWith(context, 'LEI')
  })

  it('should set a caseload if no caseload is already set', async () => {
    const context = { hello: 'Hello!' }
    elite2Api.getCaseLoads.mockReturnValueOnce([{ caseLoadId: 'FIRST' }, { caseLoadId: 'SECOND' }])
    await userService.me(context)

    expect(oauthApi.getMyInformation).toBeCalledWith(context)
    expect(oauthApi.getUserAccessRoles).toBeCalledWith(context)
    expect(elite2Api.getCaseLoads).toBeCalledWith(context)
    expect(elite2Api.put).toBeCalledWith(context, 'api/users/me/activeCaseLoad', { caseLoadId: 'FIRST' })
    expect(elite2Api.getStaffRoles).toBeCalledWith(context, -2, 'FIRST')
    expect(elite2Api.getWhereaboutsConfig).toBeCalledWith(context, 'FIRST')
  })

  it('should return undefined if only caseload is ___', async () => {
    const context = { hello: 'Hello!' }
    elite2Api.getCaseLoads.mockReturnValueOnce([{ caseLoadId: '___' }])
    const viewModel = await userService.me(context)

    expect(viewModel).toEqual({
      ...details,
      activeCaseLoadId: undefined,
      accessRoles,
      staffRoles: [],
      isWhereabouts: false,
    })
  })

  it('should return undefined if no caseload is set or available', async () => {
    const context = { hello: 'Hello!' }
    elite2Api.getCaseLoads.mockReturnValueOnce([])
    const viewModel = await userService.me(context)

    expect(viewModel).toEqual({
      ...details,
      activeCaseLoadId: undefined,
      accessRoles,
      staffRoles: [],
      isWhereabouts: false,
    })
  })

  it('should combine user info, access roles and staff roles into one view model', async () => {
    elite2Api.getCaseLoads.mockReturnValueOnce([{ caseLoadId: 'LEI', currentlyActive: true }, { caseLoadId: 'SECOND' }])
    const viewModel = await userService.me({})

    expect(viewModel).toEqual({
      ...details,
      activeCaseLoadId: 'LEI',
      accessRoles,
      staffRoles,
      isWhereabouts: true,
    })
  })
})
