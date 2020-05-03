const superagent = require('superagent')
const { Readable } = require('stream')
const Agent = require('agentkeepalive')
const { HttpsAgent } = require('agentkeepalive')
const { logger } = require('../services/logger')

const { getHeaders, getClientAuthedHeaders } = require('./axios-config-decorators')

const resultLogger = result => {
  logger.debug(`${result.req.method} ${result.req.path} ${result.status}`)
  return result
}

const errorLogger = error => {
  const status = error.response ? error.response.status : '-'
  const responseData = error.response ? error.response.body : '-'
  if (error.response && error.response.req) {
    logger.warn(
      `API error in ${error.response.req.method} ${error.response.req.path} ${status} ${error.message} ${responseData}`
    )
  } else logger.warn(`API error with message ${error.message}`)
  return error
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
  const agentOptions = {
    maxSockets: 100,
    maxFreeSockets: 10,
    freeSocketTimeout: 30000,
  }
  const keepaliveAgent = baseUrl.startsWith('https') ? new HttpsAgent(agentOptions) : new Agent(agentOptions)

  /**
   * A superagent GET request with Oauth token
   *
   * @param context A request scoped context. Holds OAuth tokens and pagination information for the request
   * @param path relative path to get.
   * @returns A Promise which settles to the superagent result object if the promise is resolved, otherwise to the 'error' object.
   */
  const get = (context, path) =>
    new Promise((resolve, reject) => {
      superagent
        .get(baseUrl + path)
        .agent(keepaliveAgent)
        .set(getHeaders(context))
        .retry(2, (err, res) => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .timeout({ deadline: timeout / 3 })
        .end((error, response) => {
          if (error) reject(errorLogger(error))
          else if (response) resolve(resultLogger(response))
        })
    })

  /**
   * A superagent GET request with Client token
   *
   * @param context A request scoped context. Holds OAuth tokens and pagination information for the request
   * @param path relative path to get.
   * @returns A Promise which settles to the superagent result object if the promise is resolved, otherwise to the 'error' object.
   */
  const getClientAuthed = async (context, path) => {
    const headers = await getClientAuthedHeaders(context)
    return superagent
      .get(baseUrl + path)
      .agent(keepaliveAgent)
      .set(headers)
      .retry(2, (err, res) => {
        if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
        return undefined // retry handler only for logging retries, not to influence retry logic
      })
      .timeout({ deadline: timeout / 3 })
  }

  /**
   * An superagent POST with Oauth token refresh and retry behaviour
   * @param context A request scoped context. Holds OAuth tokens and pagination information for the request
   * @param path relative path to post to.
   * @param body
   * @returns A Promise which resolves to the superagent result object, or the superagent error object if it is rejected
   */
  const post = (context, path, body) =>
    new Promise((resolve, reject) => {
      superagent
        .post(baseUrl + path)
        .send(body)
        .set(getHeaders(context))
        .end((error, response) => {
          if (error) reject(errorLogger(error))
          else if (response) resolve(resultLogger(response))
        })
    })
  const put = (context, path, body) =>
    new Promise((resolve, reject) => {
      superagent
        .put(baseUrl + path)
        .send(body)
        .set(getHeaders(context))
        .end((error, response) => {
          if (error) reject(errorLogger(error))
          else if (response) resolve(resultLogger(response))
        })
    })

  const getStream = (context, path) =>
    new Promise((resolve, reject) => {
      superagent
        .get(baseUrl + path)
        .agent(keepaliveAgent)
        .set(getHeaders(context))
        .retry(2, (err, res) => {
          if (err) logger.info(`Retry handler found API error with ${err.code} ${err.message}`)
          return undefined // retry handler only for logging retries, not to influence retry logic
        })
        .timeout({ deadline: timeout / 3 })
        .end((error, response) => {
          if (error) reject(errorLogger(error))
          else if (response) {
            resultLogger(response)
            const s = new Readable()
            // eslint-disable-next-line no-underscore-dangle
            s._read = () => {}
            s.push(response.body)
            s.push(null)
            resolve(s)
          }
        })
    })

  return {
    get,
    getStream,
    post,
    put,
    getClientAuthed,
  }
}

module.exports = factory
