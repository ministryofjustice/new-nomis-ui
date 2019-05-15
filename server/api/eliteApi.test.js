const nock = require('nock')

const clientFactory = require('./oauthEnabledClient')
const { eliteApiFactory } = require('./eliteApi')
const contextProperties = require('../contextProperties')

const hostname = 'http://localhost:8080'

describe('eliteApi tests', () => {
  const client = clientFactory({ baseUrl: `${hostname}/`, timeout: 2000 })
  const eliteApi = eliteApiFactory(client)
  const mock = nock(hostname)

  afterEach(() => {
    nock.cleanAll()
  })

  describe('GET requests', () => {
    it('Extracts GET response data', async () => {
      mock.get('/test').reply(200, { test: 'test' })
      const data = await eliteApi.get({}, 'test')
      expect(data).toEqual({ test: 'test' })
    })

    it('Extracts response pagination headers from GET resposne', async () => {
      const headers = { 'page-offset': 10 }
      mock.get('/test').reply(200, {}, headers)
      const context = {}
      await eliteApi.get(context, 'test')
      expect(contextProperties.getResponsePagination(context)).toEqual(headers)
    })
  })

  describe('GET categorisation request', () => {
    it('Maps a GET assessment/CATEGORY response status of 404 to a null response', async () => {
      mock.get('/api/bookings/1234/assessment/CATEGORY').reply(404)
      const result = await eliteApi.getCategoryAssessment({}, 1234)
      expect(result).toBeNull()
    })

    it('throws an exception for a GET assessment/CATEGORY response status of 401 ', async () => {
      mock.get('/api/bookings/1234/assessment/CATEGORY').reply(401)

      await expect(eliteApi.getCategoryAssessment({}, 1234)).rejects.toThrow('Unauthorized')
    })
  })

  describe('POST requests', () => {
    it('Extracts POST response data', async () => {
      mock.post('/test').reply(200, { test: 'test' })
      const data = await eliteApi.post({}, 'test')
      expect(data).toEqual({ test: 'test' })
    })

    it('Extracts response pagination headers from POST response', async () => {
      const headers = { 'page-offset': 10 }
      mock.post('/test').reply(200, {}, headers)
      const context = {}
      await eliteApi.post(context, 'test')
      expect(contextProperties.getResponsePagination(context)).toEqual(headers)
    })

    it('Sends post data', async () => {
      mock.post('/test', { test: 'test' }).reply(200, {})
      await eliteApi.post({}, 'test', { test: 'test' })
    })
  })
})
