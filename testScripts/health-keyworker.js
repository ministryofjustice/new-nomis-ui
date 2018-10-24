/* eslint-disable no-console */
require('dotenv').config()
const config = require('../server/config')
const clientFactory = require('../server/api/oauthEnabledClient')

const keyworkerApiClient = clientFactory({
  baseUrl: config.apis.keyworker.url,
  timeout: 10000,
})

console.log('get(health)')
keyworkerApiClient
  .get({}, 'health')
  .then(result => {
    console.info(result.data)
  })
  .catch(error => {
    console.error(`code: ${error.code}`)
    console.error(`port ${error.port}`)
    console.error(`response: ${error.response}`)
  })
