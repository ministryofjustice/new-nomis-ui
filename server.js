#!/usr/bin/env node

/**
 * Module dependencies.
 */

let app = require('./app');
let debug = require('debug')('nomis-web:server');
let http = require('http');
let httpProxy = require('http-proxy');
let jwt = require('jsonwebtoken');

//const baseUrl = 'http://10.200.1.152:4888/';
const baseUrl = process.env.API_GATEWAY_URL || 'https://noms-api-dev.dsd.io/';

//
// Create your proxy server and set the target in the options.
//
let proxy = httpProxy.createProxyServer(
  {
    target: baseUrl,
    changeOrigin: true
  }
).listen(3010);


proxy.on('proxyReq', function(proxyReq, req, res, options) {
  let authHeader = req.headers['authorization'];
  if (authHeader !== undefined) {
    proxyReq.setHeader('elite-authorization', authHeader);
  }

  // Add Api Gateway JWT header token
  let jwToken = generateToken();
  proxyReq.setHeader('authorization', 'Bearer ' + jwToken);
});


function generateToken() {
  let nomsToken = process.env.NOMS_TOKEN;
  let milliseconds = Math.round((new Date()).getTime() / 1000);

  let payload = {
    "iat": milliseconds,
    "token": nomsToken
  };

  let privateKey = process.env.NOMS_PRIVATE_KEY || '';
  let cert = Buffer.from(privateKey, 'utf8');

  // let cert = fs.readFileSync('client.key');  // get private key
  return jwt.sign(payload, cert, {algorithm: 'ES256'});
}


/**
 * Get port from environment and store in Express.
 */
let port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
