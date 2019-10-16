const clientFactory = require('./api/oauthEnabledClient')
const config = require('./config')
const { eliteApiFactory } = require('./api/eliteApi')
const { keyworkerApiFactory } = require('./api/keyworkerApi')
const { caseNotesApiFactory } = require('./api/caseNotesApi')
const { oauthApiFactory } = require('./api/oauthApi')

const eliteApi = eliteApiFactory(
  clientFactory({
    baseUrl: config.apis.elite2.url,
    timeout: config.apis.elite2.timeoutSeconds * 1000,
  })
)

const keyworkerApi = keyworkerApiFactory(
  clientFactory({
    baseUrl: config.apis.keyworker.url,
    timeout: config.apis.keyworker.timeoutSeconds * 1000,
  })
)

const caseNotesApi = caseNotesApiFactory(
  clientFactory({
    baseUrl: config.apis.caseNotes.url,
    timeout: config.apis.caseNotes.timeoutSeconds * 1000,
  })
)

const oauthApi = oauthApiFactory(
  clientFactory({
    baseUrl: config.apis.oauth2.url,
    timeout: config.apis.oauth2.timeoutSeconds * 1000,
  }),
  { ...config.apis.oauth2 }
)

module.exports = {
  eliteApi,
  keyworkerApi,
  caseNotesApi,
  oauthApi,
}
