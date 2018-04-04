const sinon = require('sinon');
const chai = require('chai'),
  expect = chai.expect;
const sinonChai = require('sinon-chai');

const elite2Api = require('../server/api/elite2Api');
const bookingService = require('../server/services/booking');

chai.use(sinonChai);

describe('Booking Service Booking details', () => {
  let sandbox;
  const req = {
    bookingId: 1,
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(elite2Api, 'getCategoryAssessment');
    sandbox.stub(elite2Api, 'getSentenceData');
    sandbox.stub(elite2Api, 'getIepSummary');
    sandbox.stub(elite2Api, 'getDetailsLight');

    elite2Api.getDetailsLight.returns({
      bookingId: 1,
    });
  });

  afterEach(() => sandbox.restore());

  it('should call getCategoryAssessment', async () => {
    elite2Api.getSentenceData.returns({});
    elite2Api.getIepSummary.returns({});

    elite2Api.getCategoryAssessment.returns({
      classification: 'stuff',
      assessmentCode: 'CATEGORY',
      assessmentDescription: 'stuff',
      cellSharingAlertFlag: false,
      assessmentDate: '2017-12-05',
      nextReviewDate: '2017-12-05',
    });

    const data = await bookingService.getKeyDatesVieModel(req);

    expect(elite2Api.getCategoryAssessment).to.be.called;

    expect(data.reCategorisationDate).to.equal('2017-12-05');
  });
});