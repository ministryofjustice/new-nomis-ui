let proxy = require('http-proxy-middleware');
let jwt = require('jsonwebtoken');

const useApiAuth = process.env.USE_API_AUTH || true;
const baseUrl = process.env.API_GATEWAY_URL || 'http:/localhost:7080';
const rewriteEndpoint = process.env.REWRITE_CONTEXT_ENDPOINT || '/api/';

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
  pathRewrite: {
    '^/api/' : rewriteEndpoint     // rewrite path
  },
  onProxyReq: function onProxyReq(proxyReq, req, res) {
    let authHeader = req.headers['authorization'];
    if (authHeader !== undefined) {
      proxyReq.setHeader('elite-authorization', authHeader);
    }

    if (useApiAuth === true) {
      // Add Api Gateway JWT header token
      let jwToken = generateToken();
      proxyReq.setHeader('authorization', 'Bearer ' + jwToken);
    }
  }
};

// create the proxy (without context)
let apiProxy = proxy(options);

module.exports = apiProxy;


