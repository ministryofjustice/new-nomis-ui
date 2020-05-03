const nock = require('nock')
const decorators = require('./axios-config-decorators')
const contextProperties = require('../contextProperties')
const { apis } = require('../config')

describe('Axios request configuration decorator tests', () => {
  it('should return paging and auth headers', () => {
    const context = {}
    contextProperties.setTokens({ access_token: 'access', refresh_token: 'refresh' }, context)
    contextProperties.setRequestPagination(context, { 'page-limit': 5 })

    const headers = decorators.getHeaders(context)
    expect(headers).toEqual({ authorization: 'Bearer access', 'page-limit': 5 })
  })

  describe('getClientAuthedHeaders', () => {
    const mock = nock(apis.oauth2.url)
    afterEach(() => {
      nock.cleanAll()
    })

    it('should call auth to get token', async () => {
      const context = { requestHeaders: { header: 'header' } }
      mock.post('/oauth/token').reply(200, { access_token: 'TOKEN' })
      const response = await decorators.getClientAuthedHeaders(context)
      expect(response).toEqual({
        authorization: 'Bearer TOKEN',
        header: 'header',
      })
    })
  })
})
