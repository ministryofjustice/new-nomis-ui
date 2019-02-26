/* eslint-disable no-console */
require('dotenv').config()
const config = require('../server/config')
const oauthApiFactory = require('../server/api/oauthApi')
const clientFactory = require('../server/api/oauthEnabledClient')
const common = require('./common')

const oauthApi = oauthApiFactory(
  clientFactory({
    baseUrl: config.apis.oauth2.url,
    timeout: 10000,
  }),
  { ...config.apis.oauth2 }
)

const credentials = common.usage()

const context = {}

oauthApi
  .authenticate(context, credentials.username, credentials.password)
  .then(() => {
    console.info(`authenticate(${credentials.username}, *****)`)
    common.printTokens(context)
  })
  .then(() => oauthApi.refresh(context))
  .then(() => {
    console.info('refresh()')
    common.printTokens()
  })
  .catch(error => {
    console.error(`Caught error: Status ${error.response.status}`)
  })
