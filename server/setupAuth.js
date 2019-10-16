const express = require('express')
const passport = require('passport')
const flash = require('connect-flash')
const config = require('./config')
const sessionManagementRoutes = require('./sessionManagementRoutes')
const tokeRefresherFactory = require('./tokenRefresher').factory
const auth = require('./auth')

const router = express.Router()

module.exports = ({ oauthApi }) => {
  auth.init(oauthApi)
  const tokenRefresher = tokeRefresherFactory(oauthApi.refresh, config.app.tokenRefreshThresholdSeconds)

  router.use(passport.initialize())
  router.use(passport.session())
  router.use(flash())

  sessionManagementRoutes.configureRoutes({
    app: router,
    tokenRefresher,
    mailTo: config.app.mailTo,
  })

  return router
}
