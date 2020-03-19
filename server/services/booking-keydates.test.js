const { bookingServiceFactory } = require('./booking')

const eliteApi = {}
const keyworkerApi = {}
const allocationManagerApi = {}
const bookingService = bookingServiceFactory(eliteApi, keyworkerApi, allocationManagerApi)

describe('Booking Service Booking details', () => {
  beforeEach(() => {
    eliteApi.getCategoryAssessment = jest.fn().mockReturnValue(Promise.resolve(null))
    eliteApi.getSentenceDetail = jest.fn().mockReturnValue(Promise.resolve(null))
    eliteApi.getIepSummary = jest.fn().mockReturnValue(Promise.resolve(null))

    eliteApi.getDetailsLight = jest.fn().mockReturnValue(
      Promise.resolve({
        bookingId: 1,
      })
    )
  })

  it('should call getCategoryAssessment', async () => {
    eliteApi.getSentenceDetail.mockReturnValue(Promise.resolve({}))
    eliteApi.getIepSummary.mockReturnValue(Promise.resolve({}))

    eliteApi.getCategoryAssessment.mockReturnValue(
      Promise.resolve({
        classification: 'stuff',
        assessmentCode: 'CATEGORY',
        assessmentDescription: 'stuff',
        cellSharingAlertFlag: false,
        assessmentDate: '2017-12-05',
        nextReviewDate: '2017-12-05',
      })
    )

    const data = await bookingService.getKeyDatesVieModel({}, 'A12345')

    expect(eliteApi.getCategoryAssessment).toBeCalled()

    expect(data.reCategorisationDate).toEqual('2017-12-05')
  })
})
