/* eslint consistent-return:0 */
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bunyanMiddleware = require('bunyan-middleware');
const hsts = require('hsts');
const appInsights = require('applicationinsights');
const helmet = require('helmet');
const path = require('path');

const setup = require('./middlewares/frontend-middleware');

const { logger } = require('./services/logger');
const apiProxy = require('./apiproxy');
const config = require('./config');

const sessionManagementRoutes = require('./sessionManagementRoutes');
const clientFactory = require('./api/oauthEnabledClient');
const eliteApiFactory = require('./api/eliteApi').eliteApiFactory;
const keyworkerApiFactory = require('./api/keyworkerApi').keyworkerApiFactory;
const oauthApiFactory = require('./api/oauthApi');
const tokeRefresherFactory = require('./tokenRefresher').factory;
const cookieOperationsFactory = require('./hmppsCookie').cookieOperationsFactory;
const controllerFactory = require('./controller').controllerFactory;
const userServiceFactory = require('./services/user').userServiceFactory;
const bookingServiceFactory = require('./services/booking').bookingServiceFactory;
const eventsServiceFactory = require('./services/events').eventsServiceFactory;
const keyworkerServiceFactory = require('./services/keyworker').keyworkerServiceFactory;

const requestForwarding = require('./request-forwarding');

const sixtyDaysInSeconds = 5184000;

const app = express();

app.set('trust proxy', 1); // trust first proxy

// set the view engine to ejs
app.set('view engine', 'ejs');

if (config.app.production && config.analytics.appInsightsKey) {
  appInsights.setup(config.analytics.appInsightsKey)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .start();
}

app.use(helmet());
app.use(hsts({
  maxAge: sixtyDaysInSeconds,
  includeSubDomains: true,
  preload: true,
}));

app.use(bunyanMiddleware({ logger }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/config', (req, res) => {
  const url = config.app.feedbackUrl;
  const omicUrl = config.apis.keyworker.ui_url;
  const mailTo = config.app.mailTo;
  if (!url && !omicUrl && !mailTo) {
    res.end();
    return;
  }
  res.json({
    url,
    omicUrl,
    mailTo,
  });
});

app.use('/health', apiProxy);
app.use('/info', apiProxy);
app.use('/docs', apiProxy);
app.use('/api/swagger.json', apiProxy);

const eliteApi = eliteApiFactory(
  clientFactory({
    baseUrl: config.apis.elite2.url,
    timeout: 10000,
    useGateway: config.app.useApiAuthGateway,
  }));


const keyworkerApi = keyworkerApiFactory(
  clientFactory({
    baseUrl: config.apis.keyworker.url,
    timeout: 10000,
    useGateway: config.app.useApiAuthGateway,
  }));

const oauthApi = oauthApiFactory({ ...config.apis.elite2, useGateway: config.app.useApiAuthGateway });
const tokenRefresher = tokeRefresherFactory(oauthApi.refresh, config.app.tokenRefreshThresholdSeconds);

const userService = userServiceFactory(eliteApi);
const bookingService = bookingServiceFactory(eliteApi, keyworkerApi);
const eventsService = eventsServiceFactory(eliteApi);
const keyworkerService = keyworkerServiceFactory(eliteApi, keyworkerApi);

const controller = controllerFactory({
  elite2Api: eliteApi,
  userService,
  bookingService,
  eventsService,
  keyworkerService,
});

app.get('/terms', controller.terms);

const hmppsCookieOperations = cookieOperationsFactory(
  {
    name: config.hmppsCookie.name,
    domain: config.hmppsCookie.domain,
    cookieLifetimeInMinutes: config.hmppsCookie.expiryMinutes,
    secure: config.app.production,
  },
);

/* login, logout, hmppsCookie management, token refresh etc */
sessionManagementRoutes.configureRoutes({
  app,
  eliteApi,
  oauthApi,
  hmppsCookieOperations,
  tokenRefresher,
  mailTo: config.app.mailTo,
});

// Don't cache dynamic resources (except images which override this)
app.use(helmet.noCache());

app.use('/app/keydates/:offenderNo', controller.keyDates);
app.use('/app/bookings/details/:offenderNo', controller.bookingDetails);
app.use('/app/bookings/quicklook/:offenderNo', controller.quickLook);
app.use('/app/bookings/scheduled/events/forThisWeek/:offenderNo', controller.eventsForThisWeek);
app.use('/app/bookings/scheduled/events/forNextWeek/:offenderNo', controller.eventsForNextWeek);
app.use('/app/bookings/loadAppointmentViewModel/:agencyId', controller.loadAppointmentViewModel);
app.use('/app/bookings/addAppointment/:offenderNo', controller.addAppointment);
app.use('/app/bookings/:offenderNo/alerts', controller.alerts);
app.get('/app/bookings/:offenderNo/caseNotes', controller.caseNotes);
app.post('/app/bookings/:offenderNo/caseNotes', controller.addCaseNote);
app.put('/app/bookings/:offenderNo/caseNotes/:caseNoteId', controller.caseNote);
app.get('/app/bookings/:offenderNo/caseNotes/:caseNoteId', controller.caseNote);
app.get('/app/images/:imageId/data', controller.getImage);
app.get('/app/users/me/bookingAssignments', controller.myAssignments);
app.get('/app/users/me', controller.user);

// Extract pagination header information from requests and set on the 'context'
app.use('/app', requestForwarding.extractRequestPaginationMiddleware);

// Forward requests to the eliteApi get/post functions.
app.use('/app', requestForwarding.forwardingHandlerFactory(eliteApi));

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: path.resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const host = config.app.host; // Let http.Server use its default IPv6/4 host
const port = config.app.port;

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err);
  }
  logger.info(`Application started on port: ${port}, ${host}`);
});
