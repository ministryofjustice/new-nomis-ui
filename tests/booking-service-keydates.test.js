/* eslint-disable no-unused-expressions */
const sinon = require('sinon')
const chai = require('chai')

const { expect } = chai
const sinonChai = require('sinon-chai')

const { eliteApiFactory } = require('../server/api/eliteApi')
const { keyworkerApiFactory } = require('../server/api/keyworkerApi')
const { bookingServiceFactory } = require('../server/services/booking')

const eliteApi = eliteApiFactory(null)
const keyworkerApi = keyworkerApiFactory(null)
const bookingService = bookingServiceFactory(eliteApi, keyworkerApi)

chai.use(sinonChai)

describe('Booking Service Booking details', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    sandbox.stub(eliteApi, 'getCategoryAssessment')
    sandbox.stub(eliteApi, 'getSentenceDetail')
    sandbox.stub(eliteApi, 'getIepSummary')
    sandbox.stub(eliteApi, 'getDetailsLight')

    eliteApi.getDetailsLight.returns({
      bookingId: 1,
    })
  })

  afterEach(() => sandbox.restore())

  it('should call getCategoryAssessment', async () => {
    eliteApi.getSentenceDetail.returns({})
    eliteApi.getIepSummary.returns({})

    eliteApi.getCategoryAssessment.returns({
      classification: 'stuff',
      assessmentCode: 'CATEGORY',
      assessmentDescription: 'stuff',
      cellSharingAlertFlag: false,
      assessmentDate: '2017-12-05',
      nextReviewDate: '2017-12-05',
    })

    const data = await bookingService.getKeyDatesVieModel({}, 'A12345')

    expect(eliteApi.getCategoryAssessment).to.be.called

    expect(data.reCategorisationDate).to.equal('2017-12-05')
  })
})
