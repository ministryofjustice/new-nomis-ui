const expect = require('chai').expect;
const jwtToken = require('../../server/jwt-token');
const decorators = require('../../server/api/axios-config-decorators');
const contextProperties = require('../../server/contextProperties');

describe('Axios request configuration decorartor tests', () => {
  jwtToken.generateToken = () => 'meh';

  it('The gateway decorartor should always set the authorization header with a gateway token', () => {
    const configuration = decorators.addGatewayHeader({});
    expect(configuration).to.deep.equal(
      {
        headers: {
          authorization: 'Bearer meh',
        },
      });
  });

  it('The gateway decorartor should move a pre-existing authorization token to the \'elite-authorization\' header', () => {
    const configuration = decorators.addGatewayHeader({ headers: { authorization: 'token stuff' } });
    expect(configuration).to.deep.equal(
      {
        headers: {
          authorization: 'Bearer meh',
          'elite-authorization': 'token stuff',
        },
      });
  });

  it('The authorization decorartor should set the authorization header from the token store', () => {
    const context = {};
    contextProperties.setTokens(context, 'access', 'refresh');

    const configuration = decorators.addAuthorizationHeader(context, {});
    expect(configuration).to.deep.equal(
      {
        headers: {
          authorization: 'Bearer access',
        },
      },
    )
  })
});