const proxy = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const modifyResponse = require('node-http-proxy-json');

const useApiAuth = (process.env.USE_API_GATEWAY_AUTH || 'no') === 'yes';
const baseUrl = process.env.API_ENDPOINT_URL || 'http://localhost:7080/api';

const HEALTH_CHECK_PATH = '/info/health';
const appInfo = getAppInfo();

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

function getAppInfo() {
  let packageData = JSON.parse(fs.readFileSync('./package.json'));

  let appInfo = {};

  appInfo.name = packageData.name;
  appInfo.version = packageData.version;
  appInfo.description = packageData.description;

  return appInfo;
}

function healthCheckResponse(status) {
  let response = appInfo;

  response.api = status;

  return response;
}

const onErrorHandler = (err, req, res) => {
  if (req.path === HEALTH_CHECK_PATH) {
    res.writeHead(500, {
      'Content-Type': 'application/json'
    });

    res.end(JSON.stringify(healthCheckResponse("DOWN")));
  } else {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });

    res.end('Something went wrong.');
  }
}

const onProxyResponse = (proxyRes, req, res) => {
  res.setHeader('access-control-allow-origin', req.headers.host);
  res.setHeader("cache-control", "no-store");
  res.setHeader("pragma", "no-cache");

  // If health check request, check and translate response content-type
  if (req.path === HEALTH_CHECK_PATH) {
    const responseContentType = proxyRes.headers['content-type'];

    if (!responseContentType.startsWith('application/json') && responseContentType.includes('json')) {
      proxyRes.headers['content-type'] = 'application/json;charset=UTF-8';
    }

    delete proxyRes.headers['content-length'];

    modifyResponse(res, proxyRes.headers['content-encoding'], function (body) {
      let revisedResponse = body;

      if (body) {
        revisedResponse = healthCheckResponse(body);
      }

      return revisedResponse;
    });
  }
}

const onProxyRequest = (proxyReq, req) => {
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
}

// proxy middleware options
const options = {
  target: baseUrl,                  // target host
  changeOrigin: true,               // needed for virtual hosted sites
  ws: true,                         // proxy websockets
  pathRewrite: {
    '^/api': '',                    // rewrite path
    '^/health': HEALTH_CHECK_PATH,
  },
  logProvider: (provider) => {
    return require('winston');
  },
  onError: onErrorHandler,
  onProxyRes: onProxyResponse,
  onProxyReq: onProxyRequest,
};

// create the proxy (without context)
const apiProxy = proxy(options);

module.exports = apiProxy;
