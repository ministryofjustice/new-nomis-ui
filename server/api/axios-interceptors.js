const contextProperties = require('../contextProperties');

/**
 * Set the authorization header using an OAuth token from the 'context'.
 * @param config
 * @returns modified Axios request configuration.
 */
const authorizationInterceptor = config => {
  const accessToken = contextProperties.getAccessToken(config.context);
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.authorization = `Bearer ${accessToken}`;
  }
  return config;
};


const passThroughErrorInterceptor = error => Promise.reject(error);

module.exports = {
  authorizationInterceptor,
  passThroughErrorInterceptor,
};