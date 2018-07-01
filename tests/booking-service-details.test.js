const sinon = require('sinon');
const chai = require('chai'),
  expect = chai.expect;
const sinonChai = require('sinon-chai');

const eliteApiFactory = require('../server/api/eliteApi').eliteApiFactory;
const keyworkerApiFactory = require('../server/api/keyworkerApi').keyworkerApiFactory;
const bookingServiceFactory = require('../server/services/booking').bookingServiceFactory;

const eliteApi = eliteApiFactory(null);
const keyworkerApi = keyworkerApiFactory(null);
const bookingService = bookingServiceFactory(eliteApi, keyworkerApi);

chai.use(sinonChai);

describe('Booking Service Booking details', () => {
  const offenderNo = 'A12345';
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(eliteApi, 'getDetails');
    sandbox.stub(eliteApi, 'getIepSummary');
    sandbox.stub(eliteApi, 'getDetailsLight');
    sandbox.stub(eliteApi, 'getKeyworker');
    sandbox.stub(eliteApi, 'getMyInformation');
    sandbox.stub(keyworkerApi, 'getKeyworkerByCaseloadAndOffenderNo');

    eliteApi.getDetailsLight.returns({
      bookingId: 1,
    });
    eliteApi.getDetails.returns({
      assessments: [{
        classification: 'basic',
        cellSharingAlertFlag: true,
      },
      ],
    });
    eliteApi.getIepSummary.returns({ iepLevel: null });
    eliteApi.getMyInformation.returns({ activeCaseloadId: 'LEI' });
    keyworkerApi.getKeyworkerByCaseloadAndOffenderNo.returns({ firstName: 'John' });
  });

  afterEach(() => sandbox.restore());

  it('should call getDetails', async () => {
    await bookingService.getBookingDetailsViewModel({}, offenderNo);
    expect(eliteApi.getDetails).to.be.called;
  });

  it('should call getIepSummary', async () => {
    const data = await bookingService.getBookingDetailsViewModel({}, offenderNo);
    expect(eliteApi.getIepSummary).to.be.called;
    expect(data.csra).to.equal('basic');
  });

  it('it should call getKeyworker', async () => {
    const data = await bookingService.getBookingDetailsViewModel({}, offenderNo);
    expect(keyworkerApi.getKeyworkerByCaseloadAndOffenderNo).to.be.called;
    expect(data.keyworker.firstName).to.equal('John');
  });
});