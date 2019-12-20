const { stubFor } = require('./wiremock')

module.exports = {
  stubGetKeyworkerByPrisonAndOffenderNo: (prisonId, offenderNo) => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/key-worker/${prisonId}/offender/${offenderNo}`,
      },
      response: {
        status: 404,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: {},
      },
    })
  },
}
