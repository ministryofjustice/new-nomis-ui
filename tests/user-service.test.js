const sinon = require('sinon')
const chai = require('chai')

const { expect } = chai
const sinonChai = require('sinon-chai')

const { eliteApiFactory } = require('../server/api/eliteApi')
const { oauthApiFactory } = require('../server/api/oauthApi')
const { userServiceFactory } = require('../server/services/user')

chai.use(sinonChai)

describe('User service', () => {
  let sandbox

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
  const elite2Api = eliteApiFactory({})
  const oauthApi = oauthApiFactory({}, { clientId: 'clientId', clientSecret: 'clientSecret', url: 'url' })
  const userService = userServiceFactory(elite2Api, oauthApi)

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    sandbox.stub(oauthApi, 'getMyInformation')
    sandbox.stub(oauthApi, 'getUserAccessRoles')
    sandbox.stub(elite2Api, 'getCaseLoads')
    sandbox.stub(elite2Api, 'put')
    sandbox.stub(elite2Api, 'getStaffRoles')
    sandbox.stub(elite2Api, 'getWhereaboutsConfig')

    oauthApi.getMyInformation.returns(details)
    oauthApi.getUserAccessRoles.returns(accessRoles)
    elite2Api.getCaseLoads.returns([{ caseLoadId: 'LEI', currentlyActive: true }, { caseLoadId: 'SECOND' }])
    elite2Api.getStaffRoles.returns(staffRoles)
    elite2Api.getWhereaboutsConfig.returns({ enabled: true })
  })

  afterEach(() => sandbox.restore())

  it('should call all expected elite2Api and oauthApi services with the correct params', async () => {
    const context = { hello: 'Hello!' }
    await userService.me(context)

    expect(oauthApi.getMyInformation).calledWith(context)
    expect(oauthApi.getUserAccessRoles).calledWith(context)
    expect(elite2Api.getStaffRoles).calledWith(context, -2, 'LEI')
    expect(elite2Api.getWhereaboutsConfig).calledWith(context, 'LEI')
  })

  it('should set a caseload if no caseload is already set', async () => {
    const context = { hello: 'Hello!' }
    elite2Api.getCaseLoads.returns([{ caseLoadId: 'FIRST' }, { caseLoadId: 'SECOND' }])
    await userService.me(context)

    expect(oauthApi.getMyInformation).calledWith(context)
    expect(oauthApi.getUserAccessRoles).calledWith(context)
    expect(elite2Api.getCaseLoads).calledWith(context)
    expect(elite2Api.put).calledWith(context, '/api/users/me/activeCaseLoad', { caseLoadId: 'FIRST' })
    expect(elite2Api.getStaffRoles).calledWith(context, -2, 'FIRST')
    expect(elite2Api.getWhereaboutsConfig).calledWith(context, 'FIRST')
  })

  it('should throw an error if no caseload is set or available', async () => {
    const context = { hello: 'Hello!' }
    elite2Api.getCaseLoads.returns([])
    try {
      await userService.me(context)
      expect.fail('should have thrown error')
    } catch (error) {
      expect(error.message).to.equal('No active caseload set: none available')
    }
  })

  it('should combine user info, access roles and staff roles into one view model', async () => {
    const viewModel = await userService.me({})

    expect(viewModel).to.deep.equal({
      ...details,
      activeCaseLoadId: 'LEI',
      accessRoles,
      staffRoles,
      isWhereabouts: true,
    })
  })
})
