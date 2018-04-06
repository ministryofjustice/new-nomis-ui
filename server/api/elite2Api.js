const url = require('url');
const getRequest = require('./retry').getRequest;
const config = require('../config');

const baseUrl = config.apis.elite2.url;

const getSentenceData = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/sentenceDetail`) });
const getIepSummary = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/iepSummary`) });
const getDetailsLight = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/offenderNo/${req.params.offenderNo}?fullInfo=false`) });
const getDetails = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/offenderNo/${req.params.offenderNo}?fullInfo=true`) });
const getBalances = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/balances`) });
const getMainOffence = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/mainOffence`) });
const getEventsForToday = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/events/today`) });
const getContacts = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/contacts`) });
const getAdjudications = ({ req, res, fromDate }) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/adjudications?fromDate=${fromDate}`) });
const getEventsForThisWeek = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/events/thisWeek`) });
const getEventsForNextWeek = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/events/nextWeek`) });
const getCategoryAssessment = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl,`api/bookings/${req.bookingId}/assessment/CATEGORY`) });
const getAppointmentTypes = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, 'api/reference-domains/scheduleReasons?eventType=APP') });
const getRelationships = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl,`api/bookings/${req.bookingId}/relationships`) });
const getLocationsForAppointments = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl,`api/agencies/${req.params.agencyId}/locations?eventType=APP`) });
const getMyInformation = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, 'api/users/me') });


const getPositiveCaseNotes = ({ req, res, fromDate, toDate }) => getRequest({
  req,
  res,
  url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/caseNotes/POS/IEP_ENC/count?fromDate=${fromDate}&toDate=${toDate}`),
});

const getNegativeCaseNotes = ({ req, res, fromDate, toDate }) => getRequest({
  req,
  res,
  url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/caseNotes/NEG/IEP_WARN/count?fromDate=${fromDate}&toDate=${toDate}`),
});

const getLastVisit = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/visits/last`) });

const getKeyworker = async (req, res) => {
  const keyworkerApiUrl = config.apis.keyworker.url;

  if (keyworkerApiUrl) {
    const me = await getMyInformation(req,res);

    return getRequest({
      url: url.resolve(keyworkerApiUrl, `key-worker/${me.activeCaseLoadId}/offender/${req.params.offenderNo}`),
      req,
      res,
      disableGatewayMode: true,
    });
  }

  return getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/offenderNo/${req.params.offenderNo}/key-worker`) });
};

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
  getLastVisit,
  getRelationships,
  getKeyworker,
};

module.exports = service;