const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const proxyquire = require('proxyquire').noPreserveCache();
const MockAdapter = require('axios-mock-adapter');
const querystring = require('querystring');
const tokenStore = require('../../server/tokenStore');

const clientId = 'clientId';
const url = 'http://localhost';
const clientSecret = 'clientSecret';

const configStub = {
  app: {
    useApiAuthGateway: false,
  },
  apis: {
    elite2: {
      url,
      clientId,
      clientSecret,
    },
  },
};

const enableGatewayStub = Object.assign({}, configStub, {
  app: {
    useApiAuthGateway: true,
  },
});


describe('oathApi tests', () => {
  it('Should send a valid auth request and save tokens', (done) => {
    const oauthApi = proxyquire('../../server/api/oauthApi', { '../config': configStub });

    const mock = new MockAdapter(oauthApi.oauthAxios);

    mock.onPost('oauth/token').reply(200, {
      access_token: 'accessToken',
      token_type: 'bearer',
      refresh_token: 'refreshToken',
      expires_in: 59,
      scope: 'write',
      internalUser: true,
      jti: 'bf5e8f62-1d2a-4126-96e2-a4ae91997ba6',
    });

    let requestConfig;
    oauthApi.oauthAxios.interceptors.request.use(config => {
      requestConfig = config;
      return config;
    });

    tokenStore.run(() => {
      oauthApi.authenticate('name', 'password')
        .then(() => {
          expect(tokenStore.getAccessToken()).to.equal('accessToken');
          expect(tokenStore.getRefreshToken()).to.equal('refreshToken');
        })
        .then(() => {
          expect(requestConfig.baseURL).to.equal(url);
          expect(requestConfig.url).to.equal('/oauth/token');
          expect(requestConfig.headers.authorization).to.equal(`Basic ${encodeClientCredentials()}`);
          expect(requestConfig.data).to.equal('username=NAME&password=password&grant_type=password');
          expect(requestConfig.headers['Content-Type']).to.equal('application/x-www-form-urlencoded');
        })
        .then(done, done)
    });
  });

  it('Should send a valid refresh request and store tokens', (done) => {
    const oauthApi = proxyquire('../../server/api/oauthApi', { '../config': configStub });

    const mock = new MockAdapter(oauthApi.oauthAxios);

    mock.onPost('oauth/token').reply(200, {
      access_token: 'newAccessToken',
      token_type: 'bearer',
      refresh_token: 'newRefreshToken',
      expires_in: 59,
      scope: 'write',
      internalUser: true,
      jti: 'bf5e8f62-1d2a-4126-96e2-a4ae91997ba6',
    });

    let requestConfig;
    oauthApi.oauthAxios.interceptors.request.use(config => {
      requestConfig = config;
      return config;
    });

    tokenStore.run(() => {
      tokenStore.storeTokens('accessToken', 'refreshToken');
      oauthApi.refresh()
        .then(() => {
          expect(tokenStore.getAccessToken()).to.equal('newAccessToken');
          expect(tokenStore.getRefreshToken()).to.equal('newRefreshToken');
        })
        .then(() => {
          expect(requestConfig.baseURL).to.equal(url);
          expect(requestConfig.url).to.equal('/oauth/token');
          expect(requestConfig.headers.authorization).to.equal(`Basic ${encodeClientCredentials()}`);
          expect(requestConfig.data).to.equal('refresh_token=refreshToken&grant_type=refresh_token');
          expect(requestConfig.headers['Content-Type']).to.equal('application/x-www-form-urlencoded');
        })
        .then(done, done)
    });
  });

  it('Should invoke the gateway interceptor when enabled', (done) => {
    const interceptorSpy = sinon.spy(config => config);

    const oauthApi = proxyquire(
      '../../server/api/oauthApi',
      {
        '../config': enableGatewayStub,
        './axios-interceptors': { gatewayInterceptor: interceptorSpy },
      });

    const mock = new MockAdapter(oauthApi.oauthAxios);
    mock.onPost('oauth/token').reply(200, {});

    tokenStore.run(() => {
      tokenStore.storeTokens('accessToken', 'refreshToken');
      oauthApi.authenticate('name', 'password')
        .then(() => {
          // noinspection BadExpressionStatementJS
          expect(interceptorSpy).to.have.been.called;
        })
        .then(done, done)
    });
  });

  it('Should not invoke the gateway interceptor when disabled', (done) => {
    const interceptorSpy = sinon.spy(config => config);

    const oauthApi = proxyquire(
      '../../server/api/oauthApi',
      {
        '../config': configStub,
        './axios-interceptors': { gatewayInterceptor: interceptorSpy },
      });

    const mock = new MockAdapter(oauthApi.oauthAxios);
    mock.onPost('oauth/token').reply(200, {});

    tokenStore.run(() => {
      tokenStore.storeTokens('accessToken', 'refreshToken');
      oauthApi.authenticate('name', 'password')
        .then(() => {
          // noinspection BadExpressionStatementJS
          expect(interceptorSpy).not.to.have.been.called;
        })
        .then(done, done)
    });
  });


  function encodeClientCredentials() {
    return new Buffer(`${querystring.escape(clientId)}:${querystring.escape(clientSecret)}`).toString('base64')
  }
});

