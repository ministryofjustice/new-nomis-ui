const { bookingServiceFactory } = require('./booking')

const eliteApi = {}
const keyworkerApi = {}
const allocationManagerApi = {}
const dataComplianceApi = {}
const pathfinderApi = {}
const bookingService = bookingServiceFactory(
  eliteApi,
  keyworkerApi,
  allocationManagerApi,
  dataComplianceApi,
  pathfinderApi
)

describe('Booking Service Booking details', () => {
  const offenderNo = 'A12345'

  beforeEach(() => {
    eliteApi.getKeyworker = jest.fn().mockReturnValue(Promise.resolve(null))
    eliteApi.getContacts = jest.fn().mockReturnValue(Promise.resolve(null))
    eliteApi.getIdentifiers = jest.fn().mockReturnValue(Promise.resolve(null))
    eliteApi.getDetailsLight = jest.fn().mockReturnValue(
      Promise.resolve({
        bookingId: 1,
      })
    )
    eliteApi.getDetails = jest.fn().mockReturnValue(
      Promise.resolve({
        csra: 'Standard',
        category: 'Cat B',
      })
    )
    eliteApi.getIepSummary = jest.fn().mockReturnValue(Promise.resolve({ iepLevel: null }))
    eliteApi.getCaseLoads = jest.fn().mockReturnValue(Promise.resolve([{ caseLoadId: 'LEI', currentlyActive: true }]))
    eliteApi.getAddresses = jest.fn().mockReturnValue(Promise.resolve([{ primary: true }, { primary: false }]))
    eliteApi.caseNoteUsageList = jest.fn().mockReturnValue(Promise.resolve([]))
    keyworkerApi.getKeyworkerByCaseloadAndOffenderNo = jest.fn().mockReturnValue(Promise.resolve({ firstName: 'John' }))
    dataComplianceApi.isOffenderRecordRetained = jest.fn().mockReturnValue(Promise.resolve(true))
    pathfinderApi.getPathfinderId = jest.fn().mockResolvedValue(1)
  })

  it('should call getDetails', async () => {
    const data = await bookingService.getBookingDetailsViewModel({}, offenderNo)
    expect(eliteApi.getDetails).toBeCalled()
    expect(data.csra).toEqual('Standard')
    expect(data.category).toEqual('Cat B')
  })

  it('should call getIepSummary', async () => {
    await bookingService.getBookingDetailsViewModel({}, offenderNo)
    expect(eliteApi.getIepSummary).toBeCalled()
  })

  it('should call getKeyworker', async () => {
    const data = await bookingService.getBookingDetailsViewModel({}, offenderNo)
    expect(keyworkerApi.getKeyworkerByCaseloadAndOffenderNo).toBeCalled()
    expect(data.keyworker.firstName).toEqual('John')
  })

  it('should call isOffenderRecordRetained', async () => {
    const data = await bookingService.getBookingDetailsViewModel({}, offenderNo)
    expect(dataComplianceApi.isOffenderRecordRetained).toBeCalled()
    expect(data.offenderRecordRetained).toBeTruthy()
  })

  it('should resolve offenderRecordRetained as null on error', async () => {
    dataComplianceApi.isOffenderRecordRetained = jest.fn().mockImplementation(() => {
      throw new Error()
    })

    const data = await bookingService.getBookingDetailsViewModel({}, offenderNo)
    expect(data.offenderRecordRetained).toBeNull()
  })

  it('it should call getAddresses', async () => {
    const data = await bookingService.getBookingDetailsViewModel({}, offenderNo)
    expect(eliteApi.getAddresses).toBeCalled()
    expect(data.primaryAddress.primary).toEqual(true)
    expect(data.primaryAddress.type).toEqual('PRESENT')
  })

  it('it should not error out if no addresses call getAddresses', async () => {
    eliteApi.getAddresses = jest.fn().mockReturnValue(Promise.resolve())
    const data = await bookingService.getBookingDetailsViewModel({}, offenderNo)
    expect(eliteApi.getAddresses).toBeCalled()
    expect(data.primaryAddress.type).toEqual('ABSENT')
  })

  it('should call get identifiers', async () => {
    const identifiers = [
      { type: 'PNC', value: '96/346527V' },
      { type: 'CRO', value: '51916/99A' },
    ]
    eliteApi.getIdentifiers.mockReturnValue(Promise.resolve(identifiers))

    const data = await bookingService.getBookingDetailsViewModel({}, offenderNo)

    expect(data.identifiers).toEqual(identifiers)
  })

  it('should call getContacts', async () => {
    eliteApi.getContacts.mockReturnValue(
      Promise.resolve({
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
    )

    const data = await bookingService.getBookingDetailsViewModel({}, offenderNo)
    expect(data.nextOfKin.length).toEqual(1)
    expect(data.nextOfKin[0].firstName).toEqual('EVA')
    expect(data.nextOfKin[0].lastName).toEqual('BALOG')
    expect(data.nextOfKin[0].middleName).toEqual('GOLAB')
    expect(data.nextOfKin[0].relationship).toEqual('Sister')
    expect(data.nextOfKin[0].contactTypeDescription).toEqual('Social/Family')
  })

  it('should return an empty array when no contacts details are returned', async () => {
    const data = await bookingService.getBookingDetailsViewModel({}, offenderNo)

    expect(eliteApi.getContacts).toBeCalled()
    expect(data.nextOfKin.length).toEqual(0)
  })

  it('should call case note usage', async () => {
    eliteApi.caseNoteUsageList.mockReturnValue(
      Promise.resolve([
        {
          staffId: 234423,
          caseNoteType: 'KA',
          caseNoteSubType: 'KS',
          numCaseNotes: 4,
          latestCaseNote: '2018-07-02T15:03:47.337Z',
        },
      ])
    )

    const data = await bookingService.getBookingDetailsViewModel({}, offenderNo)

    expect(data.lastKeyWorkerSessionDate).toEqual('2018-07-02T15:03:47.337Z')
  })

  it('should call getPathfinderId', async () => {
    const data = await bookingService.getBookingDetailsViewModel({}, offenderNo)
    expect(pathfinderApi.getPathfinderId).toBeCalledTimes(1)
    expect(data.pathfinderId).toEqual(1)
  })
})
