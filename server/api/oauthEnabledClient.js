const axios = require('axios')
const superagent = require('superagent')
const { logger } = require('../services/logger')

const { addAuthorizationHeader, addPaginationHeaders, getHeaders } = require('./axios-config-decorators')

const superAgentResultHandler = result => {
  logger.debug(`${result.req.method} ${result.req.path} ${result.status}`)
  return result
}

const superAgentErrorHandler = error => {
  const status = error.response ? error.response.status : '-'
  const responseData = error.response ? error.response.data : '-'
  if (error.response && error.response.req) {
    logger.warn(
      `API error in ${error.response.req.method} ${error.response.req.path} ${status} ${error.message} ${responseData}`
    )
  } else logger.warn(`API error with message ${error.message}`)
  return error
}

const resultLogger = result => {
  logger.debug(`${result.config.method} ${result.config.url} ${result.status} ${result.statusText}`)
  return result
}

const errorLogger = error => {
  const status = error.response ? error.response.status : '-'
  const responseData = error.response ? error.response.data : '-'
  logger.warn(`API error in ${error.config.method} ${error.config.url} ${status} ${error.message} ${responseData}`)
  throw error
}

/**
 * Build a client for the supplied configuration. The client wraps axios get, post, put etc while ensuring that
 * the remote calls carry valid oauth headers.
 *
 * @param baseUrl The base url to be used with the client's get and post
 * @param timeout The timeout to apply to get and post.
 * @returns {{get: (function(*=): *), post: (function(*=, *=): *)}}
 */
const factory = ({ baseUrl, timeout }) => {
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout,
  })

  const addHeaders = (context, config) => addPaginationHeaders(context, addAuthorizationHeader(context, config))

  /**
   * A superagent GET request with Oauth token
   *
   * @param context A request scoped context. Holds OAuth tokens and pagination information for the request
   * @param path relative path to retrieve.
   * @returns A Promise which settles to the superagent result object if the promise is resolved, otherwise to the 'error' object.
   */
  const get = (context, path) =>
    new Promise((resolve, reject) => {
      superagent
        .get(baseUrl + path)
        .set(getHeaders(context))
        .retry(2, (err, res) => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .timeout({ deadline: timeout / 3 })
        .end((error, response) => {
          if (error) reject(superAgentErrorHandler(error))
          else if (response) resolve(superAgentResultHandler(response))
        })
    })

  /**
   * An Axios POST with Oauth token refresh and retry behaviour
   * @param context A request scoped context. Holds OAuth tokens and pagination information for the request
   * @param url if url is relative then the baseURL will be prepended. If the url is absolute then baseURL is ignored.
   * @param body
   * @returns A Promise which resolves to the Axios result object, or the Axios error object if it is rejected
   */
  const post = (context, url, body) =>
    axiosInstance(
      addHeaders(context, {
        method: 'post',
        url,
        data: body,
      })
    )
      .then(resultLogger)
      .catch(errorLogger)

  const put = (context, url, body) =>
    axiosInstance(
      addHeaders(context, {
        method: 'put',
        url,
        data: body,
      })
    )
      .then(resultLogger)
      .catch(errorLogger)

  const getStream = (context, url) =>
    axiosInstance(
      addHeaders(context, {
        method: 'get',
        url,
        responseType: 'stream',
      })
    ).catch(errorLogger)

  return {
    get,
    getStream,
    post,
    put,
    axiosInstance, // exposed for testing...
  }
}

module.exports = factory
