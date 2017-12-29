/* eslint consistent-return:0 */
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const appInsights = require('applicationinsights');

const logger = require('./logger');
const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontend-middleware');
const resolve = require('path').resolve;
const app = express();
const jsonParser = bodyParser.json();

const apiProxy = require('./apiproxy');
const application = require('./app');
const controller = require('./controller');
const session = require('./session');
const clientVersionValidator = require('./middlewares/validate-client-version');

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

app.use(clientVersionValidator);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.host);
  res.header('Cache-control', 'no-store');
  res.header('Pragma', 'no-cache');
  next();
});

app.use((req,res,next) => {
  if (req.url.indexOf('app') >= 0 && req.url !== '/app/login') {
    if (session.isAuthenticated(req.headers) === false) {
      res.status(401);
      res.end();
      return;
    }
  }
  next();
});

app.use(express.static('fonts'));
app.use(express.static('img'));

app.use('/app/login',jsonParser, controller.login);
app.use('/app/photo', jsonParser, controller.images);
app.use('/app/keydates/:bookingId', jsonParser, controller.keyDates);
app.use('/app/bookings/details/:bookingId', jsonParser, controller.bookingDetails);
app.use('/app/bookings/quicklook/:bookingId', jsonParser, controller.quickLook);
app.use('/app/bookings/scheduled/events/forThisWeek/:bookingId', jsonParser, controller.eventsForThisWeek);
app.use('/app/bookings/scheduled/events/forNextWeek/:bookingId', jsonParser, controller.eventsForNextWeek);
app.use('/app/bookings/loadAppointmentViewModel/:agencyId', jsonParser, controller.loadAppointmentViewModel);
app.use('/app/bookings/addAppointment/:bookingId', jsonParser, controller.addAppointment);

app.use('/app',jsonParser, application.sessionHandler);
app.use('/health', apiProxy);
app.use('/api/info', apiProxy);
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
    return logger.error(err.message);
  }
  logger.appStarted(port, prettyHost);
});
