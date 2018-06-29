const expect = require('chai').expect;
const contextProperties = require('../../server/contextProperties');
const interceptors = require('../../server/api/axios-interceptors');

describe('Axios request interceptor tests', () => {
  it('The authorization interceptor should set the authorization header from the token store', () => {
    const context = {};
    const config = { context };

    contextProperties.setTokens(context, 'access', 'refresh');
    const result = interceptors.authorizationInterceptor(config);
    expect(result).to.deep.equal(
      {
        context,
        headers: {
          authorization: 'Bearer access',
        },
      },
    )
  })
});