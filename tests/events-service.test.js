/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const chai = require('chai');

const { expect } = chai;
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const moment = require('moment');

const { isoDateFormat } = require('./../server/constants');
const { eliteApiFactory } = require('../server/api/eliteApi');
const { eventsServiceFactory } = require('../server/services/events');
const nomisCodes = require('../server/data-mappers/nomis-codes');

const eliteApi = eliteApiFactory(null);
const eventsService = eventsServiceFactory(eliteApi);

describe('Events service', () => {
  let sandbox;
  const req = {
    bookingId: 1,
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(eliteApi, 'getEventsForThisWeek');
    sandbox.stub(eliteApi, 'getEventsForNextWeek');
    sandbox.stub(eliteApi, 'getAppointmentTypes');
    sandbox.stub(eliteApi, 'getLocationsForAppointments');
    sandbox.stub(eliteApi, 'getDetailsLight');

    eliteApi.getDetailsLight.returns({
      bookingId: 1,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('should call getScheduledEventsForThisWeek and return data with a slot for each day, for 7 days starting from today', async () => {
    eliteApi.getEventsForThisWeek.returns(null);

    const startDate = moment();
    const data = await eventsService.getScheduledEventsForThisWeek(req);

    expect(data.length).to.equal(7);

    expect(data[0].date.format(isoDateFormat)).to.equal(startDate.format(isoDateFormat));
    expect(data[1].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[2].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[3].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[4].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[5].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[6].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
  });

  it('should call getScheduledEventsForNextWeek and return data with a slot for each day, for 7 days starting from next week', async () => {
    eliteApi.getEventsForThisWeek.returns(null);

    const startDate = moment().add(7, 'days');
    const data = await eventsService.getScheduledEventsForNextWeek(req);

    expect(data.length).to.equal(7);
    expect(data[0].date.format(isoDateFormat)).to.equal(startDate.format(isoDateFormat));
    expect(data[1].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[2].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[3].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[4].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[5].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
    expect(data[6].date.format(isoDateFormat)).to.equal(startDate.add(1,'days').format(isoDateFormat));
  });


  it('should place events into the correct weekly calender slot', async () => {
    const today = moment().format(isoDateFormat);
    const threeDaysInTheFuture = moment().add(3,'days').format(isoDateFormat);

    eliteApi.getEventsForThisWeek.returns([
      {
        eventSourceeDesc: 'Workshop morning',
        startTime: '2017-12-12T09:00:00',
        endTime: '2017-12-12T10:00:00',
        eventStatus: nomisCodes.statusCodes.scheduled,
        eventDate: today,
      },
      {
        eventSourceeDesc: 'Workshop afternoon',
        startTime: '2017-12-12T13:00:00',
        endTime: '2017-12-12T14:00:00',
        eventStatus: nomisCodes.statusCodes.scheduled,
        eventDate: today,
      },

      {
        eventSourceeDesc: 'Workshop morning',
        startTime: '2017-12-12T09:00:00',
        endTime: '2017-12-12T10:00:00',
        eventStatus: nomisCodes.statusCodes.scheduled,
        eventDate: threeDaysInTheFuture,
      },
      {
        eventSourceeDesc: 'Workshop afternoon',
        startTime: '2017-12-12T13:00:00',
        endTime: '2017-12-12T14:00:00',
        eventStatus: nomisCodes.statusCodes.scheduled,
        eventDate: threeDaysInTheFuture,
      },
      {
        eventSourceeDesc: 'Workshop ed',
        startTime: '2017-12-12T17:00:00',
        endTime: '2017-12-1218:00:00',
        eventStatus: nomisCodes.statusCodes.scheduled,
        eventDate: threeDaysInTheFuture,
      },
    ]);

    const data = await eventsService.getScheduledEventsForThisWeek(req);

    expect(data[0].date.format(isoDateFormat)).to.equal(today);
    expect(data[0].morningActivities.length).to.equal(1);
    expect(data[0].morningActivities.length).to.equal(1);

    expect(data[3].date.format(isoDateFormat)).to.equal(threeDaysInTheFuture);
    expect(data[3].afternoonActivities.length).to.equal(1);
    expect(data[3].afternoonActivities.length).to.equal(1);
    expect(data[3].eveningDuties.length).to.equal(1);
  });

  it('should use eventSourceDesc to indicate the type for activities only', async () => {
    const today = moment().format('YYYY-MM-DD');
    eliteApi.getEventsForThisWeek.returns([
      {
        eventSubType: 'PA',
        eventSubTypeDesc: 'Prison Activity',
        eventSourceDesc: 'Wing cleaner',
        startTime: '2017-12-12T09:00:00',
        endTime: '2017-12-12T10:00:00',
        eventStatus: nomisCodes.statusCodes.scheduled,
        eventDate: today,
      },
    ]);

    const data = await eventsService.getScheduledEventsForThisWeek(req);
    expect(data[0].morningActivities[0].type).to.equal('Wing cleaner');
  });

  it('should use the eventSubTypeDesc when eventSourceDesc is missing', async () => {
    const today = moment().format('YYYY-MM-DD');
    eliteApi.getEventsForThisWeek.returns([
      {
        eventSubTypeDesc: 'Prison Activity',
        startTime: '2017-12-12T09:00:00',
        endTime: '2017-12-12T10:00:00',
        eventStatus: nomisCodes.statusCodes.scheduled,
        eventDate: today,
      },
    ]);

    const data = await eventsService.getScheduledEventsForThisWeek(req);
    expect(data[0].morningActivities[0].type).to.equal('Prison Activity');
  });


  it('should format the event with the following subTypeDesc - sourceTypeDesc ', async () => {
    const today = moment().format('YYYY-MM-DD');

    eliteApi.getEventsForThisWeek.returns([
      {
        eventType: 'NOT_PA',
        eventSubTypeDesc: 'appointment',
        eventSourceDesc: 'health check up',
        startTime: '2017-12-12T09:00:00',
        endTime: '2017-12-12T10:00:00',
        eventStatus: nomisCodes.statusCodes.scheduled,
        eventDate: today,
      },
    ]);

    const data = await eventsService.getScheduledEventsForThisWeek(req);

    expect(data[0].morningActivities[0].type).to.equal('appointment');
    expect(data[0].morningActivities[0].comment).to.equal('health check up');
  });

  it('should show use eventSourceDesc for an activities type', async () => {
    const today = moment().format('YYYY-MM-DD');

    eliteApi.getEventsForThisWeek.returns([
      {
        eventType: 'NOT_PA',
        eventSubTypeDesc: 'appointment',
        eventSourceDesc: 'health check up',
        startTime: '2017-12-12T09:00:00',
        endTime: '2017-12-12T10:00:00',
        eventStatus: nomisCodes.statusCodes.scheduled,
        eventDate: today,
      },
    ]);

    const data = await eventsService.getScheduledEventsForThisWeek(req);

    expect(data[0].morningActivities[0].type).to.equal('appointment');
    expect(data[0].morningActivities[0].comment).to.equal('health check up');
  });

  it('should order events by start time then by end time', async () => {
    const today = moment().format('YYYY-MM-DD');

    eliteApi.getEventsForThisWeek.returns([
      {
        eventType: 'NOT_PA',
        eventSubTypeDesc: 'appointment',
        eventSourceDesc: 'health check up',
        startTime: '2017-12-12T09:00:00',
        endTime: '2017-12-12T11:30:00',
        eventStatus: nomisCodes.statusCodes.scheduled,
        eventDate: today,
      },
      {
        eventType: 'NOT_PA',
        eventSubTypeDesc: 'appointment',
        eventSourceDesc: 'health check up',
        startTime: '2017-12-12T09:00:00',
        endTime: null,
        eventStatus: nomisCodes.statusCodes.scheduled,
        eventDate: today,
      },
      {
        eventType: 'NOT_PA',
        eventSubTypeDesc: 'appointment',
        eventSourceDesc: 'health check up',
        startTime: '2017-12-12T09:00:00',
        endTime: '2017-12-12T10:00:00',
        eventStatus: nomisCodes.statusCodes.scheduled,
        eventDate: today,
      },
    ]);

    const data = await eventsService.getScheduledEventsForThisWeek(req);

    expect(data[0].morningActivities[0].startTime).to.equal('2017-12-12T09:00:00');
    expect(data[0].morningActivities[0].endTime).to.equal(null);

    expect(data[0].morningActivities[1].startTime).to.equal('2017-12-12T09:00:00');
    expect(data[0].morningActivities[1].endTime).to.equal('2017-12-12T10:00:00');

    expect(data[0].morningActivities[2].startTime).to.equal('2017-12-12T09:00:00');
    expect(data[0].morningActivities[2].endTime).to.equal('2017-12-12T11:30:00');
  });

  it('should call getAppointmentsViewModel', async () => {
    eliteApi.getLocationsForAppointments.returns([
      {
        locationId: -26,
        description: 'LEI-CARP',
        livingUnit: false,
        usageLocationId: 19908,
        usageLocationType: 'APP',
      },
    ]);

    eliteApi.getAppointmentTypes.returns([
      {
        code: 'CABA',
        description: 'Bail',
      },
    ]);

    const data = await eventsService.getAppointmentViewModel(req);
    expect(data.locations.length).to.equal(1);
    expect(data.appointmentTypes.length).to.equal(1);

    expect(eliteApi.getLocationsForAppointments).to.be.called;
    expect(eliteApi.getAppointmentTypes).to.be.called;

    expect(data.locations[0].locationId).to.equal(-26);
    expect(data.locations[0].description).to.equal('LEI-CARP');

    expect(data.appointmentTypes[0].code).to.equal('CABA');
    expect(data.appointmentTypes[0].description).to.equal('Bail');
  });

  it('should use userDescription where possible and description as a fallback', async () => {
    eliteApi.getLocationsForAppointments.returns([
      {
        locationId: -26,
        description: 'LEI-CARP',
        userDescription: 'Leeds',
        livingUnit: false,
        usageLocationId: 19908,
        usageLocationType: 'APP',
      },
      {
        locationId: -26,
        description: 'Yrk',
        livingUnit: false,
        usageLocationId: 19908,
        usageLocationType: 'APP',
      },
    ]);

    const data = await eventsService.getAppointmentViewModel(req);

    expect(data.locations[0].description).to.equal('Leeds');
    expect(data.locations[1].description).to.equal('Yrk');
  });

  it('should sort locations alphabetically', async () => {
    eliteApi.getLocationsForAppointments.returns([
      {
        locationId: -26,
        description: 'Yrk',
        livingUnit: false,
        usageLocationId: 19908,
        usageLocationType: 'APP',
      },
      {
        locationId: -26,
        description: 'LEI-CARP',
        userDescription: 'Leeds',
        livingUnit: false,
        usageLocationId: 19908,
        usageLocationType: 'APP',
      },
    ]);

    const data = await eventsService.getAppointmentViewModel(req);

    expect(data.locations[0].description).to.equal('Leeds');
    expect(data.locations[1].description).to.equal('Yrk');
  });

  it('show only scheduled appointments and activity', async () => {
    const today = moment().format(isoDateFormat);

    eliteApi.getEventsForThisWeek.returns([
      {
        eventSubTypeDesc: 'activity 1',
        startTime: '2017-12-12T09:00:00',
        endTime: '2017-12-12T10:00:00',
        eventStatus: nomisCodes.statusCodes.scheduled,
        eventDate: today,
        eventType: nomisCodes.eventTypes.activity,
      },
      {
        eventSubTypeDesc: 'activity 2',
        startTime: '2017-12-12T13:00:00',
        endTime: '2017-12-12T14:00:00',
        eventStatus: nomisCodes.statusCodes.cancelled,
        eventDate: today,
        eventType: nomisCodes.eventTypes.activity,
      },
      {
        eventSubTypeDesc: 'appointment 1',
        startTime: '2017-12-12T09:00:00',
        endTime: '2017-12-12T10:00:00',
        eventStatus: nomisCodes.statusCodes.scheduled,
        eventDate: today,
        eventType: nomisCodes.eventTypes.appointment,
      },
      {
        eventSubTypeDesc: 'appointment 2',
        startTime: '2017-12-12T13:00:00',
        endTime: '2017-12-12T14:00:00',
        eventStatus: nomisCodes.statusCodes.cancelled,
        eventDate: today,
        eventType: nomisCodes.eventTypes.appointment,
      },
    ]);

    const data = await eventsService.getScheduledEventsForThisWeek(req);

    expect(data[0].morningActivities.length).to.equal(2);
    expect(data[0].morningActivities[0].type).to.equal('activity 1');
    expect(data[0].morningActivities[1].type).to.equal('appointment 1');
  });

  it('should show scheduled and cancelled visits', async () => {
    const today = moment().format(isoDateFormat);

    eliteApi.getEventsForThisWeek.returns([
      {
        eventSubTypeDesc: 'visit 1',
        startTime: '2017-12-12T09:00:00',
        endTime: '2017-12-12T10:00:00',
        eventStatus: nomisCodes.statusCodes.scheduled,
        eventDate: today,
        eventType: nomisCodes.eventTypes.visit,
      },
      {
        eventSubTypeDesc: 'visit 2',
        startTime: '2017-12-12T09:00:00',
        endTime: '2017-12-12T10:00:00',
        eventStatus: nomisCodes.statusCodes.cancelled,
        eventDate: today,
        eventType: nomisCodes.eventTypes.visit,
      },

    ]);

    const data = await eventsService.getScheduledEventsForThisWeek(req);

    expect(data[0].morningActivities.length).to.equal(2);
    expect(data[0].morningActivities[0].type).to.equal('visit 1');
    expect(data[0].morningActivities[1].type).to.equal('visit 2');
  })
});