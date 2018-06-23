const expect = require('chai').expect;
const clientFactory = require('../../server/api/oauthEnabledClient');

describe('Test clients built by oauthEnabledClient', () => {
  it('should build something', () => {
    const client = clientFactory('http://localhost:8080', 2000, false);
    // noinspection BadExpressionStatementJS
    expect(client).not.null;
  });
});