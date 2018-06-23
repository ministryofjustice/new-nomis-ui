const axios = require('axios');
const oauthApi = require('./oauthApi');
const interceptors = require('./axios-interceptors');
const { logger } = require('../services/logger');

/**
 * Build a client for the supplied configuration. The client wraps axios get and post, while ensuring that
 * the remote calls carry valid oauth and gateway headers.  If the oauth token exipres the client attempts
 * to refresh the token before retrying the request.
 *
 * @param baseUrl The base url to be used with the client's get and post
 * @param timeout The timeout to apply to get and post.
 * @param useGateway
 * @returns {{get: (function(*=): *), post: (function(*=, *=): *)}}
 */
const factory = ({ baseUrl, timeout, useGateway }) => {
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout,
  });

  // Apply interceptors in the opposite order to that in which they are to be run.
  // We want the authorization interceptor to run first, to apply that one last!

  if (useGateway) {
    axiosInstance.interceptors.request.use(
      interceptors.gatewayInterceptor,
      interceptors.passThroughErrorInterceptor);
  }

  axiosInstance.interceptors.request.use(
    interceptors.authorizationInterceptor,
    interceptors.passThroughErrorInterceptor);

  const throwUnlessUnauthorized = (error) => {
    if (!(error.response && error.response.status === 401)) {
      logger.error(error);
      throw error;
    }
  };

  /**
   * An Axios GET request with Oauth token refresh and retry behaviour
   *
   * @param uri
   * @returns A Promise which resolves to the Axios result object,
   */
  const get = (uri) => axiosInstance
      .get(uri)
      .catch(error => {
        throwUnlessUnauthorized(error);
        logger.info(`Unauthorized GET ${uri}. Trying an OAuth refresh`);

        return oauthApi
          .refresh()
          .then(() => axiosInstance.get(uri))
      });

  /**
   * An Axios POST with Oauth token refresh and retry behaviour
   * @param uri
   * @param body
   * @returns A Promise which resolves to the Axios result object, or the Axios error object if it is rejected
   */
  const post = (uri, body) => axiosInstance
    .post(uri, body)
    .catch(error => {
      throwUnlessUnauthorized(error);
      logger.info(`Unauthorized POST ${uri}. Trying an OAuth refresh`);

      return oauthApi
        .refresh()
        .then(() => axiosInstance.post(uri, body))
    });

  return {
    get,
    post,
  }
};

module.exports = factory;