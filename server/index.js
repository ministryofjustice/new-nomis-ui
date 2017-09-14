/* eslint consistent-return:0 */
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const logger = require('./logger');
const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontendMiddleware');
const resolve = require('path').resolve;


const appinsights = require('./applicationinsights').appInsights;
const app = express();
const jsonParser = bodyParser.json();

const minutes = process.env.WEB_SESSION_TIMEOUT_IN_MINUTES || 30;
const expiry = 10000 * 60 * minutes;

app.use(session({
  secret: "ajkkdhaskjhfkjahdkjdshakj78687623872464398749827weorkjflkjsl",
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: 'auto',
    maxAge: expiry
  },
  rolling: true
}));

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
const apiProxy = require('./apiproxy');
const application = require('./app');

app.use('/app/login',jsonParser, application.login);
app.use('/app/photo', jsonParser, application.images);
app.use('/app',jsonParser, application.sessionHandler);
//app.use('/api', apiProxy);
app.use('/health', apiProxy);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
  appinsightsKey: appinsights.client.config.instrumentationKey,
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.host);
  res.header('Cache-control', 'no-store');
  res.header('Pragma', 'no-cache');
  next();
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
