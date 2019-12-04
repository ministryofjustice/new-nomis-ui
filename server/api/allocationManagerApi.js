const contextProperties = require('../contextProperties')

const processResponse = context => response => {
  contextProperties.setResponsePagination(context, response.headers)
  return response.body
}

const processError = error => {
  // If the allocation manager throws an error, log it
  // but don't throw (prevents app throwing a fit)

  /* eslint-disable no-console */
  console.log(error)
  return {}
}

const allocationManagerApiFactory = client => {
  const get = (context, url) =>
    client
      .get(context, url)
      .then(processResponse(context))
      .catch(processError)

  const getPomByOffenderNo = (context, offenderNo) => {
    get(context, `api/allocation/${offenderNo}`)
  }

  return {
    getPomByOffenderNo,
  }
}

module.exports = { allocationManagerApiFactory }
