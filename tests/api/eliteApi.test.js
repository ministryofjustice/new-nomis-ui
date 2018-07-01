const expect = require('chai').expect;
const MockAdapter = require('axios-mock-adapter');
const clientFactory = require('../../server/api/oauthEnabledClient');
const eliteApiFactory = require('../../server/api/eliteApi').eliteApiFactory;
const contextProperties = require('../../server/contextProperties');

describe('eliteApi tests', () => {
  const client = clientFactory('http://localhost:8080', 2000);
  const axiosMock = new MockAdapter(client.axiosInstance);
  const eliteApi = eliteApiFactory(client);

  afterEach(() => {
    axiosMock.reset();
  });

  it('Extracts GET response data', async () => {
    axiosMock.onGet('/test').reply(200, { test: 'test' });
    const data = await eliteApi.get({}, '/test');
    expect(data).to.deep.equal({ test: 'test' });
  });

  it('Extracts POST response data', async () => {
    axiosMock.onPost('/test').reply(200, { test: 'test' });
    const data = await eliteApi.post({}, '/test');
    expect(data).to.deep.equal({ test: 'test' });
  });

  it('Extracts response pagination headers from GET resposne', async () => {
    const headers = { 'page-offset': 10 };
    axiosMock.onGet('/test').reply(() => [200, {}, headers]);
    const context = {};
    await eliteApi.get(context, '/test');
    expect(contextProperties.getResponsePagination(context)).to.deep.equal(headers);
  });

  it('Extracts response pagination headers from POST resposne', async () => {
    const headers = { 'page-offset': 10 };
    axiosMock.onPost('/test').reply(() => [200, {}, headers]);
    const context = {};
    await eliteApi.post(context, '/test');
    expect(contextProperties.getResponsePagination(context)).to.deep.equal(headers);
  });

  it('Sends post data', async () => {
    axiosMock.onPost('/test', { test: 'test' }).reply(200, {});
    await eliteApi.post({}, '/test', { test: 'test' });
  })
});