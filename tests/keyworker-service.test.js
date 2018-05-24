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
    sandbox.stub(keyworkerApi, 'getKeyworker');
    sandbox.stub(elite2Api, 'getOffendersSentenceDates');
    sandbox.stub(elite2Api, 'getOffendersAssessments');

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

    await service.getAssignedOffenders(req, res, 12345,'LEI');

    expect(keyworkerApi.getPrisonMigrationStatus).to.be.calledWith(req, res, 'LEI');
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

  it('should call getKeyWorker with the correct staffId and agencyId', async () => {
    keyworkerApi.getPrisonMigrationStatus.returns({
      migrated: true,
    });
    await service.myAllocationsViewModel(req, res);
    expect(keyworkerApi.getKeyworker).to.be.calledWith(req, res, 1, 'LEI');
  });

  it('should call offender-assessments with the correct code and offender numbers', async () => {
    const offenders = [{ offenderNo: 'A1' }, { offenderNo: 'A2' }];
    keyworkerApi.getPrisonMigrationStatus.returns({ migrated: true });
    keyworkerApi.getAssignedOffenders.returns(offenders);
    elite2Api.getSummaryForOffenders.returns(offenders);
    elite2Api.getOffendersSentenceDates.returns(offenders);

    await service.myAllocationsViewModel(req, res);

    expect(elite2Api.getOffendersAssessments).to.be.calledWith(req, res,'CSR', ['A1','A2']);
  });

  it('should call offender-sentence with the correct offender numbers',async () => {
    const offenders = [{ offenderNo: 'A1' }, { offenderNo: 'A2' }];
    keyworkerApi.getPrisonMigrationStatus.returns({ migrated: true });
    keyworkerApi.getAssignedOffenders.returns(offenders);
    elite2Api.getSummaryForOffenders.returns(offenders);
    elite2Api.getOffendersAssessments.returns(offenders);

    await service.myAllocationsViewModel(req, res);

    expect(elite2Api.getOffendersSentenceDates).to.be.calledWith(req, res, ['A1','A2']);
  });

  it('should produce a view model that contains a key workers capacity and allocations merged with assessment and sentence information', async () => {
    const offenders = [{ offenderNo: 'A1' }, { offenderNo: 'A2' }];
    const sentenceDates = [{ offenderNo: 'A1',sentenceDetail: { conditionalReleaseDate: '20/10/2020' } }, { offenderNo: 'A2',sentenceDetail: { conditionalReleaseDate: '21/10/2020' } }];
    const assessments = [{ offenderNo: 'A1',classification: 'High' }, { offenderNo: 'A2',classification: 'Low' }];

    keyworkerApi.getPrisonMigrationStatus.returns({ migrated: true });
    keyworkerApi.getKeyworker.returns({
      capacity: 15,
    });
    keyworkerApi.getAssignedOffenders.returns(offenders);
    elite2Api.getSummaryForOffenders.returns(offenders);

    elite2Api.getOffendersSentenceDates.returns(sentenceDates);
    elite2Api.getOffendersAssessments.returns(assessments);

    const expected = {
      capacity: 15,
      allocations: [
        { offenderNo: 'A1',conditionalReleaseDate: '20/10/2020',crsaLevel: 'High' },
        { offenderNo: 'A2',conditionalReleaseDate: '21/10/2020',crsaLevel: 'Low' },
      ],
    };

    const result = await service.myAllocationsViewModel(req,res);

    expect(result).to.deep.equal(expected);
  });
});