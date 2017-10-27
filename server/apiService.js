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


const getSentenceData = async (req) => service.callApi({
  method: 'get',
  url: `bookings/${req.params.bookingId}/sentenceDetail`,
  headers: {},
  reqHeaders: req.headers,
  onTokenRefresh: (token) => { req.headers.jwt = token },
}).then(response => new Promise(r => r(response.data)));

const getIepSummary = async (req) => service.callApi({
  method: 'get',
  url: `bookings/${req.params.bookingId}/iepSummary`,
  headers: {},
  reqHeaders: req.headers,
  onTokenRefresh: (token) => { req.headers.jwt = token },
}).then(response => new Promise(r => r(response.data)))
  .catch(_ => new Promise(r => r(null)));  // eslint-disable-line no-unused-vars

const getDetails = async (req) => service.callApi({
  method: 'get',
  url: `bookings/${req.params.bookingId}`,
  headers: {},
  reqHeaders: req.headers,
  onTokenRefresh: (token) => { req.headers.jwt = token },
}).then(response => new Promise(r => r(response.data)));

const getBalances = async (req) => service.callApi({
  method: 'get',
  url: `bookings/${req.params.bookingId}/balances`,
  headers: {},
  reqHeaders: req.headers,
  onTokenRefresh: (token) => { req.headers.jwt = token },
}).then(response => new Promise(r => r(response.data)))
  .catch(_ => new Promise(r => r(null)));  // eslint-disable-line no-unused-vars

const getMainSentence = async (req) => service.callApi({
  method: 'get',
  url: `bookings/${req.params.bookingId}/mainSentence`,
  headers: {},
  reqHeaders: req.headers,
  onTokenRefresh: (token) => { req.headers.jwt = token },
}).then(response => new Promise(r => r(response.data)))
  .catch(_ => new Promise(r => r(null)));  // eslint-disable-line no-unused-vars

const getActivitiesForToday = async (req) => 
  // const iso8601Format = 'YYYY-MM-DD';
  // const startTime = moment().format(iso8601Format);
  // const endTime = moment().format(iso8601Format);

   service.callApi({
     method: 'get',
     url: `bookings/${req.params.bookingId}/activities`,
     headers: {},
     reqHeaders: req.headers,
     onTokenRefresh: (token) => { req.headers.jwt = token },
   }).then(response => new Promise(r => r(response.data)))
    .catch(_ => new Promise(r => r(null)))  // eslint-disable-line no-unused-vars


const callApi = ({ method, url, headers,reqHeaders, onTokenRefresh,responseType, data }) => {
  const { token, refreshToken } = session.getSessionData(reqHeaders);

  return service.httpRequest({
    url,
    method,
    responseType,
    data,
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

const errorStatusCode = (response) => (response && response.status) || 500;

const service = {
  callApi,
  httpRequest,
  httpRequestRetry,
  refreshTokenRequest,
  errorStatusCode,
  getIepSummary,
  getSentenceData,
  getDetails,
  getBalances,
  getMainSentence,
  getActivitiesForToday,
};

module.exports = service;