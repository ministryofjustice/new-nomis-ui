const { bookingServiceFactory } = require('./booking')

const eliteApi = {}
const keyworkerApi = {}
const bookingService = bookingServiceFactory(eliteApi, keyworkerApi)

describe('Booking Service Booking details', () => {
  beforeEach(() => {
    eliteApi.getCategoryAssessment = jest.fn()
    eliteApi.getSentenceDetail = jest.fn()
    eliteApi.getIepSummary = jest.fn()

    eliteApi.getDetailsLight = jest.fn().mockReturnValue({
      bookingId: 1,
    })
  })

  it('should call getCategoryAssessment', async () => {
    eliteApi.getSentenceDetail.mockReturnValue({})
    eliteApi.getIepSummary.mockReturnValue({})

    eliteApi.getCategoryAssessment.mockReturnValue({
      classification: 'stuff',
      assessmentCode: 'CATEGORY',
      assessmentDescription: 'stuff',
      cellSharingAlertFlag: false,
      assessmentDate: '2017-12-05',
      nextReviewDate: '2017-12-05',
    })

    const data = await bookingService.getKeyDatesVieModel({}, 'A12345')

    expect(eliteApi.getCategoryAssessment).toBeCalled()

    expect(data.reCategorisationDate).toEqual('2017-12-05')
  })
})
