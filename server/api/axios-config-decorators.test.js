const decorators = require('./axios-config-decorators')
const contextProperties = require('../contextProperties')

describe('Axios request configuration decorator tests', () => {
  it('The authorization decorartor should set the authorization header from the token store', () => {
    const context = {}
    contextProperties.setTokens({ access_token: 'access', refresh_token: 'refresh' }, context)

    const configuration = decorators.addAuthorizationHeader(context, {})
    expect(configuration).toEqual({ headers: { authorization: 'Bearer access' } })
  })

  it('should return paging and auth headers', () => {
    const context = {}
    contextProperties.setTokens({ access_token: 'access', refresh_token: 'refresh' }, context)
    contextProperties.setRequestPagination(context, { 'page-limit': 5 })

    const headers = decorators.getHeaders(context)
    expect(headers).toEqual({ authorization: 'Bearer access', 'page-limit': 5 })
  })
})
