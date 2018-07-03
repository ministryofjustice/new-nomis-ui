const jwtToken = require('../jwt-token');
const contextProperties = require('../contextProperties');

const ELITE_AUTH_HEADER = 'elite-authorization';

const addAuthorizationHeader = (context, config) => {
  const accessToken = contextProperties.getAccessToken(context);
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.authorization = `Bearer ${accessToken}`;
  }
  return config;
};

/**
 * Don't like this, but the pagination information is being passed around in headers. If that information were
 * conveyed in request parameters or as part of the body of a request then this wouldn't be necessary.
 * @param context A request scoped context. Holds OAuth tokens and pagination information for the request
 * @param config
 * @returns {*}
 */
const addPaginationHeaders = (context, config) => {
  const paginationHeaders = contextProperties.getRequestPagination(context);
  config.headers = config.headers || {};
  Object.assign(config.headers, paginationHeaders);
  return config;
};

/**
 * Set a gateway token on the 'authorization' header, having first moved any
 * authorization header value to the 'elite-authorization' header.
 * @param config The axios configuration to modify
 */
const addGatewayHeader = config => {
  config.headers = config.headers || {};
  const authorizationHeader = config.headers.authorization;
  if (authorizationHeader) {
    config.headers[ELITE_AUTH_HEADER] = authorizationHeader;
  }
  config.headers.authorization = `Bearer ${jwtToken.generateToken()}`;
  return config;
};

module.exports = {
  addAuthorizationHeader,
  addGatewayHeader,
  addPaginationHeaders,
};
