const config = require('../config')
const { logger } = require('../services/logger')

const tokenVerificationApiFactory = client => {
  const verifyToken = context => {
    if (!config.apis.tokenverification.enabled) {
      logger.debug('Token verification disabled, returning token is valid')
      return true
    }
    return client
      .post(context, `/token/verify`)
      .then(response => Boolean(response.body && response.body.active))
      .catch(() => false)
  }

  return { verifyToken }
}

module.exports = { tokenVerificationApiFactory }
