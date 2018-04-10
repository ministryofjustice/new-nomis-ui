/* eslint consistent-return:0 */
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bunyanMiddleware = require('bunyan-middleware');
const hsts = require('hsts');
const appInsights = require('applicationinsights');
const helmet = require('helmet');
const path = require('path');

const setup = require('./middlewares/frontend-middleware');
const app = express();

const { logger } = require('./services/logger');
const apiProxy = require('./apiproxy');
const application = require('./app');
const controller = require('./controller');
const session = require('./session');
const config = require('./config');
const clientVersionValidator = require('./middlewares/validate-client-version');

const sixtyDaysInSeconds = 5184000;
const sessionExpiryMinutes = config.session.expiryMinutes * 60 * 1000;

const sessionConfig = {
  name: config.session.name,
  secret: config.session.secret,
  sameSite: true,
  expires: new Date(Date.now() + sessionExpiryMinutes),
  maxAge: sessionExpiryMinutes, // 1 hour
};

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

if (config.app.production) {
  sessionConfig.secure = true // serve secure cookies
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
app.use(cookieSession(sessionConfig));

app.use(clientVersionValidator);

app.use(express.static(path.join(__dirname, '../public')));

// Update a value in the cookie so that the set-cookie will be sent.
// Only changes every minute so that it's not sent with every request.
app.use((req, res, next) => {
  req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
  next();
});

app.use('/feedbackUrl', (req,res) => {
  const url = config.app.feedbackUrl;

  if (!url) {
    res.end();
    return;
  }

  res.json({
    url,
  });
});

app.use('/health', apiProxy);
app.use('/info', apiProxy);
app.use('/docs', apiProxy);
app.use('/api/swagger.json', apiProxy);

app.get('/login', session.loginMiddleware, controller.loginIndex);
app.post('/login', controller.login);
app.get('/logout', controller.logout);

app.use(session.hmppsSessionMiddleWare);
app.use(session.extendHmppsCookieMiddleWare);

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
app.put('/app/bookings/:offenderNo/caseNotes/:caseNoteId', controller.updateCaseNote);
app.get('/app/bookings/:offenderNo/image/data', controller.offenderImage);
app.get('/app/images/:imageId/data', controller.getImage);
app.get('/app/users/me/bookingAssignments', controller.myAssignments);

app.use('/app', application.sessionHandler);

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
