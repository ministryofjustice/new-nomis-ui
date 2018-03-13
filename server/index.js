/* eslint consistent-return:0 */
require('dotenv').config();

const express = require('express');
const { json: jsonParser, urlencoded } = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bunyanMiddleware = require('bunyan-middleware');
const hsts = require('hsts');
const appInsights = require('applicationinsights');
const helmet = require('helmet');
const { resolve } = require('path');
const { logger } = require('./services/logger');

const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontend-middleware');
const app = express();

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

if (process.env.NODE_ENV === 'production' && process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .start();
}

if (process.env.NODE_ENV === 'production') {
  sessionConfig.secure = true // serve secure cookies
}

app.use(helmet());
app.use(hsts({
  maxAge: sixtyDaysInSeconds,
  includeSubDomains: true,
  preload: true,
}));
app.use(cookieParser());
app.use(jsonParser());

app.use(cookieSession(sessionConfig));

app.use(bunyanMiddleware({ 
  logger,
}));

app.use(clientVersionValidator);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.host);
  res.header('Cache-control', 'no-store');
  res.header('Pragma', 'no-cache');
  next();
});


app.use(express.static('fonts'));
app.use(express.static('img'));

app.use(session.hmppsSessionMiddleWare);

// Update a value in the cookie so that the set-cookie will be sent.
// Only changes every minute so that it's not sent with every request.
app.use((req, res, next) => {
  req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
  next();
});

app.use('/feedbackUrl', (req,res) => {
  const url = process.env.FEEDBACK_URL;

  if (!url) {
    res.end();
    return;
  }

  res.json({
    url,
  });
});

app.get('/login', controller.loginIndex);
app.post('/login', urlencoded({ extended: false }), controller.login);
app.get('/logout', controller.logout);
app.use('/app/photo', controller.images);
app.use('/app/keydates/:bookingId', controller.keyDates);
app.use('/app/bookings/details/:bookingId', controller.bookingDetails);
app.use('/app/bookings/quicklook/:bookingId', controller.quickLook);
app.use('/app/bookings/scheduled/events/forThisWeek/:bookingId', controller.eventsForThisWeek);
app.use('/app/bookings/scheduled/events/forNextWeek/:bookingId', controller.eventsForNextWeek);
app.use('/app/bookings/loadAppointmentViewModel/:agencyId', controller.loadAppointmentViewModel);
app.use('/app/bookings/addAppointment/:bookingId', controller.addAppointment);

app.use('/app', application.sessionHandler);
app.use('/health', apiProxy);
app.use('/info', apiProxy);
app.use('/docs', apiProxy);
app.use('/api/swagger.json', apiProxy);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';
const port = argv.port || process.env.PORT || 3000;

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err);
  }
  logger.info(`Application started on port: ${port}, ${prettyHost}`);
});
