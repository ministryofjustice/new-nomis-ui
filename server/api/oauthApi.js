const axios = require('axios');
const querystring = require('querystring');
const apiConfig = require('../config').apis.elite2;
const useApiAuthGateway = require('../config').app.useApiAuthGateway;
const tokenStore = require('../tokenStore');
const axiosInterceptors = require('./axios-interceptors');

const apiClientCredentials = new Buffer(`${querystring.escape(apiConfig.clientId)}:${querystring.escape(apiConfig.clientSecret)}`).toString('base64');

// use a private Axios instance configured for this API.  Hmm. Static configuration is making this brittle.

const oauthAxios = axios.create({
  baseURL: apiConfig.url,
  timeout: 2000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

if (useApiAuthGateway) {
  oauthAxios.interceptors.request.use(
    axiosInterceptors.gatewayInterceptor,
    axiosInterceptors.passThroughErrorInterceptor);
}

const makeRequest = (data) => oauthAxios.post(
  'oauth/token',
  data,
  {
    headers: {
      authorization: `Basic ${apiClientCredentials}`,
      // Not convinced that the header 'access-control-allow-origin': reqHeaders.host is needed or even makes sense here.
    },
  })
  .then(response => tokenStore.storeTokens(response.data.access_token, response.data.refresh_token));

/**
 * Perform OAuth authentication, storing the returned tokens in the tokeStore continuation-local-storage
 * context. See tokenStore.run.
 * @param username
 * @param password
 * @returns a Promise that is fulfilled when authentication has succeeded and the OAuth tokens have been stored. A
 * fulfilled promise has no result, but a rejected promise contains an axios response
 */
const authenticate = (username, password) =>
  makeRequest(`username=${username.toUpperCase()}&password=${password}&grant_type=password`);

/**
 * Perform OAuth token refresh, storing the returned tokens in the tokenStore continuation-local-storage
 * context. See tokenStore.run.
 * @returns A Promise that resolves when token refresh has succeeded and the OAuth tokens have been stored.
 */
const refresh = () =>
  makeRequest(`refresh_token=${tokenStore.getRefreshToken()}&grant_type=refresh_token`);

const oauth = {
  authenticate,
  refresh,
  // Yuk, don't like exposing this, but it is needed for testing.  Is there a better way? Like injecting the configured axios instance?
  oauthAxios,
};

module.exports = oauth;

