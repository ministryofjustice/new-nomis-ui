const axios = require('axios');
const session = require('./session');
const useApiAuth = (process.env.USE_API_GATEWAY_AUTH || 'no') === 'yes';
const gatewayToken = require('./jwtToken');

axios.defaults.baseURL = process.env.API_ENDPOINT_URL || 'http://localhost:7080/api';

axios.interceptors.request.use((config) => {
  if (useApiAuth) {
    const backendToken = config.headers.authorization;
    if (backendToken) {
      config.headers['elite-authorization'] = backendToken; // eslint-disable-line no-param-reassign
    }
    config.headers.authorization = `Bearer ${gatewayToken()}`; // eslint-disable-line no-param-reassign
  }
  return config;
}, (error) => Promise.reject(error));

const callApi = ({ method, url, headers,reqHeaders, onTokenRefresh,responseType }) => {
  const { token, refreshToken } = session.getSessionData(reqHeaders);

  return service.httpRequest({
    url,
    method,
    responseType,
    headers: getHeaders({ headers,reqHeaders,token }),
  }).catch(error => {
    if (error.response.status === 401) {
      return service.refreshTokenRequest({ token: refreshToken,headers,reqHeaders }).then(response => {
        onTokenRefresh(session.newJWT(response.data));
        return service.httpRequestRetry({
          url,
          method,
          responseType,
          headers: getHeaders({ headers, reqHeaders, token: response.data.token }),
        });
      })
    }
    throw error;
  });
};

function httpRequest(options) {
  return axios(options);
}

function httpRequestRetry(options) {
  return axios(options);
}

const refreshTokenRequest = ({ headers, reqHeaders, token }) => axios({
  method: 'post',
  url: '/users/token',
  headers: getHeaders({ headers,reqHeaders,token }),
});

const getHeaders = ({ headers,reqHeaders, token }) => Object.assign({}, headers, {
  authorization: token,
  'access-control-allow-origin': reqHeaders.host,
});

const service = {
  callApi,
  httpRequest,
  httpRequestRetry,
  refreshTokenRequest,
};

module.exports = service;