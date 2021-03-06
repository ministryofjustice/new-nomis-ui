const supertest = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')

const contextProperties = require('../server/contextProperties')
const requestForwarding = require('../server/request-forwarding')

describe('Test request forwarding', () => {
  describe('extractRequestPaginationMiddleware', () => {
    let context

    const app = express()
    app.use(requestForwarding.extractRequestPaginationMiddleware)
    app.use('/', (req, res) => {
      context = res.locals
      res.end()
    })
    const request = supertest(app)

    it('Should copy request pagination header values to a context object', () =>
      request
        .get('/')
        .set('page-offset', 20)
        .set('page-limit', 10)
        .set('junk', 'junkValue')
        .expect(200)
        .then(() => {
          expect(contextProperties.getRequestPagination(context)).toEqual({
            'page-offset': '20',
            'page-limit': '10',
          })
        }))
  })

  describe('forwarding handler', () => {
    const eliteApi = {}
    const forwardingHandler = requestForwarding.forwardingHandlerFactory(eliteApi)

    const app = express()
    app.use(bodyParser.json())
    app.use(requestForwarding.extractRequestPaginationMiddleware)
    app.use('/app', forwardingHandler)
    const request = supertest(app)

    beforeEach(() => {
      eliteApi.get = jest.fn()
      eliteApi.post = jest.fn()
    })

    it('Should forward get requests', () => {
      eliteApi.get.mockReturnValueOnce(Promise.resolve({ value: 'responseValue' }))

      return request
        .get('/app/me/locations')
        .set('page-offset', 20)
        .set('page-limit', 10)
        .expect(200)
        .expect({ value: 'responseValue' })
        .then(() => {
          expect(eliteApi.get).toBeCalledWith(
            { requestHeaders: { 'page-limit': '10', 'page-offset': '20' } },
            'api/me/locations'
          )
        })
    })

    it('Should forward post requests', () => {
      eliteApi.post.mockReturnValueOnce(Promise.resolve({ value: 'responseValue' }))

      return request
        .post('/app/me/locations')
        .send({ value: 'requestValue' })
        .set('Content-Type', 'application/json')
        .set('page-offset', 20)
        .set('page-limit', 10)
        .expect(200)
        .expect({ value: 'responseValue' })
        .then(() => {
          expect(eliteApi.post).toBeCalledWith(
            { requestHeaders: { 'page-limit': '10', 'page-offset': '20' } },
            'api/me/locations',
            { value: 'requestValue' }
          )
        })
    })
  })

  describe('pagination headers on response', () => {
    const responseHeaders = { 'total-records': '100', 'test-header': 'test-value' }

    const apiFunction = context =>
      new Promise(resolve => {
        contextProperties.setResponsePagination(context, responseHeaders)
        resolve()
      })

    const eliteApi = { get: apiFunction, post: apiFunction }

    const forwardingHandler = requestForwarding.forwardingHandlerFactory(eliteApi)

    const app = express()
    app.use(bodyParser.json())
    app.use(requestForwarding.extractRequestPaginationMiddleware)
    app.use('/app', forwardingHandler)
    const request = supertest(app)

    it('pagination headers should be set on response to get', () =>
      request
        .get('/app/me/locations')
        .expect(200)
        .expect('total-records', '100'))

    it('pagination headers should be set on response to post', () =>
      request
        .post('/app/me/locations')
        .expect(200)
        .expect('total-records', '100'))
  })
})
