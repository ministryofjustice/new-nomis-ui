let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let proxy = require('http-proxy-middleware');
let jwt = require('jsonwebtoken');
let index = require('./routes/index');

//const baseUrl = 'http://10.200.1.152:4888/';
const baseUrl = process.env.API_GATEWAY_URL || 'https://noms-api-dev.dsd.io/';

function generateToken() {
  let nomsToken = process.env.NOMS_TOKEN;
  let milliseconds = Math.round((new Date()).getTime() / 1000);

  let payload = {
    "iat": milliseconds,
    "token": nomsToken
  };

  let privateKey = process.env.NOMS_PRIVATE_KEY || '';
  let cert = new Buffer(privateKey);

  return jwt.sign(payload, cert, {algorithm: 'ES256'});
}

// proxy middleware options
let options = {
  target: baseUrl, // target host
  changeOrigin: true,               // needed for virtual hosted sites
  ws: true,                         // proxy websockets
  // pathRewrite: {
  //   '^/api/' : '/api'     // rewrite path
  // },
  onProxyReq: function onProxyReq(proxyReq, req, res) {
    let authHeader = req.headers['authorization'];
    if (authHeader !== undefined) {
      proxyReq.setHeader('elite-authorization', authHeader);
    }

    // Add Api Gateway JWT header token
    let jwToken = generateToken();
    proxyReq.setHeader('authorization', 'Bearer ' + jwToken);
  }
};

// create the proxy (without context)
let apiProxy = proxy(options);

let app = express();
app.use('/api', apiProxy);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
