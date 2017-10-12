/* eslint consistent-return:0 */
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const logger = require('./logger');
const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontendMiddleware');
const resolve = require('path').resolve;
const app = express();
const jsonParser = bodyParser.json();

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
const apiProxy = require('./apiproxy');
const application = require('./app');
const controller = require('./controller');
const session = require('./session');

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
app.use('/app/keydates/:bookingId', controller.keyDates);

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
