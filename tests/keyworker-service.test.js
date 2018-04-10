const sinon = require('sinon');
const chai = require('chai'),
  expect = chai.expect;
const sinonChai = require('sinon-chai');

const elite2Api = require('../server/api/elite2Api');
const keyworkerApi = require('../server/api/keyworker-api');
const service = require('../server/services/keyworker');
const config = require('../server/config');

chai.use(sinonChai);

const req = {};
const res = {};

describe('Key worker service', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(elite2Api, 'getMyInformation');
    sandbox.stub(elite2Api, 'getSummaryForOffenders');
    sandbox.stub(keyworkerApi, 'getPrisonMigrationStatus');
    sandbox.stub(keyworkerApi, 'getAssignedOffenders');
    sandbox.stub(elite2Api, 'getAssignedOffenders');

    config.apis = {
      keyworker: {
        url: 'http://keyworker.io',
      },
    };

    elite2Api.getMyInformation.returns({
      activeCaseLoadId: 'LEI',
      staffId: 1,
    });
  });
  
  afterEach(() => sandbox.restore());

  it('should attempt to check the migration status if the keyworker url has been set', async () => {
    keyworkerApi.getPrisonMigrationStatus.returns({
      migrated: true,
    });

    await service.getAssignedOffenders(req, res);

    expect(keyworkerApi.getPrisonMigrationStatus).to.be.calledWith({}, {}, 'LEI');
    expect(elite2Api.getAssignedOffenders).to.have.not.been.called;
  });

  it('should request assigned offender numbers from the keyworker server, then request the offender details from the elite2Api', async () => {
    keyworkerApi.getPrisonMigrationStatus.returns({ migrated: true });
    keyworkerApi.getAssignedOffenders.returns([{ offenderNo: 'A1' }, { offenderNo: 'A2' }]);

    await service.getAssignedOffenders(req, res);

    expect(elite2Api.getSummaryForOffenders(req, res, ['A1', 'A2']));
    expect(elite2Api.getAssignedOffenders).to.have.not.been.called;
  });

  it('should fall back to the elite2Api when the keyworker data has not been migrated', async () => {
    keyworkerApi.getPrisonMigrationStatus.returns({
      migrated: false,
    });

    await service.getAssignedOffenders(req, res);

    expect(elite2Api.getAssignedOffenders).to.have.been.called;
  });

  it('should fall back to the elite2Api when the keyworker url has not been configured', async () => {
    config.apis = {
      keyworker: { },
    };

    await service.getAssignedOffenders(req, res);

    expect(elite2Api.getAssignedOffenders).to.have.been.called;
  });
  
  it('should not attempt to request offender details from elite2Api when there is no offenders assigned', async () => {
    keyworkerApi.getPrisonMigrationStatus.returns({
      migrated: true,
    });
    
    keyworkerApi.getAssignedOffenders.returns([]);
    
    const offenders = await service.getAssignedOffenders(req, res);
    
    expect(elite2Api.getSummaryForOffenders).to.not.been.called;
    
    expect(offenders.length).to.equal(0);
  });
});