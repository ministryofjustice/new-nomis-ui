const sinon = require('sinon');
const chai = require('chai'),
  expect = chai.expect;
const sinonChai = require('sinon-chai');

const elite2Api = require('../server/api/elite2Api');
const userService = require('../server/services/user');

chai.use(sinonChai);

const createParams = (params) => ({
  params: {
    ...params,
  },
});

describe('User service',() => {
  let sandbox;

  const details = { 
    staffId: -2,
    username: 'ITAG_USER',
    firstName: 'API',
    lastName: 'User',
    activeCaseLoadId: 'LEI', 
  };

  const accessRoles = [
    { roleId: -201,roleCode: 'OMIC_ADMIN',roleName: 'Omic Admin',caseloadId: 'NWEB' },
    { roleId: -100,roleCode: 'LICENCE_CA',roleName: 'Case Admin',caseloadId: 'NWEB' },
  ];

  const staffRoles = [
    { role: 'KW', roleDescription: 'Key Worker' },
  ];
  
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(elite2Api, 'getMyInformation');
    sandbox.stub(elite2Api, 'getUserAccessRoles');
    sandbox.stub(elite2Api, 'getStaffRoles');

    elite2Api.getMyInformation.returns(details);
    elite2Api.getUserAccessRoles.returns(accessRoles);
    elite2Api.getStaffRoles.returns(staffRoles);
  });
  
  afterEach(() => sandbox.restore());

  it('should call getMyInformation and then call getUserRoles and getStaffRoles with the correct staffId', async () => {
    await userService.me({ params: {} });

    expect(elite2Api.getUserAccessRoles).calledWith(createParams({ staffId: -2, agencyId: 'LEI' }));
    expect(elite2Api.getStaffRoles).calledWith(createParams({ staffId: -2, agencyId: 'LEI' }));
  });

  it('should combine user info, access roles and staff roles into one view model', async () => {
    const viewModel = await userService.me({ params: {} });

    expect(viewModel).to.deep.equal({
      ...details,
      accessRoles,
      staffRoles,
    });
  })
});