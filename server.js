var path = require('path');
var express = require('express');
var expressNunjucks = require('express-nunjucks');
let proxy = require('http-proxy-middleware');
let jwt = require('jsonwebtoken');
var morgan = require('morgan');
var app = express();
const appInsights = require('./azure-appinsights');

var port = process.env.PORT || 3000;
var dev = process.env.NODE_ENV !== 'production';


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
  let signedToken = jwt.sign(payload, cert, {algorithm: 'ES256'});
  return signedToken;
}

// proxy middleware options
let options = {
  target: baseUrl, // target host
  changeOrigin: true,               // needed for virtual hosted sites
  ws: true,                         // proxy websockets
  pathRewrite: {
    '^/api/' : '/api/'     // rewrite path
  },
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
app.use('/api', apiProxy);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

var nunjucks = expressNunjucks(app, {
  autoescape: true,
  watch: dev
});
nunjucks.env.addFilter('slugify', function(str) {
  return str.replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()’]/g,"").replace(/ +/g,'_').toLowerCase();
});
nunjucks.env.addFilter('formatDate', function(str,format) {
  return moment(str).format(format);
});
nunjucks.env.addFilter('log', function log(a) {
  var nunjucksSafe = env.getFilter('safe');
  return nunjucksSafe('<script>console.log(' + JSON.stringify(a, null, '\t') + ');</script>');
});

app.use(morgan('dev'));

// if (dev) {
//   var webpack = require('webpack');
//   var webpackDevMiddleware = require('webpack-dev-middleware');
//   var webpackConfig = require('./webpack.config');
//
//   var compiler = webpack(webpackConfig);
//   app.use(webpackDevMiddleware(compiler, {
//     publicPath: webpackConfig.output.publicPath
//   }));
//   console.log('Webpack compilation enabled');
//
//   var chokidar = require('chokidar');
//   chokidar.watch('./app', {ignoreInitial: true}).on('all', (event, path) => {
//     console.log("Clearing /app/ module cache from server");
//     Object.keys(require.cache).forEach(function(id) {
//       if (/[\/\\]app[\/\\]/.test(id)) delete require.cache[id];
//     });
//   });
// }

// Middleware to serve static assets
[
  '/public',
  '/app/assets',
  '/node_modules/govuk_template_mustache/assets',
  '/node_modules/govuk_frontend_toolkit'
].forEach((folder) => {
  app.use('/', express.static(path.join(__dirname, folder)));
});

// send assetPath to all views
app.use(function (req, res, next) {
  res.locals.asset_path = "/public/";
  next();
});

// start the app
app.listen(port, () => {
  console.log('Listening on port ' + port);
});
