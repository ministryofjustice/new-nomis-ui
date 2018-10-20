const sinon = require('sinon');
const chai = require('chai');

const { expect } = chai;
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const { eliteApiFactory } = require('../server/api/eliteApi');
const { keyworkerApiFactory } = require('../server/api/keyworkerApi');
const { keyworkerServiceFactory } = require('../server/services/keyworker');

const eliteApi = eliteApiFactory(null);
const keyworkerApi = keyworkerApiFactory(null);
const service = keyworkerServiceFactory(eliteApi, keyworkerApi);

const context = {};

describe('Key worker service', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(eliteApi, 'getMyInformation');
    sandbox.stub(eliteApi, 'getSummaryForOffenders');
    sandbox.stub(eliteApi, 'getAssignedOffenders');
    sandbox.stub(eliteApi, 'getOffendersSentenceDates');
    sandbox.stub(eliteApi, 'caseNoteUsageList');

    sandbox.stub(keyworkerApi, 'getKeyworkerByStaffIdAndPrisonId');
    sandbox.stub(keyworkerApi, 'getPrisonMigrationStatus');
    sandbox.stub(keyworkerApi, 'getAssignedOffenders');

    eliteApi.getMyInformation.returns({
      activeCaseLoadId: 'LEI',
      staffId: 1,
    });
  });
  
  afterEach(() => sandbox.restore());

  it('should attempt to check the migration status if the keyworker url has been set', async () => {
    keyworkerApi.getPrisonMigrationStatus.returns({
      migrated: true,
    });

    await service.getAssignedOffenders(context, 12345,'LEI');

    expect(keyworkerApi.getPrisonMigrationStatus).to.be.calledWith(context, 'LEI');
    expect(eliteApi.getAssignedOffenders).to.have.not.been.called;
  });

  it('should request assigned offender numbers from the keyworker server, then request the offender details from the elite2Api', async () => {
    keyworkerApi.getPrisonMigrationStatus.returns({ migrated: true });
    keyworkerApi.getAssignedOffenders.returns([{ offenderNo: 'A1' }, { offenderNo: 'A2' }]);

    await service.getAssignedOffenders(context);

    expect(eliteApi.getSummaryForOffenders(context, ['A1', 'A2']));
    expect(eliteApi.getAssignedOffenders).to.have.not.been.called;
  });

  it('should fall back to the elite2Api when the keyworker data has not been migrated', async () => {
    keyworkerApi.getPrisonMigrationStatus.returns({
      migrated: false,
    });

    await service.getAssignedOffenders(context);

    expect(eliteApi.getAssignedOffenders).to.have.been.called;
  });

  it('should not attempt to request offender details from elite2Api when there is no offenders assigned', async () => {
    keyworkerApi.getPrisonMigrationStatus.returns({
      migrated: true,
    });
    
    keyworkerApi.getAssignedOffenders.returns([]);
    
    const offenders = await service.getAssignedOffenders(context);
    
    expect(eliteApi.getSummaryForOffenders).to.not.been.called;
    
    expect(offenders.length).to.equal(0);
  });

  it('should call getKeyworkerByStaffIdAndPrisonId with the correct staffId and agencyId', async () => {
    keyworkerApi.getPrisonMigrationStatus.returns({
      migrated: true,
    });
    await service.myAllocationsViewModel(context);
    expect(keyworkerApi.getKeyworkerByStaffIdAndPrisonId).to.be.calledWith(context, 1, 'LEI');
  });

  it('should call offender-sentence with the correct offender numbers',async () => {
    const offenders = [{ offenderNo: 'A1' }, { offenderNo: 'A2' }];
    keyworkerApi.getPrisonMigrationStatus.returns({ migrated: true });
    keyworkerApi.getAssignedOffenders.returns(offenders);
    eliteApi.getSummaryForOffenders.returns(offenders);
    eliteApi.caseNoteUsageList.returns(offenders);

    await service.myAllocationsViewModel(context);

    expect(eliteApi.getOffendersSentenceDates).to.be.calledWith(context, ['A1','A2']);
  });

  it('should produce a view model that contains a key workers capacity and allocations merged with assessment and sentence information', async () => {
    const offenders = [{ offenderNo: 'A1' }, { offenderNo: 'A2' }];
    const sentenceDates = [{ offenderNo: 'A1',sentenceDetail: { conditionalReleaseDate: '20/10/2020' } }, { offenderNo: 'A2',sentenceDetail: { conditionalReleaseDate: '21/10/2020' } }];
    const kwDates = [{ offenderNo: 'A1',latestCaseNote: '04/06/2018' }, { offenderNo: 'A2',latestCaseNote: '01/06/2018' }];

    keyworkerApi.getPrisonMigrationStatus.returns({ migrated: true });
    keyworkerApi.getKeyworkerByStaffIdAndPrisonId.returns({
      capacity: 15,
    });
    keyworkerApi.getAssignedOffenders.returns(offenders);
    eliteApi.getSummaryForOffenders.returns(offenders);

    eliteApi.getOffendersSentenceDates.returns(sentenceDates);
    eliteApi.caseNoteUsageList.returns(kwDates);

    const expected = {
      capacity: 15,
      allocations: [
        { offenderNo: 'A1',conditionalReleaseDate: '20/10/2020', lastKeyWorkerSessionDate: '04/06/2018' },
        { offenderNo: 'A2',conditionalReleaseDate: '21/10/2020', lastKeyWorkerSessionDate: '01/06/2018' },
      ],
    };

    const result = await service.myAllocationsViewModel(context);

    expect(result).to.deep.equal(expected);
  });
});