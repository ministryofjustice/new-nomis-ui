const createNamespace = require('continuation-local-storage').createNamespace;
const getNamespace = require('continuation-local-storage').getNamespace;

const jwtNamespace = 'jwt';
const accessTokenKey = 'accessToken';
const refreshTokenKey = 'refreshToken';
createNamespace(jwtNamespace);

const run = (callback) => getNamespace(jwtNamespace).run(callback);

const storeTokens = (accessToken, refreshToken) => {
  const session = getNamespace(jwtNamespace);
  session.set(accessTokenKey, accessToken);
  session.set(refreshTokenKey, refreshToken);
};

const getAccessToken = () => {
  const session = getNamespace(jwtNamespace);
  return session.get(accessTokenKey)
};

const getRefreshToken = () => {
  const session = getNamespace(jwtNamespace);
  return session.get(refreshTokenKey);
};

const tokenStore = {
  run,
  storeTokens,
  getAccessToken,
  getRefreshToken,
};

module.exports = tokenStore;

