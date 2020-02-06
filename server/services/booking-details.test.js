const { bookingServiceFactory } = require('./booking')

const eliteApi = {}
const keyworkerApi = {}
const allocationManagerApi = {}
const bookingService = bookingServiceFactory(eliteApi, keyworkerApi, allocationManagerApi)

describe('Booking Service Booking details', () => {
  const offenderNo = 'A12345'

  beforeEach(() => {
    eliteApi.getKeyworker = jest.fn()
    eliteApi.getContacts = jest.fn()
    eliteApi.getIdentifiers = jest.fn()
    eliteApi.getDetailsLight = jest.fn().mockReturnValue({
      bookingId: 1,
    })
    eliteApi.getDetails = jest.fn().mockReturnValue({
      csra: 'Standard',
      category: 'Cat B',
    })
    eliteApi.getIepSummary = jest.fn().mockReturnValue({ iepLevel: null })
    eliteApi.getCaseLoads = jest.fn().mockReturnValue([{ caseLoadId: 'LEI', currentlyActive: true }])
    eliteApi.getAddresses = jest.fn().mockReturnValue([{ primary: true }, { primary: false }])
    keyworkerApi.getKeyworkerByCaseloadAndOffenderNo = jest.fn().mockReturnValue({ firstName: 'John' })
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

  it('it should call getKeyworker', async () => {
    const data = await bookingService.getBookingDetailsViewModel({}, offenderNo)
    expect(keyworkerApi.getKeyworkerByCaseloadAndOffenderNo).toBeCalled()
    expect(data.keyworker.firstName).toEqual('John')
  })

  it('it should call getAddresses', async () => {
    const data = await bookingService.getBookingDetailsViewModel({}, offenderNo)
    expect(eliteApi.getAddresses).toBeCalled()
    expect(data.primaryAddress.primary).toEqual(true)
    expect(data.primaryAddress.type).toEqual('PRESENT')
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
})
