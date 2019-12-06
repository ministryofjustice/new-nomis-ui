/* eslint-disable no-unused-expressions */
const sinon = require('sinon')
const chai = require('chai')

const { expect } = chai
const sinonChai = require('sinon-chai')

chai.use(sinonChai)

const moment = require('moment')

const { isoDateFormat } = require('./../server/constants')
const { eliteApiFactory } = require('../server/api/eliteApi')
const { eventsServiceFactory } = require('../server/services/events')
const nomisCodes = require('../server/data-mappers/nomis-codes')

const eliteApi = eliteApiFactory(null)
const eventsService = eventsServiceFactory(eliteApi)

describe('Events service', () => {
  let sandbox
  const req = {
    bookingId: 1,
  }

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    sandbox.stub(eliteApi, 'getEventsForThisWeek')
    sandbox.stub(eliteApi, 'getEventsForNextWeek')
    sandbox.stub(eliteApi, 'getAppointmentTypes')
    sandbox.stub(eliteApi, 'getLocationsForAppointments')
    sandbox.stub(eliteApi, 'getDetailsLight')

    eliteApi.getDetailsLight.returns({
      bookingId: 1,
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should call getScheduledEventsForThisWeek and return data with a slot for each day, for 7 days starting from today', async () => {
    eliteApi.getEventsForThisWeek.returns(null)

    const startDate = moment()
    const data = await eventsService.getScheduledEventsForThisWeek(req)

    expect(data.length).to.equal(7)

    expect(data[0].date.format(isoDateFormat)).to.equal(startDate.format(isoDateFormat))
    expect(data[1].date.format(isoDateFormat)).to.equal(startDate.add(1, 'days').format(isoDateFormat))
    expect(data[2].date.format(isoDateFormat)).to.equal(startDate.add(1, 'days').format(isoDateFormat))
    expect(data[3].date.format(isoDateFormat)).to.equal(startDate.add(1, 'days').format(isoDateFormat))
    expect(data[4].date.format(isoDateFormat)).to.equal(startDate.add(1, 'days').format(isoDateFormat))
    expect(data[5].date.format(isoDateFormat)).to.equal(startDate.add(1, 'days').format(isoDateFormat))
    expect(data[6].date.format(isoDateFormat)).to.equal(startDate.add(1, 'days').format(isoDateFormat))
  })

  it('should call getScheduledEventsForNextWeek and return data with a slot for each day, for 7 days starting from next week', async () => {
    eliteApi.getEventsForThisWeek.returns(null)

    const startDate = moment().add(7, 'days')
    const data = await eventsService.getScheduledEventsForNextWeek(req)

    expect(data.length).to.equal(7)
    expect(data[0].date.format(isoDateFormat)).to.equal(startDate.format(isoDateFormat))
    expect(data[1].date.format(isoDateFormat)).to.equal(startDate.add(1, 'days').format(isoDateFormat))
    expect(data[2].date.format(isoDateFormat)).to.equal(startDate.add(1, 'days').format(isoDateFormat))
    expect(data[3].date.format(isoDateFormat)).to.equal(startDate.add(1, 'days').format(isoDateFormat))
    expect(data[4].date.format(isoDateFormat)).to.equal(startDate.add(1, 'days').format(isoDateFormat))
    expect(data[5].date.format(isoDateFormat)).to.equal(startDate.add(1, 'days').format(isoDateFormat))
    expect(data[6].date.format(isoDateFormat)).to.equal(startDate.add(1, 'days').format(isoDateFormat))
  })

  it('should place events into the correct weekly calender slot', async () => {
    const today = moment().format(isoDateFormat)
    const threeDaysInTheFuture = moment()
      .add(3, 'days')
      .format(isoDateFormat)

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
    ])

    const data = await eventsService.getScheduledEventsForThisWeek(req)

    expect(data[0].date.format(isoDateFormat)).to.equal(today)
    expect(data[0].morningActivities.length).to.equal(1)
    expect(data[0].morningActivities.length).to.equal(1)

    expect(data[3].date.format(isoDateFormat)).to.equal(threeDaysInTheFuture)
    expect(data[3].afternoonActivities.length).to.equal(1)
    expect(data[3].afternoonActivities.length).to.equal(1)
    expect(data[3].eveningDuties.length).to.equal(1)
  })

  it('should use eventSourceDesc to indicate the type for activities only', async () => {
    const today = moment().format('YYYY-MM-DD')
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
    ])

    const data = await eventsService.getScheduledEventsForThisWeek(req)
    expect(data[0].morningActivities[0].type).to.equal('Wing cleaner')
  })

  it('should use the eventSubTypeDesc when eventSourceDesc is missing', async () => {
    const today = moment().format('YYYY-MM-DD')
    eliteApi.getEventsForThisWeek.returns([
      {
        eventSubTypeDesc: 'Prison Activity',
        startTime: '2017-12-12T09:00:00',
        endTime: '2017-12-12T10:00:00',
        eventStatus: nomisCodes.statusCodes.scheduled,
        eventDate: today,
      },
    ])

    const data = await eventsService.getScheduledEventsForThisWeek(req)
    expect(data[0].morningActivities[0].type).to.equal('Prison Activity')
  })

  it('should format the event with the following subTypeDesc - sourceTypeDesc ', async () => {
    const today = moment().format('YYYY-MM-DD')

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
    ])

    const data = await eventsService.getScheduledEventsForThisWeek(req)

    expect(data[0].morningActivities[0].type).to.equal('appointment')
    expect(data[0].morningActivities[0].comment).to.equal('health check up')
  })

  it('should show use eventSourceDesc for an activities type', async () => {
    const today = moment().format('YYYY-MM-DD')

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
    ])

    const data = await eventsService.getScheduledEventsForThisWeek(req)

    expect(data[0].morningActivities[0].type).to.equal('appointment')
    expect(data[0].morningActivities[0].comment).to.equal('health check up')
  })

  it('should order events by start time then by end time', async () => {
    const today = moment().format('YYYY-MM-DD')

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
    ])

    const data = await eventsService.getScheduledEventsForThisWeek(req)

    expect(data[0].morningActivities[0].startTime).to.equal('2017-12-12T09:00:00')
    expect(data[0].morningActivities[0].endTime).to.equal(null)

    expect(data[0].morningActivities[1].startTime).to.equal('2017-12-12T09:00:00')
    expect(data[0].morningActivities[1].endTime).to.equal('2017-12-12T10:00:00')

    expect(data[0].morningActivities[2].startTime).to.equal('2017-12-12T09:00:00')
    expect(data[0].morningActivities[2].endTime).to.equal('2017-12-12T11:30:00')
  })

  it('should call getAppointmentsViewModel', async () => {
    eliteApi.getLocationsForAppointments.returns([
      {
        locationId: -26,
        description: 'LEI-CARP',
        livingUnit: false,
        usageLocationId: 19908,
        usageLocationType: 'APP',
      },
    ])

    eliteApi.getAppointmentTypes.returns([
      {
        code: 'CABA',
        description: 'Bail',
      },
    ])

    const data = await eventsService.getAppointmentViewModel(req)
    expect(data.locations.length).to.equal(1)
    expect(data.appointmentTypes.length).to.equal(1)

    expect(eliteApi.getLocationsForAppointments).to.be.called
    expect(eliteApi.getAppointmentTypes).to.be.called

    expect(data.locations[0].locationId).to.equal(-26)
    expect(data.locations[0].description).to.equal('LEI-CARP')

    expect(data.appointmentTypes[0].code).to.equal('CABA')
    expect(data.appointmentTypes[0].description).to.equal('Bail')
  })

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
    ])

    const data = await eventsService.getAppointmentViewModel(req)

    expect(data.locations[0].description).to.equal('Leeds')
    expect(data.locations[1].description).to.equal('Yrk')
  })

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
    ])

    const data = await eventsService.getAppointmentViewModel(req)

    expect(data.locations[0].description).to.equal('Leeds')
    expect(data.locations[1].description).to.equal('Yrk')
  })

  it('show all appointments and activities', async () => {
    const today = moment().format(isoDateFormat)

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
    ])

    const data = await eventsService.getScheduledEventsForThisWeek(req)

    expect(data[0].morningActivities.length).to.equal(2)
    expect(data[0].afternoonActivities.length).to.equal(2)
    expect(data[0].morningActivities[0].type).to.equal('activity 1')
    expect(data[0].morningActivities[1].type).to.equal('appointment 1')
  })

  it('should show scheduled and cancelled visits', async () => {
    const today = moment().format(isoDateFormat)

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
    ])

    const data = await eventsService.getScheduledEventsForThisWeek(req)

    expect(data[0].morningActivities.length).to.equal(2)
    expect(data[0].morningActivities[0].type).to.equal('visit 1')
    expect(data[0].morningActivities[1].type).to.equal('visit 2')
  })

  it('should build correctly structured dataset given calendar view and data', () => {
    const calendarView = [
      { date: moment('2019-12-05T15:01:13.183') },
      { date: moment('2019-12-06T15:01:13.183') },
      { date: moment('2019-12-07T15:01:13.184') },
      { date: moment('2019-12-08T15:01:13.184') },
      { date: moment('2019-12-09T15:01:13.184') },
      { date: moment('2019-12-10T15:01:13.184') },
      { date: moment('2019-12-11T15:01:13.184') },
    ]

    const data = [
      {
        bookingId: 1,
        eventClass: 'INT_MOV',
        eventStatus: 'SCH',
        eventType: 'APP',
        eventTypeDesc: 'Appointment',
        eventSubType: 'MEOT',
        eventSubTypeDesc: 'Medical - Other',
        eventDate: '2019-12-05',
        startTime: '2019-12-05T07:30:00',
        endTime: '2019-12-05T08:30:00',
        eventLocation: 'HEALTH CARE',
        eventSource: 'APP',
        eventSourceCode: 'APP',
        eventSourceDesc: 'IDST',
      },
      {
        bookingId: 1,
        eventClass: 'INT_MOV',
        eventId: 2,
        eventStatus: 'CANC',
        eventType: 'PRISON_ACT',
        eventTypeDesc: 'Prison Activities',
        eventSubType: 'PA',
        eventSubTypeDesc: 'Prison Activities',
        eventDate: '2019-12-05',
        startTime: '2019-12-05T08:15:00',
        endTime: '2019-12-05T11:50:00',
        eventLocation: 'KITCHEN - CLOSED UNTIL 30.7.2019',
        eventLocationId: 27002,
        eventSource: 'PA',
        eventSourceCode: 'KITCH-AM',
        eventSourceDesc: 'Kitchen Worker AM',
        eventOutcome: 'CANC',
        paid: false,
        payRate: 1.25,
        locationCode: 'KITCH',
      },
      {
        bookingId: 1,
        eventClass: 'INT_MOV',
        eventId: 3,
        eventStatus: 'SCH',
        eventType: 'PRISON_ACT',
        eventTypeDesc: 'Prison Activities',
        eventSubType: 'PA',
        eventSubTypeDesc: 'Prison Activities',
        eventDate: '2019-12-05',
        startTime: '2019-12-05T08:30:00',
        endTime: '2019-12-05T11:45:00',
        eventLocation: 'HOUSEBLOCK 1 WORKERS',
        eventLocationId: 721768,
        eventSource: 'PA',
        eventSourceCode: 'R1-PID AM',
        eventSourceDesc: 'R1 PID Worker AM',
        paid: false,
        payRate: 1.25,
        locationCode: 'WOW',
      },
      {
        bookingId: 1,
        eventClass: 'INT_MOV',
        eventId: 4,
        eventStatus: 'SCH',
        eventType: 'PRISON_ACT',
        eventTypeDesc: 'Prison Activities',
        eventSubType: 'PA',
        eventSubTypeDesc: 'Prison Activities',
        eventDate: '2019-12-05',
        startTime: '2019-12-05T08:30:00',
        endTime: '2019-12-05T11:45:00',
        eventLocation: 'HOUSEBLOCK 1 WORKERS',
        eventLocationId: 721768,
        eventSource: 'PA',
        eventSourceCode: 'HB1_CLN',
        eventSourceDesc: 'Cleaner HB1 AM',
        paid: false,
        payRate: 1.05,
        locationCode: 'WOW',
      },
      {
        bookingId: 1,
        eventClass: 'INT_MOV',
        eventId: 5,
        eventStatus: 'SCH',
        eventType: 'PRISON_ACT',
        eventTypeDesc: 'Prison Activities',
        eventSubType: 'PA',
        eventSubTypeDesc: 'Prison Activities',
        eventDate: '2019-12-05',
        startTime: '2019-12-05T13:15:00',
        endTime: '2019-12-05T16:15:00',
        eventLocation: 'HOUSEBLOCK 2 WORKERS',
        eventLocationId: 721767,
        eventSource: 'PA',
        eventSourceCode: 'HB2-CLN-PM',
        eventSourceDesc: 'Cleaner HB2 PM',
        paid: false,
        payRate: 1.05,
        locationCode: 'WOW',
      },
      {
        bookingId: 1,
        eventClass: 'INT_MOV',
        eventId: 4,
        eventStatus: 'EXP',
        eventType: 'PRISON_ACT',
        eventTypeDesc: 'Prison Activities',
        eventSubType: 'PA',
        eventSubTypeDesc: 'Prison Activities',
        eventDate: '2019-12-05',
        startTime: '2019-12-05T13:15:00',
        endTime: '2019-12-05T16:15:00',
        eventLocation: 'HOUSEBLOCK 2 WORKERS',
        eventLocationId: 721767,
        eventSource: 'PA',
        eventSourceCode: 'LAUND2PM',
        eventSourceDesc: 'HB2 Laundry PM',
        paid: false,
        payRate: 1.05,
        locationCode: 'WOW',
      },
      {
        bookingId: 1,
        eventClass: 'INT_MOV',
        eventId: 10,
        eventStatus: 'CANC',
        eventType: 'PRISON_ACT',
        eventTypeDesc: 'Prison Activities',
        eventSubType: 'PA',
        eventSubTypeDesc: 'Prison Activities',
        eventDate: '2019-12-05',
        startTime: '2019-12-05T13:15:00',
        endTime: '2019-12-05T16:15:00',
        eventLocation: 'HOUSEBLOCK 1 WORKERS',
        eventLocationId: 721768,
        eventSource: 'PA',
        eventSourceCode: 'R1-PID-PM',
        eventSourceDesc: 'R1 PID Worker PM',
        paid: false,
        payRate: 1.25,
        locationCode: 'WOW',
      },
    ]

    const expectedResult = [
      {
        afternoonActivities: [
          {
            cancelled: false,
            comment: null,
            endTime: '2019-12-05T16:15:00',
            eventStatus: 'SCH',
            shortComment: null,
            startTime: '2019-12-05T13:15:00',
            type: 'Cleaner HB2 PM',
          },
          {
            cancelled: false,
            comment: null,
            endTime: '2019-12-05T16:15:00',
            eventStatus: 'EXP',
            shortComment: null,
            startTime: '2019-12-05T13:15:00',
            type: 'HB2 Laundry PM',
          },
          {
            cancelled: true,
            comment: null,
            endTime: '2019-12-05T16:15:00',
            eventStatus: 'CANC',
            shortComment: null,
            startTime: '2019-12-05T13:15:00',
            type: 'R1 PID Worker PM',
          },
        ],
        date: moment('2019-12-05T15:01:13.183'),
        eveningDuties: [],
        morningActivities: [
          {
            cancelled: false,
            comment: 'IDST',
            endTime: '2019-12-05T08:30:00',
            eventStatus: 'SCH',
            shortComment: 'IDST',
            startTime: '2019-12-05T07:30:00',
            type: 'Medical - Other',
          },
          {
            cancelled: true,
            comment: null,
            endTime: '2019-12-05T11:50:00',
            eventStatus: 'CANC',
            shortComment: null,
            startTime: '2019-12-05T08:15:00',
            type: 'Kitchen Worker AM',
          },
          {
            cancelled: false,
            comment: null,
            endTime: '2019-12-05T11:45:00',
            eventStatus: 'SCH',
            shortComment: null,
            startTime: '2019-12-05T08:30:00',
            type: 'R1 PID Worker AM',
          },
          {
            cancelled: false,
            comment: null,
            endTime: '2019-12-05T11:45:00',
            eventStatus: 'SCH',
            shortComment: null,
            startTime: '2019-12-05T08:30:00',
            type: 'Cleaner HB1 AM',
          },
        ],
      },
      {
        afternoonActivities: [],
        date: moment('2019-12-06T15:01:13.183'),
        eveningDuties: [],
        morningActivities: [],
      },
      {
        afternoonActivities: [],
        date: moment('2019-12-07T15:01:13.184'),
        eveningDuties: [],
        morningActivities: [],
      },
      {
        afternoonActivities: [],
        date: moment('2019-12-08T15:01:13.184'),
        eveningDuties: [],
        morningActivities: [],
      },
      {
        afternoonActivities: [],
        date: moment('2019-12-09T15:01:13.184'),
        eveningDuties: [],
        morningActivities: [],
      },
      {
        afternoonActivities: [],
        date: moment('2019-12-10T15:01:13.184'),
        eveningDuties: [],
        morningActivities: [],
      },
      {
        afternoonActivities: [],
        date: moment('2019-12-11T15:01:13.184'),
        eveningDuties: [],
        morningActivities: [],
      },
    ]

    const result = eventsService.buildScheduledEvents(data, calendarView)
    expect(result).to.eql(expectedResult)
  })
})
