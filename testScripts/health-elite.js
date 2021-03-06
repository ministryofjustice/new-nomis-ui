/* eslint-disable no-console */
require('dotenv').config()
const config = require('../server/config')
const clientFactory = require('../server/api/oauthEnabledClient')

const eliteApiClient = clientFactory({
  baseUrl: config.apis.elite2.url,
  timeout: 10000,
})

console.log('get(ping)')
eliteApiClient
  .get({}, 'ping')
  .then(result => {
    console.info(result.data)
  })
  .catch(error => {
    console.error(`code: ${error.code}`)
    console.error(`port: ${error.port}`)
    console.error(`response: ${error.response}`)
  })
