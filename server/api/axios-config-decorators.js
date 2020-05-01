const superagent = require('superagent')
const querystring = require('querystring')
const contextProperties = require('../contextProperties')
const { apis } = require('../config')

const getHeaders = context => {
  const paginationHeaders = contextProperties.getRequestPagination(context)
  const accessToken = contextProperties.getAccessToken(context)
  return accessToken ? { authorization: `Bearer ${accessToken}`, ...paginationHeaders } : paginationHeaders
}

const getClientToken = async () => {
  const { clientSecret, clientId } = apis.oauth2
  const basicClientToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const oauthRequest = querystring.stringify({ grant_type: 'client_credentials' })

  const authResponse = await superagent
    .post(`${apis.oauth2.url}oauth/token`)
    .set('Authorization', `Basic ${basicClientToken}`)
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(oauthRequest)
    .timeout({
      response: 1000,
      deadline: 1500,
    })

  return authResponse.body.access_token
}

const getClientAuthedHeaders = async context => {
  const paginationHeaders = contextProperties.getRequestPagination(context)
  const clientToken = await getClientToken()
  return { authorization: `Bearer ${clientToken}`, ...paginationHeaders }
}

module.exports = {
  getHeaders,
  getClientAuthedHeaders,
}
