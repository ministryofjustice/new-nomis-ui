const supertest = require('supertest');
const express = require('express');
const chai = require('chai');

const expect = chai.expect;
chai.use(require('sinon-chai'));
const sinon = require('sinon');
const bodyParser = require('body-parser');

const contextProperties = require('../server/contextProperties');
const requestForwarding = require('../server/request-forwarding');
const eliteApiFactory = require('../server/api/eliteApi').eliteApiFactory;


describe('Test request forwarding', () => {
  describe('extractRequestPaginationMiddleware', () => {
    let context;

    const app = express();
    app.use(requestForwarding.extractRequestPaginationMiddleware);
    app.use('/', (req, res) => {
      context = res.locals;
      res.end();
    });
    const request = supertest(app);

    it('Should copy request pagination header values to a context object', () =>
      request
        .get('/')
        .set('page-offset', 20)
        .set('page-limit', 10)
        .set('junk', 'junkValue')
        .expect(200)
        .then(() => {
          expect(contextProperties.getRequestPagination(context)).to.deep.equal({
            'page-offset': '20',
            'page-limit': '10',
          });
        }),
    )
  });

  describe('forwarding handler', () => {
    const eliteApi = eliteApiFactory(null);
    const forwardingHandler = requestForwarding.forwardingHandlerFactory(eliteApi);
    const sandbox = sinon.createSandbox();

    const app = express();
    app.use(bodyParser.json());
    app.use(requestForwarding.extractRequestPaginationMiddleware);
    app.use('/app', forwardingHandler);
    const request = supertest(app);

    beforeEach(() => {
      sandbox.stub(eliteApi, 'get');
      sandbox.stub(eliteApi, 'post');
    });

    afterEach(() => {
      sandbox.restore()
    });

    it('Should forward get requests', () => {
      eliteApi.get.resolves({ value: 'responseValue' });

      return request
        .get('/app/me/locations')
        .set('page-offset', 20)
        .set('page-limit', 10)
        .expect(200)
        .expect({ value: 'responseValue' })
        .then(() => {
          expect(eliteApi.get).to.have.been.calledWith(
            { requestHeaders: { 'page-limit': '10', 'page-offset': '20' } },
            '/api/me/locations');
        })
    });

    it('Should forward post requests', () => {
      eliteApi.post.resolves({ value: 'responseValue' });

      return request
        .post('/app/me/locations')
        .send({ value: 'requestValue' })
        .set('Content-Type', 'application/json')
        .set('page-offset', 20)
        .set('page-limit', 10)
        .expect(200)
        .expect({ value: 'responseValue' })
        .then(() => {
          expect(eliteApi.post).to.have.been.calledWith(
            { requestHeaders: { 'page-limit': '10', 'page-offset': '20' } },
            '/api/me/locations',
            { value: 'requestValue' });
        })
    });
  });

  describe('pagination headers on response', () => {
    const responseHeaders = { 'total-records': '100', 'test-header': 'test-value' };

    const apiFunction = (context) => new Promise((resolve) => {
      contextProperties.setResponsePagination(context, responseHeaders);
      resolve();
    });

    const eliteApi = { get: apiFunction, post: apiFunction };

    const forwardingHandler = requestForwarding.forwardingHandlerFactory(eliteApi);

    const app = express();
    app.use(bodyParser.json());
    app.use(requestForwarding.extractRequestPaginationMiddleware);
    app.use('/app', forwardingHandler);
    const request = supertest(app);

    it('pagination headers should be set on response to get', () =>
      request
        .get('/app/me/locations')
        .expect(200)
        .expect('total-records', '100')
    );

    it('pagination headers should be set on response to post', () =>
      request
        .post('/app/me/locations')
        .expect(200)
        .expect('total-records', '100')
    );
  });
});