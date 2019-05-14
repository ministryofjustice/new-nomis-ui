const nock = require('nock')
const MockAdapter = require('axios-mock-adapter')

const clientFactory = require('./oauthEnabledClient')
const { eliteApiFactory } = require('./eliteApi')
const contextProperties = require('../contextProperties')

const hostname = 'http://localhost:8080'

describe('eliteApi tests', () => {
  const client = clientFactory({ baseUrl: `${hostname}/`, timeout: 2000 })
  const axiosMock = new MockAdapter(client.axiosInstance)
  const eliteApi = eliteApiFactory(client)
  const getRequest = nock(hostname)

  afterEach(() => {
    axiosMock.reset()
    nock.cleanAll()
  })

  describe('GET requests', () => {
    it('Extracts GET response data', async () => {
      getRequest.get('/test').reply(200, { test: 'test' })
      const data = await eliteApi.get({}, 'test')
      expect(data).toEqual({ test: 'test' })
    })

    it('Extracts response pagination headers from GET resposne', async () => {
      const headers = { 'page-offset': 10 }
      getRequest.get('/test').reply(200, {}, headers)
      const context = {}
      await eliteApi.get(context, 'test')
      expect(contextProperties.getResponsePagination(context)).toEqual(headers)
    })
  })

  describe('GET categorisation request', () => {
    it('Maps a GET assessment/CATEGORY response status of 404 to a null response', async () => {
      getRequest.get('/api/bookings/1234/assessment/CATEGORY').reply(404)
      const result = await eliteApi.getCategoryAssessment({}, 1234)
      expect(result).toBeNull()
    })

    it('throws an exception for a GET assessment/CATEGORY response status of 401 ', async () => {
      getRequest.get('/api/bookings/1234/assessment/CATEGORY').reply(401)

      expect(eliteApi.getCategoryAssessment({}, 1234)).rejects.toThrow(new Error('Unauthorized'))
    })
  })

  describe('POST requests', () => {
    it('Extracts POST response data', async () => {
      axiosMock.onPost('/test').reply(200, { test: 'test' })
      const data = await eliteApi.post({}, '/test')
      expect(data).toEqual({ test: 'test' })
    })

    it('Extracts response pagination headers from POST resposne', async () => {
      const headers = { 'page-offset': 10 }
      axiosMock.onPost('/test').reply(() => [200, {}, headers])
      const context = {}
      await eliteApi.post(context, '/test')
      expect(contextProperties.getResponsePagination(context)).toEqual(headers)
    })

    it('Sends post data', async () => {
      axiosMock.onPost('/test', { test: 'test' }).reply(200, {})
      await eliteApi.post({}, '/test', { test: 'test' })
    })
  })
})
