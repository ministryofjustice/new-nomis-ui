/* eslint-disable no-console */
require('dotenv').config()
const config = require('../server/config')
const oauthApiFactory = require('../server/api/oauthApi')
const clientFactory = require('../server/api/oauthEnabledClient')
const tokenRefresherFactory = require('../server/tokenRefresher').factory
const common = require('./common')

const oauthApi = oauthApiFactory(
  clientFactory({
    baseUrl: config.apis.oauth2.url,
    timeout: 10000,
  }),
  { ...config.apis.oauth2 }
)

const eliteClient = clientFactory({
  baseUrl: config.apis.elite2.url,
  timeout: 10000,
})

const refreshTokens = tokenRefresherFactory(oauthApi.refresh, 45)

const credentials = common.usage()

const context = {}

const authenticate = () => oauthApi.authenticate(context, credentials.username, credentials.password)

const getAgency = () => eliteClient.get(context, '/api/agencies')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const check = () =>
  refreshTokens(context)
    .then(getAgency)
    .then(result => {
      const agencies = result.data
      console.log(new Date())
      console.log(agencies[0].description)
      common.printTokens(context)
    })
    .then(() => delay(10000))

const program = () => {
  let p = authenticate()
  for (let i = 0; i < 24; i += 1) {
    p = p.then(check)
  }
  return p
}

program()
  .then(() => console.log('done'))
  .catch(e => console.log(e))
