const clientFactory = require('./api/oauthEnabledClient')
const config = require('./config')
const { eliteApiFactory } = require('./api/eliteApi')
const { keyworkerApiFactory } = require('./api/keyworkerApi')
const { caseNotesApiFactory } = require('./api/caseNotesApi')
const { oauthApiFactory } = require('./api/oauthApi')
const { allocationManagerApiFactory } = require('./api/allocationManagerApi')
const { whereaboutsApiFactory } = require('./api/whereaboutsApi')
const { dataComplianceApiFactory } = require('./api/dataComplianceApi')

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

const allocationManagerApi = allocationManagerApiFactory(
  clientFactory({
    baseUrl: config.apis.allocationManager.url,
    timeout: config.apis.allocationManager.timeoutSeconds * 1000,
  })
)

const whereaboutsApi = whereaboutsApiFactory(
  clientFactory({
    baseUrl: config.apis.whereabouts.url,
    timeout: config.apis.whereabouts.timeoutSeconds * 1000,
  })
)

const dataComplianceApi = dataComplianceApiFactory(
  clientFactory({
    baseUrl: config.apis.dataCompliance.url,
    timeout: config.apis.dataCompliance.timeoutSeconds * 1000,
  })
)

module.exports = {
  eliteApi,
  keyworkerApi,
  caseNotesApi,
  oauthApi,
  allocationManagerApi,
  whereaboutsApi,
  dataComplianceApi,
}
