const sinon = require('sinon');
const chai = require('chai'),
  expect = chai.expect;
const sinonChai = require('sinon-chai');
const moment = require('moment');

const isoDateFormat = require('./../server/constants').isoDateFormat;

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
    sandbox.stub(elite2Api, 'getMainOffence');
    sandbox.stub(elite2Api, 'getActivitiesForToday');
    sandbox.stub(elite2Api, 'getPositiveCaseNotes');
    sandbox.stub(elite2Api, 'getNegativeCaseNotes');
    sandbox.stub(elite2Api, 'getSentenceData');
    sandbox.stub(elite2Api, 'getContacts');
    sandbox.stub(elite2Api, 'getAdjudications');

    elite2Api.getBalances.returns(null);
    elite2Api.getMainOffence.returns(null);
    elite2Api.getActivitiesForToday.returns([]);
    elite2Api.getPositiveCaseNotes.returns(null);
    elite2Api.getNegativeCaseNotes.returns(null);
    elite2Api.getSentenceData.returns(null);
    elite2Api.getContacts.returns(null);
    elite2Api.getAdjudications.returns({
      awards: [],
    });
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

  it('should call getMainOffence', async () => {
    elite2Api.getMainOffence.returns([
      {
        bookingId: 1,
        offenceDescription: 'basic',
      },
    ]);

    const data = await bookingService.getQuickLookViewModel(req);

    expect(elite2Api.getMainOffence).to.be.called;

    expect(data.offences[0].type).to.equal('basic');
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

  it('should call getPositiveCaseNotes with iso format and fromDate three months in the past', async () => {
    await bookingService.getQuickLookViewModel(req);
    const { fromDate, toDate } = elite2Api.getPositiveCaseNotes.getCall(0).args[0];

    const threeMonthsInThePast = moment().subtract(3,'months').format(isoDateFormat);
    const today = moment().format(isoDateFormat);

    expect(fromDate).to.equal(threeMonthsInThePast);
    expect(toDate).to.equal(today);
  });

  it('should call getNegativeCaseNotes with iso format and fromDate three months in the past', async () => {
    await bookingService.getQuickLookViewModel(req);
    const { fromDate, toDate } = elite2Api.getNegativeCaseNotes.getCall(0).args[0];

    const threeMonthsInThePast = moment().subtract(3,'months').format(isoDateFormat);
    const today = moment().format(isoDateFormat);

    expect(fromDate).to.equal(threeMonthsInThePast);
    expect(toDate).to.equal(today);
  });

  it('should call getAdjudications with fromDate three months in the past and be in iso formatted', async () => {
    await bookingService.getQuickLookViewModel(req);

    const threeMonthsInThePast = moment().subtract(3,'months').format(isoDateFormat);
    const { fromDate } = elite2Api.getAdjudications.getCall(0).args[0];

    expect(fromDate).to.equal(threeMonthsInThePast);
  });

  it('should call return an empty awards array and a proven count of zero when no data is returned', async () => {
    const data = await bookingService.getQuickLookViewModel(req);

    expect(data.adjudications.proven).to.equal(0);
    expect(data.adjudications.awards.length).to.equal(0);
  });


  it('should call getAdjudications and populate the response with proven adjudication count', async () => {
    elite2Api.getAdjudications.returns({
      provenAdjudications: 2,
      awards: [
        {},
        {},
      ],
    });

    const data = await bookingService.getQuickLookViewModel(req);

    expect(data.adjudications.proven).to.equal(2);
  });

  it('should call getAdjudications and populate the response with awards formatted with duration and description', async () => {
    elite2Api.getAdjudications.returns({
      awards: [
        {
          months: 10,
          sanctionCodeDescription: 'comment 1',
          comment: 'c1',
        },
        {
          days: 20,
          sanctionCodeDescription: 'comment 2',
          comment: 'c2',
        },
        {
          months: 1,
          sanctionCodeDescription: 'comment 3',
          comment: 'c3',
        },
        {
          days: 1,
          sanctionCodeDescription: 'comment 4',
          comment: 'c4',
        },
      ],
    });

    const data = await bookingService.getQuickLookViewModel(req);

    const { awards } = data.adjudications;

    expect(awards[0].durationText).to.equal('10 Months');
    expect(awards[0].sanctionCodeDescription).to.equal('comment 1');
    expect(awards[0].comment).to.equal('c1');

    expect(awards[1].durationText).to.equal('20 Days');
    expect(awards[1].sanctionCodeDescription).to.equal('comment 2');
    expect(awards[1].comment).to.equal('c2');

    expect(awards[2].durationText).to.equal('1 Month');
    expect(awards[2].sanctionCodeDescription).to.equal('comment 3');
    expect(awards[2].comment).to.equal('c3');

    expect(awards[3].durationText).to.equal('1 Day');
    expect(awards[3].sanctionCodeDescription).to.equal('comment 4');
    expect(awards[3].comment).to.equal('c4');
  });


  it('should call getContacts', async () => {
    elite2Api.getContacts.returns({
      nextOfKin: [
        {
          lastName: 'BALOG',
          firstName: 'EVA',
          middleName: 'GOLAB',
          contactType: 'S',
          contactTypeDescription: 'Social/Family',
          relationship: 'SIS',
          relationshipDescription: 'Sister',
          emergencyContact: true,
        },
      ],
    });

    const data = await bookingService.getQuickLookViewModel(req);

    expect(elite2Api.getContacts).to.be.called;

    expect(data.nextOfKin.length).to.equal(1);
    expect(data.nextOfKin[0].firstName).to.equal('EVA');
    expect(data.nextOfKin[0].lastName).to.equal('BALOG');
    expect(data.nextOfKin[0].middleName).to.equal('GOLAB');
    expect(data.nextOfKin[0].relationship).to.equal('Sister');
    expect(data.nextOfKin[0].contactTypeDescription).to.equal('Social/Family');
  });


  it('should return an empty array when no contacts details are returned', async () => {
    const data = await bookingService.getQuickLookViewModel(req);

    expect(elite2Api.getContacts).to.be.called;
    expect(data.nextOfKin.length).to.equal(0);
  });
});