const proxyquire = require('proxyquire').noPreserveCache();
const expect = require('chai').expect;

const scopedStore = require('../../server/scopedStore');

const interceptors = proxyquire('../../server/api/axios-interceptors', {
  '../jwt-token': {
    generateToken: () => 'meh',
  },
});

describe('Axios request interceptor tests', () => {
  it('The gateway interceptor should always set the authorization header with a gateway token', () => {
    const result = interceptors.gatewayInterceptor({});
    expect(result).to.deep.equal(
      {
        headers: {
          authorization: 'Bearer meh',
        },
      });
  });

  it('The gateway interceptor should move a pre-existing authorization token to the \'elite-authorization\' header', () => {
    const result = interceptors.gatewayInterceptor({ headers: { authorization: 'token stuff' } });
    expect(result).to.deep.equal(
      {
        headers: {
          authorization: 'Bearer meh',
          'elite-authorization': 'token stuff',
        },
      });
  });

  it('The authorization interceptor should set the authorization header from the token store', () => {
    scopedStore.run(() => {
      scopedStore.storeTokens('access', 'refresh');
      const result = interceptors.authorizationInterceptor({});
      expect(result).to.deep.equal(
        {
          headers: {
            authorization: 'Bearer access',
          },
        }
      )
    })
  })
});