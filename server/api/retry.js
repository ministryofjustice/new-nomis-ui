/* eslint-disable camelcase */
const axios = require('axios');
const nurl = require('url');
// const gatewayToken = require('../jwt-token');
const config = require('../config');
const utils = require('../utils');

const getRequest = ({ locals, url }) => service.callApi({
  context: locals,
  method: 'get',
  url,
}).then(response => {
  copyPaginationHeadersOver(response.headers, null);
  return response.data;
});

async function getKeyworkerRequest({ url, headers }) {
  try {
    const request = await service.callApi({
      method: 'get',
      url,
      headers,
    });

    return request.data
  } catch (error) {
    return {}
  }
}

const callApi = ({ method, url, responseType, data }) =>
  service.httpRequest(
    {
      url,
      method,
      responseType,
      data,
    }
  );

function httpRequest(options) {
  return axios(options);
}

const getApiHealth = () => httpRequest({
  url: nurl.resolve(config.apis.elite2.url, 'health'),
  method: 'get',
  timeout: 2000,
}).then(() => true, () => false);

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