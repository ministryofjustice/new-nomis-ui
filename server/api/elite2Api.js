const url = require('url');
const session = require('../session');
const getRequest = require('./retry').getRequest;

const baseUrl = process.env.API_ENDPOINT_URL || 'http://localhost:3000';

const getSentenceData = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/sentenceDetail`) });
const getIepSummary = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/iepSummary`) });
const getDetailsLight = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl,`api/bookings/offenderNo/${req.params.offenderNo}?fullInfo=false`) });
const getDetails = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/offenderNo/${req.params.offenderNo}?fullInfo=true`) });
const getBalances = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/balances`) });
const getMainOffence = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/mainOffence`) });
const getEventsForToday = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl,`api/bookings/${req.bookingId}/events/today`) });
const getContacts = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl,`api/bookings/${req.bookingId}/contacts`) });
const getAdjudications = ({ req, res, fromDate }) => getRequest({ req, res, url: url.resolve(baseUrl,`api/bookings/${req.bookingId}/adjudications?fromDate=${fromDate}`) });
const getEventsForThisWeek = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl,`api/bookings/${req.bookingId}/events/thisWeek`) });
const getEventsForNextWeek = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/events/nextWeek`) });
const getCategoryAssessment = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl,`api/bookings/${req.bookingId}/assessment/CATEGORY`) });
const getAppointmentTypes = (req, res) => getRequest({ req, res, url: url.resolve('api/reference-domains/scheduleReasons?eventType=APP') });
const getRelationships = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl,`api/bookings/${req.bookingId}/relationships`) });
const getLocationsForAppointments = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl,`api/agencies/${req.params.agencyId}/locations?eventType=APP`) });
const getMyInformation = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, 'api/users/me') });


const getPositiveCaseNotes = ({ req, res, fromDate, toDate }) => getRequest({
  req,
  res,
  url: url.resolve(baseUrl,`api/bookings/${req.bookingId}/caseNotes/POS/IEP_ENC/count?fromDate=${fromDate}&toDate=${toDate}`),
});

const getNegativeCaseNotes = ({ req, res, fromDate, toDate }) => getRequest({
  req,
  res,
  url: url.resolve(baseUrl,`api/bookings/${req.bookingId}/caseNotes/NEG/IEP_WARN/count?fromDate=${fromDate}&toDate=${toDate}`),
});

const getLastVisit = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl`api/bookings/${req.bookingId}/visits/last`) });

const getKeyworker = async (req, res) => {
  const keyworkerBaseUrl = process.env.KEYWORKER_API_URL;

  if (keyworkerBaseUrl) {
    const me = await getMyInformation(req,res);

    return getRequest({ req, res, url: url.resolve(keyworkerBaseUrl, `key-worker/${me.activeCaseLoadId}/offender/${req.params.offenderNo}`) });
  }

  return getRequest({ req, res, url: url.resolve(baseUrl,`api/bookings/offenderNo/${req.params.offenderNo}/key-worker`) });
};

const addAppointment = ({ req, res }) => service.callApi({
  method: 'post',
  url: url.resolve(baseUrl,`api/bookings/${req.bookingId}/appointments`),
  reqHeaders: { jwt: { access_token: req.access_token, refresh_token: req.refresh_token }, host: req.headers.host },
  data: req.body,
  onTokenRefresh: session.updateHmppsCookie(res),
});

const service = {
  getIepSummary,
  getSentenceData,
  getDetailsLight,
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
  getKeyworker,
};

module.exports = service;