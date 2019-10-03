/* eslint consistent-return:0 */
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const passport = require('passport')
const bunyanMiddleware = require('bunyan-middleware')
const hsts = require('hsts')
const appInsights = require('applicationinsights')
const helmet = require('helmet')
const path = require('path')
const flash = require('connect-flash')
const fs = require('fs')

const setup = require('./middlewares/frontend-middleware')

const { logger } = require('./services/logger')
const config = require('./config')

const sessionManagementRoutes = require('./sessionManagementRoutes')
const auth = require('./auth')
const clientFactory = require('./api/oauthEnabledClient')
const healthFactory = require('./services/healthCheck')
const { eliteApiFactory } = require('./api/eliteApi')
const { keyworkerApiFactory } = require('./api/keyworkerApi')
const { caseNotesApiFactory } = require('./api/caseNotesApi')
const { oauthApiFactory } = require('./api/oauthApi')
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
  const packageData = JSON.parse(fs.readFileSync('./package.json'))

  appInsights
    .setup(config.analytics.appInsightsKey)
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
    .start()
  appInsights.defaultClient.context.tags['ai.cloud.role'] = `${packageData.name}`
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

app.use(express.static(path.join(__dirname, '../public')))

app.use('/config', (req, res) => {
  const { feedbackUrl, mailTo } = config.app
  const omicUrl = config.apis.keyworker.ui_url
  const prisonStaffHubUrl = config.apis.prisonStaffHub.ui_url
  const categorisationUrl = config.apis.categorisation.ui_url
  const useOfForceUrl = config.apis.useOfForce.ui_url
  const pathfinderUrl = config.apis.pathfinder.ui_url

  if (!feedbackUrl && !omicUrl && !prisonStaffHubUrl && !mailTo && !categorisationUrl) {
    res.end()
    return
  }
  res.json({
    feedbackUrl,
    omicUrl,
    prisonStaffHubUrl,
    mailTo,
    categorisationUrl,
    useOfForceUrl,
    pathfinderUrl,
  })
})

const health = healthFactory(
  config.apis.oauth2.url,
  config.apis.elite2.url,
  config.apis.keyworker.url,
  config.apis.caseNotes.url
)

app.get('/health', (req, res, next) => {
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

app.get('/ping', (req, res) => res.send('pong'))

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

const caseNotesApi = caseNotesApiFactory(
  clientFactory({
    baseUrl: config.apis.caseNotes.url,
    timeout: config.apis.caseNotes.timeoutSeconds * 1000,
  })
)

const oauthApi = oauthApiFactory(
  clientFactory({
    baseUrl: config.apis.oauth2.url,
    timeout: config.apis.oauth2.timeoutSeconds * 1000,
  }),
  { ...config.apis.oauth2 }
)
auth.init(oauthApi)
const tokenRefresher = tokeRefresherFactory(oauthApi.refresh, config.app.tokenRefreshThresholdSeconds)

const userService = userServiceFactory(eliteApi, oauthApi, config)
const bookingService = bookingServiceFactory(eliteApi, keyworkerApi)
const eventsService = eventsServiceFactory(eliteApi)
const keyworkerService = keyworkerServiceFactory(eliteApi, oauthApi, keyworkerApi)

const controller = controllerFactory({
  elite2Api: eliteApi,
  userService,
  bookingService,
  eventsService,
  keyworkerService,
  caseNotesApi,
})

app.use(
  cookieSession({
    name: config.hmppsCookie.name,
    domain: config.hmppsCookie.domain,
    maxAge: config.hmppsCookie.expiryMinutes * 60 * 1000,
    secure: config.app.production,
    httpOnly: true,
    signed: true,
    keys: [config.hmppsCookie.sessionSecret],
    overwrite: true,
    sameSite: 'lax',
  })
)

// Ensure cookie session is extended (once per minute) when user interacts with the server
app.use((req, res, next) => {
  // eslint-disable-next-line no-param-reassign
  req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
  next()
})

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

/* login, logout, token refresh etc */
sessionManagementRoutes.configureRoutes({
  app,
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
app.use('/app/bookings/getExistingEvents/:agencyId/:offenderNo', controller.getExistingEvents)
app.use('/app/appointments/:offenderNo', controller.addAppointment)
app.use('/app/bookings/:offenderNo/alerts', controller.alerts)
app.get('/app/bookings/:offenderNo/caseNotes', controller.caseNotes)
app.post('/app/bookings/:offenderNo/caseNotes', controller.addCaseNote)
app.put('/app/bookings/:offenderNo/caseNotes/:caseNoteId', controller.amendCaseNote)
app.get('/app/full-size-image/:imageId/data', controller.getFullSizeImage)
app.get('/app/images/:imageId/data', controller.getImage)
app.get('/app/users/me/bookingAssignments', controller.myAssignments)
app.get('/app/users/me/caseNoteTypes', controller.myCaseNoteTypes)
app.get('/app/users/me', controller.user)
app.use('/app/reference-domains/caseNoteTypes', controller.caseNoteTypes)

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
