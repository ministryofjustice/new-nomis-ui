/* eslint-disable camelcase */
const sinon = require('sinon');
const chai = require('chai');
const { expect } = chai;

const sinonChai = require('sinon-chai');
const apiService = require('../server/api/retry');

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
    apiService.httpRequest.resolves({ data: 'success' });

    apiService.callApi({
      method: 'post',
      url: '/users/me',
      reqHeaders: {
        host: 'localhost',
        jwt: { access_token: 'abc.def.ghi', refresh_token: 'foo.bar.baz' },
      },
      headers: {},
      onTokenRefresh: () => {
      },
    });

    expect(apiService.httpRequest).to.be.calledWith({
      headers: {
        'access-control-allow-origin': 'localhost',
        authorization: 'bearer abc.def.ghi',
      },
      method: 'post',
      responseType: undefined,
      data: undefined,
      url: '/users/me',
    });
  });


  it('request a new token when the existing one expires', () => {
    const access_token = '123';
    const refresh_token = '321';
    const newRefreshToken = '555';
    const newToken = '456';

    apiService.httpRequest.rejects({
      response: {
        status: 401,
      },
    });

    apiService.refreshTokenRequest.resolves({
      data: {
        access_token: newToken,
        refresh_token: newRefreshToken,
      },
    });

    apiService.httpRequestRetry.resolves({ data: 'success' });

    const options = {
      url: '/users/me',
      method: 'get',
      headers: {},
      reqHeaders: {
        host: 'localhost',
        jwt: {
          access_token,
          refresh_token,
        },
      },
      onTokenRefresh: sandbox.spy(),
    };

    const result = apiService.callApi(options);

    const jwt = {
      access_token: newToken,
      refresh_token: newRefreshToken,
    };

    result.then(response => {
      expect(response.data).to.equal('success');
      expect(apiService.refreshTokenRequest).to.be.calledWith({ headers: { }, reqHeaders: { host: 'localhost', jwt: { access_token, refresh_token } }, token: refresh_token });
      expect(options.onTokenRefresh).to.be.calledWith(jwt);
    });
  })
});