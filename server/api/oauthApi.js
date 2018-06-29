const axios = require('axios');
const querystring = require('querystring');
const contextProperties = require('../contextProperties');

/**
 * Return an oauthApi built using the supplied configuration.
 * @param apiConfig An object wiht properties 'url', 'clientId' and 'clientSecret'. This aligns with the properties
 * on config.apis.elite2Api (see ../config.js).
 */
const oauthApiFactory = (apiConfig) => {
  const apiClientCredentials = new Buffer(`${querystring.escape(apiConfig.clientId)}:${querystring.escape(apiConfig.clientSecret)}`).toString('base64');

  const oauthAxios = axios.create({
    method: 'post',
    baseURL: apiConfig.url,
    timeout: 2000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const makeRequest = (context, data) => oauthAxios({
    url: 'oauth/token',
    data,
    headers: {
      authorization: `Basic ${apiClientCredentials}`,
      // Not convinced that the header 'access-control-allow-origin': reqHeaders.host is needed or even makes sense here.
    },
    context,
  })
    .then(response => contextProperties.setTokens(context, response.data.access_token, response.data.refresh_token));

  /**
   * Perform OAuth authentication, storing the returned tokens in the supplied context.
   * @param context The request scoped context.
   * @param username
   * @param password
   * @returns a Promise that is fulfilled when authentication has succeeded and the OAuth tokens have been stored. A
   * fulfilled promise has no result, but a rejected promise contains an axios response
   */
  const authenticate = (context, username, password) =>
    makeRequest(context, `username=${username.toUpperCase()}&password=${password}&grant_type=password`);

  /**
   * Perform OAuth token refresh, storing the returned tokens in the supplied context. See scopedStore.run.
   * @returns A Promise that resolves when token refresh has succeeded and the OAuth tokens have been stored.
   */
  const refresh = (context) =>
    makeRequest(context, `refresh_token=${contextProperties.getRefreshToken(context)}&grant_type=refresh_token`);

  return {
    authenticate,
    refresh,
    // Expose the internals so they can be Monkey Patched for testing. Oo oo oo.
    oauthAxios,
  };
};

module.exports = oauthApiFactory;

