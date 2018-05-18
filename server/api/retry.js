/* eslint-disable camelcase */
const axios = require('axios');
const querystring = require('querystring');
const nurl = require('url');
const session = require('../session');
const gatewayToken = require('../jwt-token');
const { logger } = require('../services/logger');
const config = require('../config');
const utils = require('../utils');

const apiClientId = config.apis.elite2.clientId;
const apiClientSecret = config.apis.elite2.clientSecret;

const encodeClientCredentials = () => new Buffer(`${querystring.escape(apiClientId)}:${querystring.escape(apiClientSecret)}`).toString('base64');

const getRequest = ({ req, res, url, headers, disableGatewayMode }) => service.callApi({
  method: 'get',
  url,
  headers: headers || {},
  reqHeaders: { jwt: { access_token: req.access_token, refresh_token: req.refresh_token }, host: req.headers.host },
  onTokenRefresh: session.updateHmppsCookie(res),
  disableGatewayMode,
}).then(response => new Promise(r => {
  copyPaginationHeadersOver(response.headers, res);
  return r(response.data);
})).catch(error => {
  if (errorStatusCode(error) === 503) {
    res.status(503);
    res.end();
  }
  return new Promise(r => r(error))
});

const callApi = ({ method, url, headers, reqHeaders, onTokenRefresh, responseType, data, disableGatewayMode = false }) => {
  const { access_token, refresh_token } = reqHeaders.jwt;

  return service.httpRequest({
    url,
    method,
    responseType,
    data,
    headers: getAuthHeaders({ headers, reqHeaders, access_token }),
  }, disableGatewayMode
  ).catch(error => {
    logger.error(url);
    logger.error(error);

    if (error.response && error.response.status === 401) {
      return service.refreshTokenRequest({ token: refresh_token, headers, reqHeaders })
        .then(response => {
          onTokenRefresh(response.data);
          return service.httpRequestRetry({
            url,
            method,
            responseType,
            headers: getAuthHeaders({ headers, reqHeaders, access_token: response.data.access_token }),
          }, disableGatewayMode);
        })
    }
    throw error;
  });
};

function httpRequest(options, disableGatewayMode) {
  if (!disableGatewayMode && config.app.useApiAuthGateway) {
    options.headers = options.headers || {};
    const apiToken = options.headers.authorization;
    if (apiToken) {
      options.headers['elite-authorization'] = apiToken; // eslint-disable-line no-param-reassign
    }
    options.headers.authorization = `Bearer ${gatewayToken.generateToken()}`; // eslint-disable-line no-param-reassign
  }
  return axios(options);
}

function httpRequestRetry(options, disableGatewayMode) {
  return httpRequest(options, disableGatewayMode);
}

const getApiHealth = () => httpRequest({
  url: nurl.resolve(config.apis.elite2.url, 'health'),
  method: 'get',
  timeout: 2000,
}).then(() => true, () => false);

const refreshTokenRequest = ({ headers, reqHeaders, token }) => axios({
  method: 'post',
  url: nurl.resolve(config.apis.elite2.url, 'oauth/token'),
  headers: getClientHeaders({ headers, reqHeaders }),
  data: `refresh_token=${token}&grant_type=refresh_token`,
});

const getClientHeaders = ({ headers, reqHeaders }) => Object.assign({}, headers, {
  authorization: `Basic ${encodeClientCredentials()}`,
  'Content-Type': 'application/x-www-form-urlencoded',
  'access-control-allow-origin': reqHeaders.host,
});

const getAuthHeaders = ({ headers, reqHeaders, access_token }) => Object.assign({}, headers, {
  authorization: `bearer ${access_token}`,
  'access-control-allow-origin': reqHeaders.host,
});

function copyPaginationHeadersOver(axiosResponseHeaders, res) {
  const pagination = ['page-offset','page-limit','sort-fields','sort-order', 'total-records'];
  const responseHeaders = utils.extractProperties(pagination, axiosResponseHeaders);
  Object.keys(responseHeaders).forEach(key => {
    res.setHeader(key, responseHeaders[key]);
  });
}

const errorStatusCode = (error) => {
  if (error && error.response) {
    return error.response.status;
  }

  if (error && error.code === 'ECONNREFUSED') { 
    return 503;
  }

  return 500;
};

const service = {
  callApi,
  httpRequest,
  httpRequestRetry,
  refreshTokenRequest,
  errorStatusCode,
  encodeClientCredentials,
  getRequest,
  getApiHealth,
};

module.exports = service;