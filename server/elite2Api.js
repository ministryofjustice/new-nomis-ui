const axios = require('axios');
const session = require('./session');
const useApiAuth = (process.env.USE_API_GATEWAY_AUTH || 'no') === 'yes';
const gatewayToken = require('./jwt-token');

axios.defaults.baseURL = process.env.API_ENDPOINT_URL || 'http://localhost:8080/api';

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
const getMainOffence = (req) => getRequest({ req,url: `bookings/${req.params.bookingId}/mainOffence` });
const getEventsForToday = (req) => getRequest({ req, url: `bookings/${req.params.bookingId}/events/today` });
const getContacts = (req) => getRequest({ req, url: `bookings/${req.params.bookingId}/contacts` });
const getAdjudications = ({ req , fromDate }) => getRequest({ req, url: `bookings/${req.params.bookingId}/adjudications?fromDate=${fromDate}` });
const getEventsForThisWeek = (req) => getRequest({ req, url: `bookings/${req.params.bookingId}/events/thisWeek` });
const getEventsForNextWeek = (req) => getRequest({ req, url: `bookings/${req.params.bookingId}/events/nextWeek` });
const getCategoryAssessment = (req) => getRequest({ req, url: `bookings/${req.params.bookingId}/assessment/CATEGORY` });
const getAppointmentTypes = (req) => getRequest({ req, url: 'reference-domains/scheduleReasons?eventType=APP' });
const getRelationships = (req) => getRequest({req, url:  `bookings/${req.params.bookingId}/relationships`});

const getLocationsForAppointments = (req) => {
  const url = `agencies/${req.params.agencyId}/locations?eventType=APP`;
  return getRequest({ req, url });
};

const getPositiveCaseNotes = ({ req, fromDate, toDate }) => getRequest({
  req,
  url: `bookings/${req.params.bookingId}/caseNotes/POS/IEP_ENC/count?fromDate=${fromDate}&toDate=${toDate}`,
});

const getNegativeCaseNotes = ({ req, fromDate, toDate }) => getRequest({
  req,
  url: `bookings/${req.params.bookingId}/caseNotes/NEG/IEP_WARN/count?fromDate=${fromDate}&toDate=${toDate}`,
});

const getLastVisit = (req) => getRequest({ req, url: `/bookings/${req.params.bookingId}/visits/last` });

const addAppointment = ({ req }) => service.callApi({
  method: 'post',
  url: `bookings/${req.params.bookingId}/appointments`,
  reqHeaders: req.headers,
  data: req.body,
  onTokenRefresh: (token) => { req.headers.jwt = token },
});

const getRequest = ({ req, url }) => service.callApi({
  method: 'get',
  url,
  headers: {},
  reqHeaders: req.headers,
  onTokenRefresh: (token) => { req.headers.jwt = token },
}).then(response => new Promise(r => r(response.data)))
    .catch(_ => new Promise(r => r(null)));  // eslint-disable-line no-unused-vars

const callApi = ({ method, url, headers, reqHeaders, onTokenRefresh, responseType, data }) => {
  const { token, refreshToken } = session.getSessionData(reqHeaders);

  return service.httpRequest({
    url,
    method,
    responseType,
    data,
    headers: getHeaders({ headers, reqHeaders, token }),
  }).catch(error => {
    if (error.response.status === 401) {
      return service.refreshTokenRequest({ token: refreshToken, headers, reqHeaders }).then(response => {
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
  headers: getHeaders({ headers, reqHeaders, token }),
});

const getHeaders = ({ headers, reqHeaders, token }) => Object.assign({}, headers, {
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
  getMainOffence,
  getEventsForToday,
  getPositiveCaseNotes,
  getNegativeCaseNotes,
  getContacts,
  getAdjudications,
  getEventsForThisWeek,
  getEventsForNextWeek,
  getCategoryAssessment,
  getLocationsForAppointments,
  getAppointmentTypes,
  addAppointment,
  getLastVisit,
  getRelationships,
};

module.exports = service;