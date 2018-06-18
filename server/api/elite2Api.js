const url = require('url');
const { getRequest, getKeyworkerRequest } = require('./retry');
const config = require('../config');

const baseUrl = config.apis.elite2.url;

const getSentenceData = (req, res, bookingId) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${bookingId || req.bookingId}/sentenceDetail`) });
const getAssessments = (req, res, bookingId) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${bookingId || req.bookingId}/assessments`) });
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
const getCategoryAssessment = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/assessment/CATEGORY`) });
const getAppointmentTypes = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, 'api/reference-domains/scheduleReasons?eventType=APP') });
const getRelationships = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/relationships`) });
const getLocationsForAppointments = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/agencies/${req.params.agencyId}/locations?eventType=APP`) });
const getMyInformation = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, 'api/users/me') });
const getUserAccessRoles = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, 'api/users/me/roles') });
const getStaffRoles = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/staff/${req.params.staffId}/${req.params.agencyId}/roles`) });

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

const getSummaryForOffenders = (req, res, people) =>
  getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings?iepLevel=true&${people.map(offenderNo => `offenderNo=${offenderNo}`).join('&')}`) });


const getKeyworker = async (req, res) => {
  const keyworkerApiUrl = config.apis.keyworker.url;

  if (keyworkerApiUrl) {
    const me = await getMyInformation(req, res);

    return getKeyworkerRequest({
      url: url.resolve(keyworkerApiUrl, `key-worker/${me.activeCaseLoadId}/offender/${req.params.offenderNo}`),
      req,
      res,
      disableGatewayMode: true,
    });
  }

  return getRequest({
    req,
    res,
    url: url.resolve(baseUrl, `api/bookings/offenderNo/${req.params.offenderNo}/key-worker`),
  });
};

const getAssignedOffenders = (req, res) => getRequest({
  url: url.resolve(baseUrl, 'api/users/me/bookingAssignments'),
  req,
  res,
});

const getOffendersAssessments = (req, res, code, ids) => getRequest({
  url: url.resolve(baseUrl, `api/offender-assessments/${code}?${ids.map(offenderNo => `offenderNo=${offenderNo}`).join('&')}`),
  req,
  res,
});

const getOffendersSentenceDates = (req, res, ids) => getRequest({
  url: url.resolve(baseUrl, `api/offender-sentences/?${ids.map(offenderNo => `offenderNo=${offenderNo}`).join('&')}`),
  req,
  res,
});

const caseNoteUsageList = (req, res, ids) => getRequest({
  url: url.resolve(baseUrl, `api/case-notes/usage?&type=KA&numMonths=6&${ids.map(offenderNo => `offenderNo=${offenderNo}`).join('&')}`),
  req,
  res,
});

const service = {
  getIepSummary,
  getAssessments,
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
  getMyInformation,
  getSummaryForOffenders,
  getAssignedOffenders,
  getUserAccessRoles,
  getStaffRoles,
  getOffendersAssessments,
  getOffendersSentenceDates,
  caseNoteUsageList,
};

module.exports = service;