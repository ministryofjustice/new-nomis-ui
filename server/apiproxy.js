const proxy = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

const useApiAuth = (process.env.USE_API_GATEWAY_AUTH || 'no') === 'yes';
const baseUrl = process.env.API_ENDPOINT_URL || 'http://localhost:7080/api';

function generateToken() {
  const nomsToken = process.env.NOMS_TOKEN;
  const milliseconds = Math.round((new Date()).getTime() / 1000);

  const payload = {
    iat: milliseconds,
    token: nomsToken,
  };

  const privateKey = process.env.NOMS_PRIVATE_KEY || '';
  const cert = new Buffer(privateKey);
  return jwt.sign(payload, cert, { algorithm: 'ES256' });
}

// proxy middleware options
const options = {
  target: baseUrl,                  // target host
  changeOrigin: true,               // needed for virtual hosted sites
  ws: true,                         // proxy websockets
  pathRewrite: {
    '^/api': '',                  // rewrite path
  },
  logProvider: (provider) => {
    return require('winston');
  },
  onError: (err, req, res) => {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Something went wrong.');
  },
  onProxyRes: (proxyRes, req, res) => {
    res.setHeader('access-control-allow-origin', req.headers.host);
    res.setHeader("Cache-control", "no-store");
    res.setHeader("Pragma", "no-cache");
  },
  onProxyReq: (proxyReq, req) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== undefined) {
      proxyReq.setHeader('elite-authorization', authHeader);
    }

    if (useApiAuth) {
      // Add Api Gateway JWT header token
      try {
        const jwToken = generateToken();
        proxyReq.setHeader('authorization', `Bearer ${jwToken}`);
      } catch (err) {
        console.log('Token failure', err);
        proxyReq.setHeader('authorization', `JUNK`);
      }
    }
  },
};

// create the proxy (without context)
const apiProxy = proxy(options);

module.exports = apiProxy;
