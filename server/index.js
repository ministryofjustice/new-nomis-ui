/* eslint consistent-return:0 */
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const bunyanMiddleware = require('bunyan-middleware')
const hsts = require('hsts')
const appInsights = require('applicationinsights')
const helmet = require('helmet')
const path = require('path')
const url = require('url')

const setup = require('./middlewares/frontend-middleware')

const { logger } = require('./services/logger')
const apiProxy = require('./apiproxy')
const config = require('./config')

const sessionManagementRoutes = require('./sessionManagementRoutes')
const clientFactory = require('./api/oauthEnabledClient')
const { healthApiFactory } = require('./api/healthApi')
const { eliteApiFactory } = require('./api/eliteApi')
const { keyworkerApiFactory } = require('./api/keyworkerApi')
const oauthApiFactory = require('./api/oauthApi')
const tokeRefresherFactory = require('./tokenRefresher').factory
const { controllerFactory } = require('./controller')
const { userServiceFactory } = require('./services/user')
const { bookingServiceFactory } = require('./services/booking')
const { eventsServiceFactory } = require('./services/events')
const { keyworkerServiceFactory } = require('./services/keyworker')

const requestForwarding = require('./request-forwarding')

const sixtyDaysInSeconds = 5184000

const app = express()

app.set('trust proxy', 1) // trust first proxy

// set the view engine to ejs
app.set('view engine', 'ejs')

if (config.app.production && config.analytics.appInsightsKey) {
  appInsights
    .setup(config.analytics.appInsightsKey)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .start()
}

app.use(helmet())
app.use(
  hsts({
    maxAge: sixtyDaysInSeconds,
    includeSubDomains: true,
    preload: true,
  })
)

app.use(bunyanMiddleware({ logger }))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(
  cookieSession({
    name: config.hmppsCookie.name,
    domain: config.hmppsCookie.domain,
    maxAge: config.hmppsCookie.expiryMinutes * 60 * 1000,
    secure: config.app.production,
    httpOnly: true,
    signed: false,
    overwrite: true,
    sameSite: 'lax',
  })
)

app.use(express.static(path.join(__dirname, '../public')))

app.use('/config', (req, res) => {
  const { feedbackUrl, mailTo } = config.app
  const omicUrl = config.apis.keyworker.ui_url
  const prisonStaffHubUrl = config.apis.prisonStaffHub.ui_url

  if (!feedbackUrl && !omicUrl && !prisonStaffHubUrl && !mailTo) {
    res.end()
    return
  }
  res.json({
    feedbackUrl,
    omicUrl,
    whereaboutsUrl: url.resolve(prisonStaffHubUrl, 'whereaboutssearch'),
    establishmentRollcheckUrl: url.resolve(prisonStaffHubUrl, 'establishmentroll'),
    globalSearchUrl: url.resolve(prisonStaffHubUrl, 'globalsearch'),
    mailTo,
  })
})

app.use('/health', apiProxy)

const healthApi = healthApiFactory(
  clientFactory({
    baseUrl: config.apis.elite2.url,
    timeout: 10000,
  })
)

const eliteApi = eliteApiFactory(
  clientFactory({
    baseUrl: config.apis.elite2.url,
    timeout: config.apis.elite2.timeoutSeconds * 1000,
  })
)

const keyworkerApi = keyworkerApiFactory(
  clientFactory({
    baseUrl: config.apis.keyworker.url,
    timeout: config.apis.keyworker.timeoutSeconds * 1000,
  })
)

const oauthApi = oauthApiFactory({ ...config.apis.oauth2 })
const tokenRefresher = tokeRefresherFactory(oauthApi.refresh, config.app.tokenRefreshThresholdSeconds)

const userService = userServiceFactory(eliteApi)
const bookingService = bookingServiceFactory(eliteApi, keyworkerApi)
const eventsService = eventsServiceFactory(eliteApi)
const keyworkerService = keyworkerServiceFactory(eliteApi, keyworkerApi)

const controller = controllerFactory({
  elite2Api: eliteApi,
  userService,
  bookingService,
  eventsService,
  keyworkerService,
})

app.get('/terms', controller.terms)

/* login, logout, hmppsCookie management, token refresh etc */
sessionManagementRoutes.configureRoutes({
  app,
  healthApi,
  oauthApi,
  tokenRefresher,
  mailTo: config.app.mailTo,
})

// Don't cache dynamic resources (except images which override this)
app.use(helmet.noCache())

// Extract pagination header information from requests and set on the 'context'
app.use('/app', requestForwarding.extractRequestPaginationMiddleware)

app.use('/app/keydates/:offenderNo', controller.keyDates)
app.use('/app/bookings/details/:offenderNo', controller.bookingDetails)
app.use('/app/bookings/quicklook/:offenderNo', controller.quickLook)
app.use('/app/bookings/scheduled/events/forThisWeek/:offenderNo', controller.eventsForThisWeek)
app.use('/app/bookings/scheduled/events/forNextWeek/:offenderNo', controller.eventsForNextWeek)
app.use('/app/bookings/loadAppointmentViewModel/:agencyId', controller.loadAppointmentViewModel)
app.use('/app/bookings/addAppointment/:offenderNo', controller.addAppointment)
app.use('/app/bookings/:offenderNo/alerts', controller.alerts)
app.get('/app/bookings/:offenderNo/caseNotes', controller.caseNotes)
app.post('/app/bookings/:offenderNo/caseNotes', controller.addCaseNote)
app.put('/app/bookings/:offenderNo/caseNotes/:caseNoteId', controller.amendCaseNote)
app.get('/app/bookings/:offenderNo/caseNotes/:caseNoteId', controller.caseNote)
app.get('/app/images/:imageId/data', controller.getImage)
app.get('/app/users/me/bookingAssignments', controller.myAssignments)
app.get('/app/users/me', controller.user)

// Forward requests to the eliteApi get/post functions.
app.use('/app', requestForwarding.forwardingHandlerFactory(eliteApi))

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: path.resolve(process.cwd(), 'build'),
  publicPath: '/',
})

const { port } = config.app
// Start your app.
app.listen(port, err => {
  if (err) {
    return logger.error(err)
  }
  logger.info(`Application started on port: ${port}`)
})
