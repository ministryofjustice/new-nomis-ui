const sinon = require('sinon');
const chai = require('chai'),
  expect = chai.expect;

const sinonChai = require('sinon-chai');
const apiService = require('../server/elite2Api');
const session = require('../server/session');

chai.use(sinonChai);

describe('apiService', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(apiService,'httpRequest');
    sandbox.stub(apiService, 'refreshTokenRequest');
    sandbox.stub(apiService, 'httpRequestRetry');
  });

  afterEach(() => sandbox.restore());

  it('should call httpRequest with the correct parameters', () => {
    const sessionData = {
      token: '123',
      refreshToken: '321',
    };

    apiService.httpRequest.resolves({ data: 'success' });

    apiService.callApi({
      method: 'post',
      url: '/users/me',
      reqHeaders: {
        host: 'localhost',
        jwt: session.newJWT(sessionData),
      },
      headers: {},
      onTokenRefresh: () => {
      },
    });

    expect(apiService.httpRequest).to.be.calledWith({
      headers: {
        'access-control-allow-origin': 'localhost',
        authorization: sessionData.token,
      },
      method: 'post',
      responseType: undefined,
      data: undefined,
      url: '/users/me',
    });
  });


  it('request a new token when the existing one expires', () => {
    const token = '123';
    const refreshToken = '321';
    const newToken = '456';

    const jwt = session.newJWT({
      token: newToken,
    });

    sandbox.stub(session,'getSessionData').returns({ token,refreshToken });

    apiService.httpRequest.rejects({
      response: {
        status: 401,
      },
    });

    apiService.refreshTokenRequest.resolves({
      data: {
        token: newToken,
      },
    });

    apiService.httpRequestRetry.resolves({ data: 'success' });

    const options = {
      url: '/users/me',
      method: 'get',
      headers: {},
      reqHeaders: {
        host: 'localhost',
      },
      onTokenRefresh: sandbox.spy(),
    };

    const result = apiService.callApi(options);

    result.then(response => {
      expect(response.data).to.equal('success');
      expect(apiService.refreshTokenRequest).to.be.calledWith({ headers: { }, reqHeaders: { host: 'localhost' }, token: refreshToken });
      expect(options.onTokenRefresh).to.be.calledWith(jwt);
    });
  })
})