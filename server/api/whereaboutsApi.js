const contextProperties = require('../contextProperties')
const { logger } = require('../services/logger')

const whereaboutsApiFactory = client => {
  const processResponse = context => response => {
    contextProperties.setResponsePagination(context, response.headers)
    return response.body
  }

  const get = (context, url) =>
    client
      .get(context, url)
      .then(processResponse(context))
      .catch(err => {
        logger.error(err)
      })

  const getWhereaboutsConfig = (context, agencyId) => get(context, `/agencies/${agencyId}/locations/whereabouts`)
  return {
    getWhereaboutsConfig,
  }
}

module.exports = { whereaboutsApiFactory }
