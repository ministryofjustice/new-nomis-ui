/* eslint consistent-return:0 */
require('dotenv').config()

// Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
// In particular, applicationinsights automatically collects bunyan logs
require('./azure-appinsights')

const express = require('express')
const path = require('path')

const apis = require('./apis')

const setup = require('./middlewares/frontend-middleware')
const setupBodyParsers = require('./setupBodyParsers')
const setupHealthChecks = require('./setupHealthChecks')
const setupRoutes = require('./setupRoutes')
const setupWebSecurity = require('./setupWebSecurity')
const setupWebSession = require('./setupWebSession')
const setupAuth = require('./setupAuth')

const { logger } = require('./services/logger')
const config = require('./config')

const app = express()

app.set('trust proxy', 1) // trust first proxy
app.set('view engine', 'ejs')

app.use(setupBodyParsers())
app.use(setupHealthChecks())
app.use(setupWebSecurity())

app.use('/client.js', express.static(path.join(__dirname, '../build/client.js')))
app.use('/styles.css', express.static(path.join(__dirname, '../build/styles.css')))
app.use('/favicon.ico', express.static(path.join(__dirname, '../build/favicon.ico')))
app.use('/fonts', express.static(path.join(__dirname, '../build/fonts')))
app.use('/img', express.static(path.join(__dirname, '../build/img')))
app.use('/images', express.static(path.join(__dirname, '../build/images')))
app.use(express.static(path.join(__dirname, '../public')))

app.use(setupWebSession())
app.use(setupAuth({ oauthApi: apis.oauthApi }))
app.use(setupRoutes(apis))

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
