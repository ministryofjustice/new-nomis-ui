const createNamespace = require('cls-hooked').createNamespace;
const getNamespace = require('cls-hooked').getNamespace;

const clsNamespace = 'uk.gov.justice.digital.hmpps.notm';
const accessTokenKey = 'accessToken';
const refreshTokenKey = 'refreshToken';

const initialise = () => getNamespace(clsNamespace) || createNamespace(clsNamespace);

initialise();

const run = (callback) => getNamespace(clsNamespace).run(callback);

const storeTokens = (accessToken, refreshToken) => {
  const session = getNamespace(clsNamespace);
  session.set(accessTokenKey, accessToken);
  session.set(refreshTokenKey, refreshToken);
};

const getAccessToken = () => {
  const session = getNamespace(clsNamespace);
  return session.get(accessTokenKey)
};

const getRefreshToken = () => {
  const session = getNamespace(clsNamespace);
  return session.get(refreshTokenKey);
};

const scopedStore = {
  initialise,
  run,
  storeTokens,
  getAccessToken,
  getRefreshToken,
};

module.exports = scopedStore;

