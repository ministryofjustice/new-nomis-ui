const auth = require('../mockApis/auth')
const { resetStubs } = require('../mockApis/wiremock')
const elite2api = require('../mockApis/elite2api')

module.exports = on => {
  on('task', {
    reset: () => Promise.all([resetStubs()]),

    getLoginUrl: auth.getLoginUrl,

    stubLogin: () =>
      Promise.all([
        auth.stubLogin(),
        auth.stubUserRoles(),
        auth.stubUsersMe(),
        elite2api.stubUser(),
        elite2api.stubUserCaseloads(),
      ]),

    stubOffenderDetails: elite2api.stubOffenderDetails,

    stubOffenders: elite2api.stubOffenders,

    stubLocations: elite2api.stubLocations,

    stubLocation: elite2api.stubLocation,

    stubImage: elite2api.stubImage,

    stubIEP: elite2api.stubIEP,

    stubAliases: elite2api.stubAliases,

    stubAlertTypes: elite2api.stubAlertTypes,

    stubOffenderAddresses: elite2api.stubOffenderAddresses,

    stubWhereabouts: elite2api.stubWhereabouts,

    stubStaffRolesForKeyWorker: elite2api.stubStaffRolesForKeyWorker,

    stubBookingAlerts: elite2api.stubBookingAlerts,

    stubUserDetailsRetrieval: auth.stubUserDetailsRetrieval,

    stubUsersMe: auth.stubUsersMe,

    stubUserRoles: auth.stubUserRoles,
  })
}
