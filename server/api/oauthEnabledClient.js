const axios = require('axios');
const interceptors = require('./axios-interceptors');

/**
 * Build a client for the supplied configuration. The client wraps axios get and post, while ensuring that
 * the remote calls carry valid oauth and gateway headers.
 *
 * @param baseUrl The base url to be used with the client's get and post
 * @param timeout The timeout to apply to get and post.
 * @param useGateway
 * @returns {{get: (function(*=): *), post: (function(*=, *=): *)}}
 */
const factory = ({ baseUrl, timeout }) => {
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout,
  });

  // Apply interceptors in the opposite order to that in which they are to be run.
  // We want the authorization interceptor to run first, so apply that one last!

  axiosInstance.interceptors.request.use(
    interceptors.authorizationInterceptor,
    interceptors.passThroughErrorInterceptor);

  /**
   * An Axios GET request with Oauth token
   *
   * @param context A request scoped 'context' carrying an authToken property
   * @param url if url is relative then baseURL will be prepended. If the url is absolute the baseURL is ignored.
   * @returns A Promise which settles to the Axios result object if the promise is resolved, otherwise to the 'error' object.
   */
  const get = (context, url) =>
    axiosInstance(
      {
        method: 'get',
        url,
        context,
      });

  /**
   * An Axios POST with Oauth token refresh and retry behaviour
   * @param context an object carrying an authToken property
   * @param url if url is relative then the baseURL will be prepended. If the url is absolute then baseURL is ignored.
   * @param body
   * @returns A Promise which resolves to the Axios result object, or the Axios error object if it is rejected
   */
  const post = (context, url, body) => axiosInstance(
    {
      method: 'post',
      url,
      data: body,
      context,
    });

  return {
    get,
    post,
  }
};

module.exports = factory;