const generateToken = require('../jwt-token').generateToken;
const scopedStore = require('../scopedStore');

const ELITE_AUTH_HEADER = 'elite-authorization';

/**
 * An Axios request interceptor. Sets a gateway token on the 'authorization' header, having first moved any
 * authorization header value to the 'elite-authorization' header.
 * @param config The current state of the Axios request configuration. (See The Axios documentation for details).
 */
const gatewayInterceptor = config => {
  config.headers = config.headers || {};
  const authorizationHeader = config.headers.authorization;
  if (authorizationHeader) {
    config.headers[ELITE_AUTH_HEADER] = authorizationHeader;
  }
  config.headers.authorization = `Bearer ${generateToken()}`;
  return config;
};

/**
 * Set the authorization header using an OAuth token from the scopedStore.
 * @param config
 * @returns modified Axios request configuration.
 */
const authorizationInterceptor = config => {
  const accessToken = scopedStore.getAccessToken();
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.authorization = `Bearer ${scopedStore.getAccessToken()}`;
  }
  return config;
};


const passThroughErrorInterceptor = error => Promise.reject(error);

module.exports = {
  gatewayInterceptor,
  authorizationInterceptor,
  passThroughErrorInterceptor,
};