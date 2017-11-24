const sinon = require('sinon');
const chai = require('chai'),
  expect = chai.expect;
const sinonChai = require('sinon-chai');
const moment = require('moment');

const isoDateFormat = require('./../server/constants').isoDateFormat;
const elite2Api = require('../server/elite2Api');
const bookingService = require('../server/services/booking');

chai.use(sinonChai);

describe('Booking service appointments', () => {
  let sandbox;
  const req = {
    params: {
      bookingId: 1,
    },
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(elite2Api, 'getAppointmentsForThisWeek');
    sandbox.stub(elite2Api, 'getAppointmentsForNextWeek');
  });

  afterEach(() => {
    sandbox.restore()
  });

  it('should call getAppointments and return data with a slot for each day, for 7 days starting from today', async () => {
    elite2Api.getAppointmentsForThisWeek.returns(null);

    const startDate = moment();
    const data = await bookingService.getScheduledActivitiesForThisWeek(req);

    expect(data.length).to.equal(7);

    expect(data[0].date.format(isoDateFormat)).to.equal(startDate.format(isoDateFormat));
    expect(data[1].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[2].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[3].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[4].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[5].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[6].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
  });

  it('should call getAppointments and return data with a slot for each day, for 7 days starting from next week', async () => {
    elite2Api.getAppointmentsForThisWeek.returns(null);

    const startDate = moment().add('days', 7);
    const data = await bookingService.getScheduledActivitiesForNextWeek(req);

    expect(data.length).to.equal(7);
    expect(data[0].date.format(isoDateFormat)).to.equal(startDate.format(isoDateFormat));
    expect(data[1].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[2].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[3].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[4].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[5].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[6].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
  });

  it('should place appointments into the correct weekly calender slot', async () => {
    const today = moment();
    const threeDaysInTheFuture = moment().add(3,'days');

    elite2Api.getAppointmentsForThisWeek.returns([
      {
        eventSubTypeDesc: 'Workshop morning',
        startTime: '2017-12-12T09:00:00',
        endTime: '2017-12-12T10:00:00',
        eventDate: today,
      },
      {
        eventSubTypeDesc: 'Workshop afternoon',
        startTime: '2017-12-12T19:00:00',
        endTime: '2017-12-12T20:00:00',
        eventDate: today,
      },

      {
        eventSubTypeDesc: 'Workshop morning',
        startTime: '2017-12-12T09:00:00',
        endTime: '2017-12-12T10:00:00',
        eventDate: threeDaysInTheFuture,
      },
      {
        eventSubTypeDesc: 'Workshop afternoon',
        startTime: '2017-12-12T19:00:00',
        endTime: '2017-12-12T20:00:00',
        eventDate: threeDaysInTheFuture,
      },
    ]);

    const data = await bookingService.getScheduledActivitiesForThisWeek(req);

    expect(data[0].date.format(isoDateFormat)).to.equal(today.format(isoDateFormat));
    expect(data[0].forMorning.length).to.equal(1);
    expect(data[0].forAfternoon.length).to.equal(1);

    expect(data[3].date.format(isoDateFormat)).to.equal(threeDaysInTheFuture.format(isoDateFormat));
    expect(data[3].forMorning.length).to.equal(1);
    expect(data[3].forAfternoon.length).to.equal(1);
  });
});