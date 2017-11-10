const sinon = require('sinon');
const chai = require('chai'),
  expect = chai.expect;
const sinonChai = require('sinon-chai');

const elite2Api = require('../server/elite2Api');
const bookingService = require('../server/services/booking');

chai.use(sinonChai);

describe('Booking Service Quick look', () => {
  let sandbox;
  const req = {
    params: {
      bookingId: 1,
    },
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(elite2Api, 'getBalances');
    sandbox.stub(elite2Api, 'getMainSentence');
    sandbox.stub(elite2Api, 'getActivitiesForToday');
    sandbox.stub(elite2Api, 'getPositiveCaseNotes');
    sandbox.stub(elite2Api, 'getNegativeCaseNotes');
    elite2Api.getBalances.returns(null);
    elite2Api.getMainSentence.returns(null);
    elite2Api.getActivitiesForToday.returns([]);
    elite2Api.getPositiveCaseNotes.returns(null);
    elite2Api.getNegativeCaseNotes.returns(null);
  });

  afterEach(() => sandbox.restore());

  it('should call getBalance', async () => {
    const balance = {
      spends: 10,
      cash: 20,
      savings: 100,
      currency: 'GBP',
    };

    elite2Api.getBalances.returns(balance);

    const data = await bookingService.getQuickLookViewModel(req);

    expect(elite2Api.getBalances).to.be.called;

    expect(data.balance.spends).to.equal(10);
    expect(data.balance.cash).to.equal(20);
    expect(data.balance.savings).to.equal(100);
    expect(data.balance.currency).to.equal('GBP');
  });

  it('should call getMainSentence', async () => {
    elite2Api.getMainSentence.returns({
      mainOffenceDescription: 'basic',
      releaseDate: '2017-11-09',
    });

    const data = await bookingService.getQuickLookViewModel(req);

    expect(elite2Api.getMainSentence).to.be.called;

    expect(data.sentence.type).to.equal('basic');
    expect(data.sentence.releaseDate).to.equal('2017-11-09');
  });

  it('should call getActivitiesForToday', async () => {
    elite2Api.getActivitiesForToday.returns([
      {
        eventSourceDesc: 'workshop 1',
        startTime: '2017-01-01T10:41:10.572',
        endTime: '2017-01-01T10:41:10.572',
      },
      {
        eventSourceDesc: 'workshop 2',
        startTime: '2017-01-01T12:41:10.572',
        endTime: '2017-01-01T15:41:10.572',
      },
    ]);

    const data = await bookingService.getQuickLookViewModel(req);

    expect(elite2Api.getActivitiesForToday).to.be.called;

    expect(data.activities.morningActivities.length).to.equal(1);
    expect(data.activities.afternoonActivities.length).to.equal(1);

    expect(data.activities.morningActivities[0].description).to.equal('workshop 1');
    expect(data.activities.morningActivities[0].startTime).to.equal('2017-01-01T10:41:10.572');
    expect(data.activities.morningActivities[0].endTime).to.equal('2017-01-01T10:41:10.572');

    expect(data.activities.afternoonActivities[0].description).to.equal('workshop 2');
    expect(data.activities.afternoonActivities[0].startTime).to.equal('2017-01-01T12:41:10.572');
    expect(data.activities.afternoonActivities[0].endTime).to.equal('2017-01-01T15:41:10.572');
  });

  it('should call getPositiveCaseNotes',async () => {
    elite2Api.getPositiveCaseNotes.returns({
      count: 1,
    });

    const data = await bookingService.getQuickLookViewModel(req);

    expect(elite2Api.getPositiveCaseNotes).to.be.called;

    expect(data.positiveCaseNotes).to.equal(1);
  });

  it('should call getNegativeCaseNotes',async () => {
    elite2Api.getNegativeCaseNotes.returns({
      count: 1,
    });

    const data = await bookingService.getQuickLookViewModel(req);

    expect(elite2Api.getNegativeCaseNotes).to.be.called;

    expect(data.negativeCaseNotes).to.equal(1);
  });
});