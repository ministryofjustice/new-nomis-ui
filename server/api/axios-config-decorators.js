const contextProperties = require('../contextProperties')

const getHeaders = context => {
  const paginationHeaders = contextProperties.getRequestPagination(context)
  const accessToken = contextProperties.getAccessToken(context)
  return accessToken ? { authorization: `Bearer ${accessToken}`, ...paginationHeaders } : paginationHeaders
}

module.exports = {
  getHeaders,
}
