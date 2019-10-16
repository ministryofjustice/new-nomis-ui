/* eslint consistent-return:0 */
require('dotenv').config()

const express = require('express')
const bunyanMiddleware = require('bunyan-middleware')
const path = require('path')

const apis = require('./apis')

const setup = require('./middlewares/frontend-middleware')
const setupBodyParsers = require('./setupBodyParsers')
const setupHealthChecks = require('./setupHealthChecks')
const setupTelemetry = require('./setupTelemetry')
const setupRoutes = require('./setupRoutes')
const setupWebSecurity = require('./setupWebSecurity')
const setupWebSession = require('./setupWebSession')
const setupAuth = require('./setupAuth')

const { logger } = require('./services/logger')
const config = require('./config')

const app = express()

setupTelemetry()

app.set('trust proxy', 1) // trust first proxy
app.set('view engine', 'ejs')

app.use(setupBodyParsers())
app.use(setupHealthChecks())
app.use(setupWebSecurity())
app.use(setupWebSession())
app.use(setupAuth({ oauthApi: apis.oauthApi }))
app.use(setupRoutes(apis))

app.use(express.static(path.join(__dirname, '../public')))
// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: path.resolve(process.cwd(), 'build'),
  publicPath: '/',
})

const { port } = config.app
app.listen(port, err => {
  if (err) {
    return logger.error(err)
  }
  logger.info(`Application started on port: ${port}`)
})
