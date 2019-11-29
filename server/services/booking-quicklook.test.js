const moment = require('moment')
const momentTimeZone = require('moment-timezone')
const { isoDateFormat } = require('../constants')
const { isoDateTimeFormat } = require('../constants')

const { bookingServiceFactory } = require('./booking')

const eliteApi = {}
const keyworkerApi = {}
const allocationManagerApi = {}
const bookingService = bookingServiceFactory(eliteApi, keyworkerApi, allocationManagerApi)

describe('Booking Service Quick look', () => {
  const OFFENDER_NO = 'AA0000AE'

  beforeEach(() => {
    eliteApi.getBalances = jest.fn().mockReturnValue(null)
    eliteApi.getMainOffence = jest.fn().mockReturnValue(null)
    eliteApi.getEventsForToday = jest.fn().mockReturnValue([])
    eliteApi.getPositiveCaseNotes = jest.fn().mockReturnValue(null)
    eliteApi.getNegativeCaseNotes = jest.fn().mockReturnValue(null)
    eliteApi.getSentenceDetail = jest.fn().mockReturnValue(null)
    eliteApi.getContacts = jest.fn().mockReturnValue(null)
    eliteApi.getLastVisit = jest.fn().mockReturnValue(null)
    eliteApi.getRelationships = jest.fn().mockReturnValue(null)
    eliteApi.getNextVisit = jest.fn().mockReturnValue(null)
    eliteApi.getAdjudications = jest.fn().mockReturnValue({
      awards: [],
    })
    eliteApi.getDetailsLight = jest.fn().mockReturnValue({
      bookingId: 1,
    })
    eliteApi.caseNoteUsageList = jest.fn().mockReturnValue([])
    allocationManagerApi.getPomByOffenderNo = jest.fn().mockReturnValue({})
  })

  it('should call getBalance', async () => {
    const balance = {
      spends: 10,
      cash: 20,
      savings: 100,
      currency: 'GBP',
    }

    eliteApi.getBalances.mockReturnValue(balance)

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    expect(eliteApi.getBalances).toBeCalled()

    expect(data.balance.spends).toEqual(10)
    expect(data.balance.cash).toEqual(20)
    expect(data.balance.savings).toEqual(100)
    expect(data.balance.currency).toEqual('GBP')
  })

  it('should call getMainOffence', async () => {
    eliteApi.getMainOffence.mockReturnValue([
      {
        bookingId: 1,
        offenceDescription: 'basic',
      },
    ])

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    expect(eliteApi.getMainOffence).toBeCalled()

    expect(data.offences[0].type).toEqual('basic')
  })

  it('should call getEventsForToday', async () => {
    eliteApi.getEventsForToday.mockReturnValue([
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
    ])

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    expect(eliteApi.getEventsForToday).toBeCalled()

    expect(data.activities.morningActivities.length).toEqual(1)
    expect(data.activities.afternoonActivities.length).toEqual(1)

    expect(data.activities.morningActivities[0].type).toEqual('workshop 1')
    expect(data.activities.morningActivities[0].startTime).toEqual('2017-01-01T10:41:10.572')
    expect(data.activities.morningActivities[0].endTime).toEqual('2017-01-01T10:41:10.572')

    expect(data.activities.afternoonActivities[0].type).toEqual('workshop 2')
    expect(data.activities.afternoonActivities[0].startTime).toEqual('2017-01-01T12:41:10.572')
    expect(data.activities.afternoonActivities[0].endTime).toEqual('2017-01-01T15:41:10.572')

    expect(data.activities.eveningDuties[0].type).toEqual('workshop 3')
    expect(data.activities.eveningDuties[0].startTime).toEqual('2017-01-01T17:41:10.572')
    expect(data.activities.eveningDuties[0].endTime).toEqual('2017-01-01T17:41:10.572')
  })

  it('should call getPositiveCaseNotes', async () => {
    eliteApi.getPositiveCaseNotes.mockReturnValue({
      count: 1,
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    expect(eliteApi.getPositiveCaseNotes).toBeCalled()

    expect(data.positiveCaseNotes).toEqual(1)
  })

  it('should call getNegativeCaseNotes', async () => {
    eliteApi.getNegativeCaseNotes.mockReturnValue({
      count: 1,
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    expect(eliteApi.getNegativeCaseNotes).toBeCalled()

    expect(data.negativeCaseNotes).toEqual(1)
  })

  it('should call getPositiveCaseNotes with iso format and fromDate three months in the past', async () => {
    await bookingService.getQuickLookViewModel({}, OFFENDER_NO)
    const { fromDate, toDate } = eliteApi.getPositiveCaseNotes.mock.calls[0][0]

    const threeMonthsInThePast = moment()
      .subtract(3, 'months')
      .format(isoDateFormat)
    const today = moment().format(isoDateFormat)

    expect(fromDate).toEqual(threeMonthsInThePast)
    expect(toDate).toEqual(today)
  })

  it('should call getNegativeCaseNotes with iso format and fromDate three months in the past', async () => {
    await bookingService.getQuickLookViewModel({}, OFFENDER_NO)
    const { fromDate, toDate } = eliteApi.getNegativeCaseNotes.mock.calls[0][0]

    const threeMonthsInThePast = moment()
      .subtract(3, 'months')
      .format(isoDateFormat)
    const today = moment().format(isoDateFormat)

    expect(fromDate).toEqual(threeMonthsInThePast)
    expect(toDate).toEqual(today)
  })

  it('should call return an empty awards array and a proven count of zero when no data is returned', async () => {
    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    expect(data.adjudications.proven).toEqual(0)
    expect(data.adjudications.awards.length).toEqual(0)
  })

  it('should call getAdjudications and populate the response with proven adjudication count', async () => {
    eliteApi.getAdjudications.mockReturnValue({
      adjudicationCount: 2,
      awards: [{}, {}],
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    expect(data.adjudications.proven).toEqual(2)
  })

  it('should call getAdjudications and populate the response with filtered awards formatted with duration and description', async () => {
    eliteApi.getAdjudications.mockReturnValue({
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
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    const { awards } = data.adjudications

    expect(awards.length).toEqual(4)

    expect(awards[0].durationText).toEqual('10 months')
    expect(awards[0].sanctionCodeDescription).toEqual('comment 1')
    expect(awards[0].comment).toEqual('c1')

    expect(awards[1].durationText).toEqual('20 days')
    expect(awards[1].sanctionCodeDescription).toEqual('comment 2')
    expect(awards[1].comment).toEqual('c2')

    expect(awards[2].durationText).toEqual('1 month')
    expect(awards[2].sanctionCodeDescription).toEqual('comment 3')
    expect(awards[2].comment).toEqual('c3')

    expect(awards[3].durationText).toEqual('1 day')
    expect(awards[3].sanctionCodeDescription).toEqual('comment 4')
    expect(awards[3].comment).toEqual('c4')
  })

  it('should append the award description with a properly formatted level, like 50% stoppage of earnings', async () => {
    eliteApi.getAdjudications.mockReturnValue({
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
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)
    const { awards } = data.adjudications

    expect(awards[0].sanctionCodeDescription).toEqual('Stoppage of Earnings (50%)')
    expect(awards[1].sanctionCodeDescription).toEqual('Stoppage of Earnings (£50.00)')
    expect(awards[2].sanctionCodeDescription).toEqual('Stoppage of Earnings (50%)')
    expect(awards[3].sanctionCodeDescription).toEqual('Stoppage of Earnings (£50.00)')
  })

  it('should display months and days', async () => {
    eliteApi.getAdjudications.mockReturnValue({
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
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)
    const { awards } = data.adjudications

    expect(awards[0].durationText).toEqual('10 months and 2 days')
    expect(awards[1].durationText).toEqual('1 month and 1 day')
  })

  it('should call getContacts', async () => {
    eliteApi.getContacts.mockReturnValue({
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
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    expect(eliteApi.getContacts).toBeCalled()

    expect(data.nextOfKin.length).toEqual(1)
    expect(data.nextOfKin[0].firstName).toEqual('EVA')
    expect(data.nextOfKin[0].lastName).toEqual('BALOG')
    expect(data.nextOfKin[0].middleName).toEqual('GOLAB')
    expect(data.nextOfKin[0].relationship).toEqual('Sister')
    expect(data.nextOfKin[0].contactTypeDescription).toEqual('Social/Family')
  })

  it('should return an empty array when no contacts details are returned', async () => {
    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    expect(eliteApi.getContacts).toBeCalled()
    expect(data.nextOfKin.length).toEqual(0)
  })

  it('should return true for indeterminateReleaseDate when there is a tariff date but no release date', async () => {
    eliteApi.getSentenceDetail.mockReturnValue({
      tariffDate: '2017-01-01',
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    expect(eliteApi.getSentenceDetail).toBeCalled()
    expect(data.tariffDate).toEqual('2017-01-01')
    expect(data.indeterminateReleaseDate).toBe(true)
  })

  it('should return false for indeterminateReleaseDate when there is a release date and there is a tariff date', async () => {
    eliteApi.getSentenceDetail.mockReturnValue({
      releaseDate: '2016-12-12',
      tariffDate: '2017-01-01',
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    expect(eliteApi.getSentenceDetail).toBeCalled()
    expect(data.releaseDate).toEqual('2016-12-12')
    expect(data.tariffDate).toEqual('2017-01-01')
    expect(data.indeterminateReleaseDate).toBe(false)
  })

  it('should return false for indeterminateReleaseDate when there is a release date but there is no tariff date', async () => {
    eliteApi.getSentenceDetail.mockReturnValue({
      releaseDate: '2016-12-12',
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    expect(eliteApi.getSentenceDetail).toBeCalled()
    expect(data.releaseDate).toEqual('2016-12-12')
    expect(data.indeterminateReleaseDate).toBe(false)
  })

  it('should return false for indeterminateReleaseDate when there is neither a release date or a tariff date', async () => {
    eliteApi.getSentenceDetail.mockReturnValue({
      additionalDaysAwarded: 4,
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    expect(eliteApi.getSentenceDetail).toBeCalled()
    expect(data.indeterminateReleaseDate).toBe(false)
  })

  it('should only show attended, cancelled and ongoing', async () => {
    eliteApi.getLastVisit.mockReturnValue({
      eventStatusDescription: 'Expired',
      eventStatus: 'EXP',
      visitTypeDescription: 'Social Contact',
      leadVisitor: 'JOHN SMITH',
      relationshipDescription: 'Brother',
      startTime: '2017-12-22T10:00:00',
      endTime: '2017-12-22T12:00:00',
      cancelReasonDescription: 'All visits canceled',
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)
    expect(data.lastVisit).toEqual(null)
  })

  it('should only show an attended visit', async () => {
    eliteApi.getLastVisit.mockReturnValue({
      eventStatus: 'SCH',
      eventOutcome: 'ATT',
      eventOutcomeDescription: 'Attended',
      visitTypeDescription: 'Social Contact',
      leadVisitor: 'JOHN SMITH',
      relationshipDescription: 'Brother',
      startTime: '2017-12-22T10:00:00',
      endTime: '2017-12-22T12:00:00',
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)
    expect(data.lastVisit.status).toEqual('Attended')
  })

  it('should only show cancelled visit (status CANC)', async () => {
    eliteApi.getLastVisit.mockReturnValue({
      eventStatus: 'CANC',
      eventStatusDescription: 'Cancelled',
      visitTypeDescription: 'Social Contact',
      leadVisitor: 'JOHN SMITH',
      relationshipDescription: 'Brother',
      startTime: '2017-12-22T10:00:00',
      endTime: '2017-12-22T12:00:00',
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)
    expect(data.lastVisit.status).toEqual('Cancelled')
  })

  it('should ensure that event status "CANC" (Cancel) overrides the outcome status', async () => {
    eliteApi.getLastVisit.mockReturnValue({
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
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)
    expect(data.lastVisit.status).toEqual('Cancelled')
    expect(data.lastVisit.cancellationReason).toEqual('some reason')
  })

  it('should show a visit as ongoing when its currently in progress', async () => {
    const zone = 'Europe/London'
    const fiveMinutesAgo = momentTimeZone.tz(zone).subtract(5, 'minutes')
    const fiveMinutesTime = momentTimeZone.tz(zone).add(5, 'minutes')

    eliteApi.getLastVisit.mockReturnValue({
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
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    expect(data.lastVisit.status).toEqual('Ongoing')
  })

  it('should show an attended visit even though its currently expired', async () => {
    eliteApi.getLastVisit.mockReturnValue({
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
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)
    expect(data.lastVisit.status).toEqual('Attended')
  })

  it('should show lead visitor name in title case with relationship description after in parentheses', async () => {
    eliteApi.getLastVisit.mockReturnValue({
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
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)
    expect(data.lastVisit.leadVisitor).toEqual('John Smith (Father)')
  })

  it('should not show any text after lead visitor name if no relationship description in API response', async () => {
    eliteApi.getLastVisit.mockReturnValue({
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
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)
    expect(data.lastVisit.leadVisitor).toEqual('John Smith')
  })

  it('should call getRelationships', async () => {
    eliteApi.getRelationships.mockReturnValue([
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
      },
    ])

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    expect(data.assignedStaffMembers.communityOffenderManager.firstName).toEqual('Dom3')
    expect(data.assignedStaffMembers.communityOffenderManager.lastName).toEqual('Bull')
  })

  it('should retun prison allocation managers', async () => {
    allocationManagerApi.getPomByOffenderNo.mockReturnValue({
      primary_pom: {
        staff_id: 1,
        name: 'POM, PRIMARY',
      },
      secondary_pom: {
        staff_id: 2,
        name: 'POM, SECONDARY',
      },
    })

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    expect(data.assignedStaffMembers.prisonOffenderManager.firstName).toEqual('Primary')
    expect(data.assignedStaffMembers.prisonOffenderManager.lastName).toEqual('Pom')

    expect(data.assignedStaffMembers.coworkingPrisonOffenderManager.firstName).toEqual('Secondary')
    expect(data.assignedStaffMembers.coworkingPrisonOffenderManager.lastName).toEqual('Pom')
  })

  it('should call case note usage', async () => {
    eliteApi.caseNoteUsageList.mockReturnValue([
      {
        staffId: 234423,
        caseNoteType: 'KA',
        caseNoteSubType: 'KS',
        numCaseNotes: 4,
        latestCaseNote: '2018-07-02T15:03:47.337Z',
      },
    ])

    const data = await bookingService.getQuickLookViewModel({}, OFFENDER_NO)

    expect(data.lastKeyWorkerSessionDate).toEqual('2018-07-02T15:03:47.337Z')
  })
})
