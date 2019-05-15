const { bookingServiceFactory } = require('./booking')

const eliteApi = {}
const keyworkerApi = {}
const bookingService = bookingServiceFactory(eliteApi, keyworkerApi)

describe('Booking Service Booking details', () => {
  const offenderNo = 'A12345'

  beforeEach(() => {
    eliteApi.getKeyworker = jest.fn()
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
})
