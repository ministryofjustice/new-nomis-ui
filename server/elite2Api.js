const axios = require('axios');
const session = require('./session');
const useApiAuth = (process.env.USE_API_GATEWAY_AUTH || 'no') === 'yes';
const gatewayToken = require('./jwtToken');
const QueryBuilder = require('./QueryBuilder');

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


const getSentenceData = (req) => getRequest({ req, url: `bookings/${req.params.bookingId}/sentenceDetail` });
const getIepSummary = (req) => getRequest({ req, url: `bookings/${req.params.bookingId}/iepSummary` });
const getDetails = (req) => getRequest({ req,url: `bookings/${req.params.bookingId}` });
const getBalances = (req) => getRequest({ req, url: `bookings/${req.params.bookingId}/balances` });
const getMainSentence = (req) => getRequest({ req,url: `bookings/${req.params.bookingId}/mainSentence` });
const getActivitiesForToday = (req) => getRequest({ req, url: `bookings/${req.params.bookingId}/activities/today` });

const getPositiveCaseNotes = ({ req, fromDate }) => {
  const query = new QueryBuilder('fromDate').greaterThanOrEqual(fromDate).build();

  return getRequest({
    req,
    url: `bookings/${req.params.bookingId}/caseNotes/POS/IEP_ENC/count?query=${query}`,
  });
};

const getNegativeCaseNotes = ({ req, fromDate }) => {
  const query = new QueryBuilder('fromDate').greaterThanOrEqual(fromDate).build();

  return getRequest({
    req,
    url: `bookings/${req.params.bookingId}/caseNotes/NEG/IEP_WARN/count?query=${query}`,
  });
};

const getRequest = ({ req, url }) => service.callApi({
  method: 'get',
  url,
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
  getPositiveCaseNotes,
  getNegativeCaseNotes,
};

module.exports = service;