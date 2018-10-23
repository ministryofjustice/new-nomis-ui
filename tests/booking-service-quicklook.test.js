/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const chai = require('chai');

const { expect } = chai;
const sinonChai = require('sinon-chai');
const moment = require('moment');
const momentTimeZone = require('moment-timezone');
const { isoDateFormat } = require('./../server/constants');
const { isoDateTimeFormat } = require('./../server/constants');

const { eliteApiFactory } = require('../server/api/eliteApi');
const { keyworkerApiFactory } = require('../server/api/keyworkerApi');
const { bookingServiceFactory } = require('../server/services/booking');

const eliteApi = eliteApiFactory(null);
const keyworkerApi = keyworkerApiFactory(null);
const bookingService = bookingServiceFactory(eliteApi, keyworkerApi);

chai.use(sinonChai);

describe('Booking Service Quick look', () => {
  const OFFENDER_NO = 'AA0000AE';

  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(eliteApi, 'getBalances');
    sandbox.stub(eliteApi, 'getMainOffence');
    sandbox.stub(eliteApi, 'getEventsForToday');
    sandbox.stub(eliteApi, 'getPositiveCaseNotes');
    sandbox.stub(eliteApi, 'getNegativeCaseNotes');
    sandbox.stub(eliteApi, 'getSentenceData');
    sandbox.stub(eliteApi, 'getContacts');
    sandbox.stub(eliteApi, 'getAdjudications');
    sandbox.stub(eliteApi, 'getLastVisit');
    sandbox.stub(eliteApi, 'getRelationships');
    sandbox.stub(eliteApi, 'getDetailsLight');
    sandbox.stub(eliteApi, 'getNextVisit');
    sandbox.stub(eliteApi, 'caseNoteUsageList');

    eliteApi.getBalances.returns(null);
    eliteApi.getMainOffence.returns(null);
    eliteApi.getEventsForToday.returns([]);
    eliteApi.getPositiveCaseNotes.returns(null);
    eliteApi.getNegativeCaseNotes.returns(null);
    eliteApi.getSentenceData.returns(null);
    eliteApi.getContacts.returns(null);
    eliteApi.getLastVisit.returns(null);
    eliteApi.getRelationships.returns(null);
    eliteApi.getNextVisit.returns(null);
    eliteApi.getAdjudications.returns({
      awards: [],
    });
    eliteApi.getDetailsLight.returns({
      bookingId: 1,
    });
    eliteApi.caseNoteUsageList.returns([]);
  });

  afterEach(() => sandbox.restore());

  it('should call getBalance', async () => {
    const balance = {
      spends: 10,
      cash: 20,
      savings: 100,
      currency: 'GBP',
    };

    eliteApi.getBalances.returns(balance);

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);

    expect(eliteApi.getBalances).to.be.called;

    expect(data.balance.spends).to.equal(10);
    expect(data.balance.cash).to.equal(20);
    expect(data.balance.savings).to.equal(100);
    expect(data.balance.currency).to.equal('GBP');
  });

  it('should call getMainOffence', async () => {
    eliteApi.getMainOffence.returns([
      {
        bookingId: 1,
        offenceDescription: 'basic',
      },
    ]);

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);

    expect(eliteApi.getMainOffence).to.be.called;

    expect(data.offences[0].type).to.equal('basic');
  });

  it('should call getEventsForToday', async () => {
    eliteApi.getEventsForToday.returns([
      {
        eventSubType: 'PA',
        eventSourceDesc: 'workshop 1',
        startTime: '2017-01-01T10:41:10.572',
        endTime: '2017-01-01T10:41:10.572',
        eventStatus: 'SCH',
      },
      {
        eventSubType: 'PA',
        eventSourceDesc: 'workshop 2',
        startTime: '2017-01-01T12:41:10.572',
        endTime: '2017-01-01T15:41:10.572',
        eventStatus: 'SCH',
      },
      {
        eventSubType: 'PA',
        eventSourceDesc: 'workshop 3',
        startTime: '2017-01-01T17:41:10.572',
        endTime: '2017-01-01T17:41:10.572',
        eventStatus: 'SCH',
      },
    ]);

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);

    expect(eliteApi.getEventsForToday).to.be.called;

    expect(data.activities.morningActivities.length).to.equal(1);
    expect(data.activities.afternoonActivities.length).to.equal(1);

    expect(data.activities.morningActivities[0].type).to.equal('workshop 1');
    expect(data.activities.morningActivities[0].startTime).to.equal('2017-01-01T10:41:10.572');
    expect(data.activities.morningActivities[0].endTime).to.equal('2017-01-01T10:41:10.572');

    expect(data.activities.afternoonActivities[0].type).to.equal('workshop 2');
    expect(data.activities.afternoonActivities[0].startTime).to.equal('2017-01-01T12:41:10.572');
    expect(data.activities.afternoonActivities[0].endTime).to.equal('2017-01-01T15:41:10.572');

    expect(data.activities.eveningDuties[0].type).to.equal('workshop 3');
    expect(data.activities.eveningDuties[0].startTime).to.equal('2017-01-01T17:41:10.572');
    expect(data.activities.eveningDuties[0].endTime).to.equal('2017-01-01T17:41:10.572');
  });

  it('should call getPositiveCaseNotes', async () => {
    eliteApi.getPositiveCaseNotes.returns({
      count: 1,
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);

    expect(eliteApi.getPositiveCaseNotes).to.be.called;

    expect(data.positiveCaseNotes).to.equal(1);
  });

  it('should call getNegativeCaseNotes', async () => {
    eliteApi.getNegativeCaseNotes.returns({
      count: 1,
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);

    expect(eliteApi.getNegativeCaseNotes).to.be.called;

    expect(data.negativeCaseNotes).to.equal(1);
  });

  it('should call getPositiveCaseNotes with iso format and fromDate three months in the past', async () => {
    await bookingService.getQuickLookViewModel({}, OFFENDER_NO);
    const { fromDate, toDate } = eliteApi.getPositiveCaseNotes.getCall(0).args[0];

    const threeMonthsInThePast = moment().subtract(3, 'months').format(isoDateFormat);
    const today = moment().format(isoDateFormat);

    expect(fromDate).to.equal(threeMonthsInThePast);
    expect(toDate).to.equal(today);
  });

  it('should call getNegativeCaseNotes with iso format and fromDate three months in the past', async () => {
    await bookingService.getQuickLookViewModel({}, OFFENDER_NO);
    const { fromDate, toDate } = eliteApi.getNegativeCaseNotes.getCall(0).args[0];

    const threeMonthsInThePast = moment().subtract(3, 'months').format(isoDateFormat);
    const today = moment().format(isoDateFormat);

    expect(fromDate).to.equal(threeMonthsInThePast);
    expect(toDate).to.equal(today);
  });

  it('should call return an empty awards array and a proven count of zero when no data is returned', async () => {
    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);

    expect(data.adjudications.proven).to.equal(0);
    expect(data.adjudications.awards.length).to.equal(0);
  });

  it('should call getAdjudications and populate the response with proven adjudication count', async () => {
    eliteApi.getAdjudications.returns({
      adjudicationCount: 2,
      awards: [
        {},
        {},
      ],
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);

    expect(data.adjudications.proven).to.equal(2);
  });

  it('should call getAdjudications and populate the response with filtered awards formatted with duration and description', async () => {
    eliteApi.getAdjudications.returns({
      awards: [
        {
          status: 'IMMEDIATE',
          months: 10,
          sanctionCodeDescription: 'comment 1',
          comment: 'c1',
        },
        {
          status: 'AS_AWARDED',
          days: 20,
          sanctionCodeDescription: 'comment 2',
          comment: 'c2',
        },
        {
          status: 'IMMEDIATE',
          months: 1,
          sanctionCodeDescription: 'comment 3',
          comment: 'c3',
        },
        {
          status: 'IMMEDIATE',
          days: 1,
          sanctionCodeDescription: 'comment 4',
          comment: 'c4',
        },
        {
          status: 'SUSP_STATUS',
          comment: 'NOT SHOWN',
        },
        {
          status: 'QUASHED',
          comment: 'NOT SHOWN',
        },
      ],
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);

    const { awards } = data.adjudications;

    expect(awards.length).to.equal(4);

    expect(awards[0].durationText).to.equal('10 months');
    expect(awards[0].sanctionCodeDescription).to.equal('comment 1');
    expect(awards[0].comment).to.equal('c1');

    expect(awards[1].durationText).to.equal('20 days');
    expect(awards[1].sanctionCodeDescription).to.equal('comment 2');
    expect(awards[1].comment).to.equal('c2');

    expect(awards[2].durationText).to.equal('1 month');
    expect(awards[2].sanctionCodeDescription).to.equal('comment 3');
    expect(awards[2].comment).to.equal('c3');

    expect(awards[3].durationText).to.equal('1 day');
    expect(awards[3].sanctionCodeDescription).to.equal('comment 4');
    expect(awards[3].comment).to.equal('c4');
  });

  it('should append the award description with a properly formatted level, like 50% stoppage of earnings', async () => {
    eliteApi.getAdjudications.returns({
      awards: [
        {
          status: 'IMMEDIATE',
          days: 1,
          sanctionCodeDescription: 'Stoppage of Earnings (%)',
          comment: 'c1',
          sanctionCode: 'STOP_PCT',
          limit: 50,
        },
        {
          status: 'IMMEDIATE',
          days: 1,
          sanctionCodeDescription: 'Stoppage of Earnings (amount)',
          comment: 'c2',
          sanctionCode: 'STOP_EARN',
          limit: 50,
        },
        {
          status: 'IMMEDIATE',
          days: 1,
          sanctionCodeDescription: 'Stoppage of Earnings',
          comment: 'c3',
          sanctionCode: 'STOP_PCT',
          limit: 50,
        },
        {
          status: 'IMMEDIATE',
          days: 1,
          sanctionCodeDescription: 'Stoppage of Earnings',
          comment: 'c4',
          sanctionCode: 'STOP_EARN',
          limit: 50,
        },
      ],
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);
    const { awards } = data.adjudications;

    expect(awards[0].sanctionCodeDescription).to.equal('Stoppage of Earnings (50%)');
    expect(awards[1].sanctionCodeDescription).to.equal('Stoppage of Earnings (£50.00)');
    expect(awards[2].sanctionCodeDescription).to.equal('Stoppage of Earnings (50%)');
    expect(awards[3].sanctionCodeDescription).to.equal('Stoppage of Earnings (£50.00)');
  });

  it('should display months and days', async () => {
    eliteApi.getAdjudications.returns({
      awards: [
        {
          status: 'IMMEDIATE',
          months: 10,
          days: 2,
        },
        {
          status: 'IMMEDIATE',
          months: 1,
          days: 1,
        },
      ],
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);
    const { awards } = data.adjudications;

    expect(awards[0].durationText).to.equal('10 months and 2 days');
    expect(awards[1].durationText).to.equal('1 month and 1 day');
  });


  it('should call getContacts', async () => {
    eliteApi.getContacts.returns({
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

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);

    expect(eliteApi.getContacts).to.be.called;

    expect(data.nextOfKin.length).to.equal(1);
    expect(data.nextOfKin[0].firstName).to.equal('EVA');
    expect(data.nextOfKin[0].lastName).to.equal('BALOG');
    expect(data.nextOfKin[0].middleName).to.equal('GOLAB');
    expect(data.nextOfKin[0].relationship).to.equal('Sister');
    expect(data.nextOfKin[0].contactTypeDescription).to.equal('Social/Family');
  });


  it('should return an empty array when no contacts details are returned', async () => {
    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);

    expect(eliteApi.getContacts).to.be.called;
    expect(data.nextOfKin.length).to.equal(0);
  });

  it('should return true for indeterminateReleaseDate when there is a tariff date but no release date', async () => {
    eliteApi.getSentenceData.returns({
      tariffDate: '2017-01-01',
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);

    expect(eliteApi.getSentenceData).to.be.called;
    expect(data.tariffDate).to.equal('2017-01-01');
    expect(data.indeterminateReleaseDate).to.be.true;
  });

  it('should return false for indeterminateReleaseDate when there is a release date and there is a tariff date', async () => {
    eliteApi.getSentenceData.returns({
      releaseDate: '2016-12-12',
      tariffDate: '2017-01-01',
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);

    expect(eliteApi.getSentenceData).to.be.called;
    expect(data.releaseDate).to.equal('2016-12-12');
    expect(data.tariffDate).to.equal('2017-01-01');
    expect(data.indeterminateReleaseDate).to.be.false;
  });

  it('should return false for indeterminateReleaseDate when there is a release date but there is no tariff date', async () => {
    eliteApi.getSentenceData.returns({
      releaseDate: '2016-12-12',
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);

    expect(eliteApi.getSentenceData).to.be.called;
    expect(data.releaseDate).to.equal('2016-12-12');
    expect(data.indeterminateReleaseDate).to.be.false;
  });

  it('should return false for indeterminateReleaseDate when there is neither a release date or a tariff date', async () => {
    eliteApi.getSentenceData.returns({
      additionalDaysAwarded: 4,
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);

    expect(eliteApi.getSentenceData).to.be.called;
    expect(data.indeterminateReleaseDate).to.be.false;
  });

  it('should only show attended, cancelled and ongoing', async () => {
    eliteApi.getLastVisit.returns({
      eventStatusDescription: 'Expired',
      eventStatus: 'EXP',
      visitTypeDescription: 'Social Contact',
      leadVisitor: 'JOHN SMITH',
      relationshipDescription: 'Brother',
      startTime: '2017-12-22T10:00:00',
      endTime: '2017-12-22T12:00:00',
      cancelReasonDescription: 'All visits canceled',
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);
    expect(data.lastVisit).to.equal(null);
  });

  it('should only show an attended visit', async () => {
    eliteApi.getLastVisit.returns({
      eventStatus: 'SCH',
      eventOutcome: 'ATT',
      eventOutcomeDescription: 'Attended',
      visitTypeDescription: 'Social Contact',
      leadVisitor: 'JOHN SMITH',
      relationshipDescription: 'Brother',
      startTime: '2017-12-22T10:00:00',
      endTime: '2017-12-22T12:00:00',
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);
    expect(data.lastVisit.status).to.equal('Attended');
  });

  it('should only show cancelled visit (status CANC)', async () => {
    eliteApi.getLastVisit.returns({
      eventStatus: 'CANC',
      eventStatusDescription: 'Cancelled',
      visitTypeDescription: 'Social Contact',
      leadVisitor: 'JOHN SMITH',
      relationshipDescription: 'Brother',
      startTime: '2017-12-22T10:00:00',
      endTime: '2017-12-22T12:00:00',
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);
    expect(data.lastVisit.status).to.equal('Cancelled');
  });

  it('should ensure that event status "CANC" (Cancel) overrides the outcome status', async () => {
    eliteApi.getLastVisit.returns({
      eventStatus: 'CANC',
      eventStatusDescription: 'Cancelled',
      cancelReasonDescription: 'some reason',
      eventOutcome: 'ATT',
      eventOutcomeDescription: 'Attended',
      visitTypeDescription: 'Social Contact',
      leadVisitor: 'JOHN SMITH',
      relationshipDescription: 'Brother',
      startTime: '2017-12-22T10:00:00',
      endTime: '2017-12-22T12:00:00',
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);
    expect(data.lastVisit.status).to.equal('Cancelled');
    expect(data.lastVisit.cancellationReason).to.equal('some reason');
  });

  it('should show a visit as ongoing when its currently in progress', async () => {
    const zone = 'Europe/London';
    const fiveMinutesAgo = momentTimeZone.tz(zone).subtract(5, 'minutes');
    const fiveMinutesTime = momentTimeZone.tz(zone).add(5,'minutes');

    eliteApi.getLastVisit.returns({
      eventStatus: 'SCH',
      eventStatusDescription: 'Scheduled (Approved)',
      visitType: 'OFFI',
      visitTypeDescription: 'Official Visit',
      leadVisitor: 'first last',
      relationship: 'COM',
      relationshipDescription: 'Community Offender Manager',
      location: 'VISITS',
      eventOutcome: 'ATT',
      eventOutcomeDescription: 'Attended',
      startTime: fiveMinutesAgo.format(isoDateTimeFormat).toString(),
      endTime: fiveMinutesTime.format(isoDateTimeFormat).toString(),
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);

    expect(data.lastVisit.status).to.equal('Ongoing');
  });

  it('should show an attended visit even though its currently expired', async () => {
    eliteApi.getLastVisit.returns({
      eventStatus: 'EXP',
      eventStatusDescription: 'Expired',
      visitType: 'SCON',
      visitTypeDescription: 'Social Contact',
      leadVisitor: 'JOHN SMITH',
      relationship: 'FA',
      relationshipDescription: 'Father',
      startTime: '2017-12-23T09:00:00',
      endTime: '2017-12-23T12:00:00',
      location: 'SOCIAL VISITS',
      eventOutcome: 'ATT',
      eventOutcomeDescription: 'Attended',
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);
    expect(data.lastVisit.status).to.equal('Attended');
  });

  it('should show lead visitor name in title case with relationship description after in parentheses', async () => {
    eliteApi.getLastVisit.returns({
      eventStatus: 'EXP',
      eventStatusDescription: 'Expired',
      visitType: 'SCON',
      visitTypeDescription: 'Social Contact',
      leadVisitor: 'JOHN SMITH',
      relationship: 'FA',
      relationshipDescription: 'Father',
      startTime: '2017-12-23T09:00:00',
      endTime: '2017-12-23T12:00:00',
      location: 'SOCIAL VISITS',
      eventOutcome: 'ATT',
      eventOutcomeDescription: 'Attended',
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);
    expect(data.lastVisit.leadVisitor).to.equal('John Smith (Father)');
  });

  it('should not show any text after lead visitor name if no relationship description in API response', async () => {
    eliteApi.getLastVisit.returns({
      eventStatus: 'EXP',
      eventStatusDescription: 'Expired',
      visitType: 'SCON',
      visitTypeDescription: 'Social Contact',
      leadVisitor: 'JOHN SMITH',
      startTime: '2017-12-23T09:00:00',
      endTime: '2017-12-23T12:00:00',
      location: 'SOCIAL VISITS',
      eventOutcome: 'ATT',
      eventOutcomeDescription: 'Attended',
    });

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);
    expect(data.lastVisit.leadVisitor).to.equal('John Smith');
  });

  it('should call getRelationships', async () => {
    eliteApi.getRelationships.returns([
      {
        lastName: 'Bull',
        firstName: 'Dom3',
        contactType: 'O',
        contactTypeDescription: 'Official',
        relationship: 'COM',
        relationshipDescription: 'Community Offender Manager',
        emergencyContact: false,
        nextOfKin: false,
        relationshipId: 18718,
        personId: 13518,
      },
      {
        lastName: 'Dom2',
        firstName: 'Bull',
        contactType: 'O',
        contactTypeDescription: 'Official',
        relationship: 'POM',
        relationshipDescription: 'Prison Offender Manager',
        emergencyContact: false,
        nextOfKin: false,
        relationshipId: 18773,
        personId: 13499,
      },
      {
        lastName: 'BALOG',
        firstName: 'IVOR',
        contactType: 'S',
        contactTypeDescription: 'Social/ Family',
        relationship: 'BRO',
        relationshipDescription: 'Brother',
        emergencyContact: false,
        nextOfKin: false,
        relationshipId: 18593,
        personId: 13318,
      }]);

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);

    expect(data.assignedStaffMembers.communityOffenderManager.firstName).to.equal('Dom3');
    expect(data.assignedStaffMembers.communityOffenderManager.lastName).to.equal('Bull');
  });

  it('should call case note usage', async () => {
    eliteApi.caseNoteUsageList.returns([
      {
        staffId: 234423,
        caseNoteType: 'KA',
        caseNoteSubType: 'KS',
        numCaseNotes: 4,
        latestCaseNote: '2018-07-02T15:03:47.337Z',
      },
    ]);

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO);

    expect(data.lastKeyWorkerSessionDate).equal('2018-07-02T15:03:47.337Z');
  });
});