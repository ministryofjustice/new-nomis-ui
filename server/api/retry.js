/* eslint-disable camelcase */
const axios = require('axios');
const nurl = require('url');
const session = require('../session');
const gatewayToken = require('../jwt-token');
const { logger } = require('../services/logger');
const config = require('../config');
const utils = require('../utils');
const oauthApi = require('./oauthApi');
const tokenStore = require('../tokenStore');

const getRequest = ({ req, res, url, headers, disableGatewayMode }) => service.callApi({
  method: 'get',
  url,
  headers,
  host: req.headers.host,
  onTokenRefresh: () => session.setHmppsCookie(res),
  disableGatewayMode,
}).then(response => {
  copyPaginationHeadersOver(response.headers, res);
  return response.data;
}).catch(error => {
  logger.error(error);
  if (errorStatusCode(error) === 503) {
    res.status(503);
    res.end();
  }
});

async function getKeyworkerRequest({ req, res, url, headers, disableGatewayMode }) {
  try {
    const request = await service.callApi({
      method: 'get',
      url,
      headers,
      host: req.headers.host,
      onTokenRefresh: () => session.setHmppsCookie(res),
      disableGatewayMode,
    });

    return request.data
  } catch (error) {
    return {}
  }
}

const callApi = ({ method, url, headers, host, onTokenRefresh, responseType, data, disableGatewayMode = false }) =>
  service.httpRequest(
    {
      url,
      method,
      responseType,
      data,
      headers: getAuthHeaders({ headers, host }),
    },
    disableGatewayMode,
  ).catch(error => {
    logger.error(url);
    logger.error(error);

    if (!(error.response && error.response.status === 401)) {
      throw error;
    }

    return oauthApi.refresh()
      .then(onTokenRefresh)
      .then(() => service.httpRequest(
        {
          url,
          method,
          responseType,
          headers: getAuthHeaders({ headers, host }),
        },
        disableGatewayMode),
      )
  });

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

const getApiHealth = () => httpRequest({
  url: nurl.resolve(config.apis.elite2.url, 'health'),
  method: 'get',
  timeout: 2000,
}).then(() => true, () => false);

const getAuthHeaders = ({ headers, host }) => {
  Object.assign(
    {},
    headers,
    {
      authorization: `bearer ${tokenStore.getAccessToken()}`,
      'access-control-allow-origin': host,
    },
  );
};

function copyPaginationHeadersOver(axiosResponseHeaders, res) {
  const pagination = ['page-offset', 'page-limit', 'sort-fields', 'sort-order', 'total-records'];
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
  errorStatusCode,
  getRequest,
  getApiHealth,
  getKeyworkerRequest,
};

module.exports = service;