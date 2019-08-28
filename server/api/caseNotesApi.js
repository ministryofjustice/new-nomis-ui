const contextProperties = require('../contextProperties')

const processResponse = context => response => {
  contextProperties.setResponsePagination(context, response.headers)
  return response.body
}

const processError = error => {
  if (!error.response) throw error
  if (!error.response.status) throw error
  if (error.response.status !== 404) throw error // Not Found
  return {}
}

const caseNotesApiFactory = client => {
  const get = (context, url) =>
    client
      .get(context, url)
      .then(processResponse(context))
      .catch(processError)

  const post = (context, url, data) => client.post(context, url, data).then(processResponse(context))

  const getCaseNoteTypes = context => get(context, '/case-notes/types')

  return { getCaseNoteTypes, post }
}

module.exports = { caseNotesApiFactory }