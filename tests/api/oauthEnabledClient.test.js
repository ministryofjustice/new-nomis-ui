const MockAdapter = require('axios-mock-adapter');
const expect = require('chai').expect;
const clientFactory = require('../../server/api/oauthEnabledClient');
const contextProperties = require('../../server/contextProperties');

describe('Test clients built by oauthEnabledClient', () => {
  it('should build something', () => {
    const client = clientFactory('http://localhost:8080', 2000);
    // noinspection BadExpressionStatementJS
    expect(client).not.null;
  });

  it('Should set the authorization header with Bearer access token', async () => {
    let capturedConfig;

    const client = clientFactory('http://localhost:8080', 2000);

    client.axiosInstance.interceptors.request.use(
      (config) => {
        capturedConfig = config;
        return config;
      },
      (error) => Promise.reject(error));

    const mock = new MockAdapter(client.axiosInstance);
    mock
      .onGet('/api/users/me')
      .reply(200, {});

    const context = {};
    contextProperties.setTokens(context, 'a', 'b');

    const response = await client.get(context, '/api/users/me');

    expect(response.data).to.deep.equal({});
    expect(response.status).to.equal(200);
    expect(capturedConfig.headers.authorization).to.equal('Bearer a');
  });
});