const nock = require('nock')

const clientFactory = require('./oauthEnabledClient')
const { dataComplianceApiFactory } = require('./dataComplianceApi')

const hostname = 'http://localhost:8080'

describe('dataComplianceApi tests', () => {
  const client = clientFactory({ baseUrl: `${hostname}`, timeout: 2000 })
  const dataComplianceApi = dataComplianceApiFactory(client, true)
  const mock = nock(hostname)

  afterEach(() => {
    nock.cleanAll()
  })

  describe('GET offender record retention', () => {
    it('Returns true if retention record exists', async () => {
      mock.get('/retention/offenders/A1234AA').reply(200, { retentionReasons: [{ reasonCode: 'HIGH_PROFILE' }] })

      const recordIsRetained = await dataComplianceApi.isOffenderRecordRetained({}, 'A1234AA')

      expect(recordIsRetained).toBeTruthy()
    })

    it('Returns false if retention record not found', async () => {
      mock.get('/retention/offenders/A1234AA').reply(404, {})

      const recordIsRetained = await dataComplianceApi.isOffenderRecordRetained({}, 'A1234AA')

      expect(recordIsRetained).toBeFalsy()
    })

    it('Returns false if retention reasons are empty', async () => {
      mock.get('/retention/offenders/A1234AA').reply(200, { retentionReasons: [] })

      const recordIsRetained = await dataComplianceApi.isOffenderRecordRetained({}, 'A1234AA')

      expect(recordIsRetained).toBeFalsy()
    })

    it('Returns error', async () => {
      expect.assertions(1)
      mock
        .get('/retention/offenders/A1234AA')
        .times(3)
        .reply(500, {})

      try {
        await dataComplianceApi.isOffenderRecordRetained({}, 'A1234AA')
      } catch (error) {
        expect(error.toString()).toEqual('Error: Internal Server Error')
      }
    })

    it('Returns false if disabled', async () => {
      const disabledDataComplianceApi = dataComplianceApiFactory(client, false)

      const recordIsRetained = await disabledDataComplianceApi.isOffenderRecordRetained({}, 'A1234AA')

      expect(recordIsRetained).toBeFalsy()
    })
  })
})
