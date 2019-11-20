const express = require('express')
const config = require('./config')
const healthFactory = require('./services/healthCheck')

const router = express.Router()

module.exports = () => {
  const health = healthFactory(
    config.apis.oauth2.url,
    config.apis.elite2.url,
    config.apis.keyworker.url,
    config.apis.caseNotes.url,
    config.apis.allocationManager.url
  )

  router.get('/health', (req, res, next) => {
    health((err, result) => {
      if (err) {
        return next(err)
      }
      if (!(result.status === 'UP')) {
        res.status(503)
      }
      res.json(result)
      return result
    })
  })

  router.get('/ping', (req, res) => res.send('pong'))

  return router
}
