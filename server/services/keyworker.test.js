const { keyworkerServiceFactory } = require('./keyworker')

const eliteApi = {}
const oauthApi = {}
const keyworkerApi = {}
const service = keyworkerServiceFactory(eliteApi, oauthApi, keyworkerApi)

const context = {}

describe('Key worker service', () => {
  beforeEach(() => {
    eliteApi.getCaseLoads = jest.fn()
    eliteApi.getSummaryForOffenders = jest.fn()
    eliteApi.getAssignedOffenders = jest.fn()
    eliteApi.getOffendersSentenceDates = jest.fn()
    eliteApi.caseNoteUsageList = jest.fn()

    oauthApi.getMyInformation = jest.fn()

    keyworkerApi.getKeyworkerByStaffIdAndPrisonId = jest.fn()
    keyworkerApi.getPrisonMigrationStatus = jest.fn()
    keyworkerApi.getAssignedOffenders = jest.fn()

    eliteApi.getCaseLoads.mockReturnValue([
      {
        caseLoadId: 'LEI',
        currentlyActive: true,
      },
    ])
    oauthApi.getMyInformation.mockReturnValue({ staffId: 1 })
  })

  it('should attempt to check the migration status if the keyworker url has been set', async () => {
    keyworkerApi.getPrisonMigrationStatus.mockReturnValue({
      migrated: true,
    })

    await service.getAssignedOffenders(context, 12345, 'LEI')

    expect(keyworkerApi.getPrisonMigrationStatus).toBeCalledWith(context, 'LEI')
    expect(eliteApi.getAssignedOffenders).not.toBeCalled()
  })

  it('should request assigned offender numbers from the keyworker server, then request the offender details from the elite2Api', async () => {
    keyworkerApi.getPrisonMigrationStatus.mockReturnValue({ migrated: true })
    keyworkerApi.getAssignedOffenders.mockReturnValue([{ offenderNo: 'A1' }, { offenderNo: 'A2' }])

    await service.getAssignedOffenders(context)

    expect(eliteApi.getSummaryForOffenders(context, ['A1', 'A2']))
    expect(eliteApi.getAssignedOffenders).not.toBeCalled()
  })

  it('should fall back to the elite2Api when the keyworker data has not been migrated', async () => {
    keyworkerApi.getPrisonMigrationStatus.mockReturnValue({
      migrated: false,
    })

    await service.getAssignedOffenders(context)

    expect(eliteApi.getAssignedOffenders).toBeCalled()
  })

  it('should not attempt to request offender details from elite2Api when there is no offenders assigned', async () => {
    keyworkerApi.getPrisonMigrationStatus.mockReturnValue({
      migrated: true,
    })

    keyworkerApi.getAssignedOffenders.mockReturnValue([])

    const offenders = await service.getAssignedOffenders(context)

    expect(eliteApi.getSummaryForOffenders).not.toBeCalled()

    expect(offenders.length).toEqual(0)
  })

  it('should call getKeyworkerByStaffIdAndPrisonId with the correct staffId and agencyId', async () => {
    keyworkerApi.getPrisonMigrationStatus.mockReturnValue({
      migrated: true,
    })
    await service.myAllocationsViewModel(context)
    expect(keyworkerApi.getKeyworkerByStaffIdAndPrisonId).toBeCalledWith(context, 1, 'LEI')
  })

  it('should call offender-sentence with the correct offender numbers', async () => {
    const offenders = [{ offenderNo: 'A1' }, { offenderNo: 'A2' }]
    keyworkerApi.getPrisonMigrationStatus.mockReturnValue({ migrated: true })
    keyworkerApi.getAssignedOffenders.mockReturnValue(offenders)
    eliteApi.getSummaryForOffenders.mockReturnValue(offenders)
    eliteApi.caseNoteUsageList.mockReturnValue(offenders)

    await service.myAllocationsViewModel(context)

    expect(eliteApi.getOffendersSentenceDates).toBeCalledWith(context, ['A1', 'A2'])
  })

  it('should call case note usage with the correct booking IDs', async () => {
    const offenders = [{ offenderNo: 'A1' }, { offenderNo: 'A2' }]
    const offendersBookingIds = [{ bookingId: 1 }, { bookingId: 2 }]
    keyworkerApi.getPrisonMigrationStatus.mockReturnValue({ migrated: true })
    keyworkerApi.getAssignedOffenders.mockReturnValue(offenders)
    eliteApi.getSummaryForOffenders.mockReturnValue(offendersBookingIds)
    eliteApi.caseNoteUsageList.mockReturnValue(offendersBookingIds)

    await service.myAllocationsViewModel(context)

    expect(eliteApi.caseNoteUsageList).toBeCalledWith(context, [1, 2])
  })

  it('should produce a view model that contains a key workers capacity and allocations merged with assessment and sentence information', async () => {
    const offenders = [
      { offenderNo: 'A1', bookingId: 1 },
      { offenderNo: 'A2', bookingId: 2 },
    ]
    const sentenceDates = [
      { offenderNo: 'A1', sentenceDetail: { conditionalReleaseDate: '20/10/2020' } },
      { offenderNo: 'A2', sentenceDetail: { conditionalReleaseDate: '21/10/2020' } },
    ]
    const kwDates = [
      { bookingId: 1, latestCaseNote: '04/06/2018' },
      { bookingId: 2, latestCaseNote: '01/06/2018' },
    ]

    keyworkerApi.getPrisonMigrationStatus.mockReturnValue({ migrated: true })
    keyworkerApi.getKeyworkerByStaffIdAndPrisonId.mockReturnValue({
      capacity: 15,
    })
    keyworkerApi.getAssignedOffenders.mockReturnValue(offenders)
    eliteApi.getSummaryForOffenders.mockReturnValue(offenders)

    eliteApi.getOffendersSentenceDates.mockReturnValue(sentenceDates)
    eliteApi.caseNoteUsageList.mockReturnValue(kwDates)

    const expected = {
      capacity: 15,
      allocations: [
        {
          offenderNo: 'A1',
          bookingId: 1,
          conditionalReleaseDate: '20/10/2020',
          lastKeyWorkerSessionDate: '04/06/2018',
        },
        {
          offenderNo: 'A2',
          bookingId: 2,
          conditionalReleaseDate: '21/10/2020',
          lastKeyWorkerSessionDate: '01/06/2018',
        },
      ],
    }

    const result = await service.myAllocationsViewModel(context)

    expect(result).toEqual(expected)
  })
})
