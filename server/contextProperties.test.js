const contextProperties = require('./contextProperties')

describe('Should read/write properties', () => {
  describe('Should set / get tokens', () => {
    const context = {}
    contextProperties.setTokens({ access_token: 'a', refresh_token: 'b', authSource: 'joe' }, context)

    it('should set the access token', () => {
      expect(contextProperties.getAccessToken(context)).toEqual('a')
    })
    it('should set the refresh token', () => {
      expect(contextProperties.getRefreshToken(context)).toEqual('b')
    })
    it('should set the auth source', () => {
      expect(context.authSource).toEqual('joe')
    })
  })

  describe('Should return null if tokens not present', () => {
    const context = {}

    it('access token', () => {
      expect(contextProperties.getAccessToken(context)).toBeNull()
    })
    it('refresh token', () => {
      expect(contextProperties.getRefreshToken(context)).toBeNull()
    })
  })

  describe('Should know if the context has no tokens', () => {
    it('null', () => {
      expect(contextProperties.hasTokens(null)).toBe(false)
    })
    it('undefined', () => {
      expect(contextProperties.hasTokens(undefined)).toBe(false)
    })
    it('empty object', () => {
      expect(contextProperties.hasTokens({})).toBe(false)
    })
  })

  describe('Should know if the context has tokens', () => {
    const context = {}

    it('no tokens', () => {
      contextProperties.setTokens({}, context)
      expect(contextProperties.hasTokens(context)).toBe(false)
    })
    it('empty tokens', () => {
      contextProperties.setTokens({ access_token: '', refresh_token: '' }, context)
      expect(contextProperties.hasTokens(context)).toBe(false)
    })
    it('only access token', () => {
      contextProperties.setTokens({ access_token: 'a', refresh_token: '' }, context)
      expect(contextProperties.hasTokens(context)).toBe(false)
    })
    it('only refresh tokenb', () => {
      contextProperties.setTokens({ access_token: '', refresh_token: 'b' }, context)
      expect(contextProperties.hasTokens(context)).toBe(false)
    })
    it('both tokens', () => {
      contextProperties.setTokens({ access_token: 'a', refresh_token: 'b' }, context)
      expect(contextProperties.hasTokens(context)).toBe(true)
    })
  })

  it('Should set the request pagination properties', () => {
    const context = {}
    contextProperties.setRequestPagination(context, {
      'Page-offset': 1,
      'Page-Limit': 10,
      'SORT-FIELDS': 'a,b',
      'sort-order': 'ASC',
    })
    expect(contextProperties.getRequestPagination(context)).toEqual({
      'page-offset': 1,
      'page-limit': 10,
      'sort-fields': 'a,b',
      'sort-order': 'ASC',
    })
  })

  it('Should return an empty requestPagination object even when the setter has not been called', () => {
    expect(contextProperties.getRequestPagination({})).toEqual({})
  })

  it('Should set the response pagination properties', () => {
    const context = {}
    contextProperties.setResponsePagination(context, {
      'PAGE-offset': 1,
      'page-LIMIT': 10,
      'Sort-Fields': 'a,b',
      'sort-order': 'ASC',
      'total-records': 100,
    })
    expect(contextProperties.getResponsePagination(context)).toEqual({
      'page-offset': 1,
      'page-limit': 10,
      'sort-fields': 'a,b',
      'sort-order': 'ASC',
      'total-records': 100,
    })
  })

  it('Should set page limit', () => {
    const context = {}
    contextProperties.setPageLimit(context, 1000)
    expect(contextProperties.getRequestPagination(context)).toEqual({ 'page-limit': 1000 })
  })

  it('Should return an empty responsePagination object if no values were set', () => {
    const context = {}
    contextProperties.setResponsePagination(context, {})
    expect(contextProperties.getResponsePagination(context)).toEqual({})
  })

  it('Should return an empty responsePagination object even when the setter has not been called', () => {
    expect(contextProperties.getResponsePagination({})).toEqual({})
  })
})
