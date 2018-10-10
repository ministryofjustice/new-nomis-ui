const contextProperties = require('../contextProperties');

const toQueryParameters = (offenderNumbers) => offenderNumbers.map(offenderNo => `offenderNo=${offenderNo}`).join('&');

const eliteApiFactory = (client) => {
  const processResponse = (context) => (response) => {
    contextProperties.setResponsePagination(context, response.headers);
    return response.data;
  };

  const map404ToNull = error => {
    if (!error.response) throw error;
    if (!error.response.status) throw error;
    if (error.response.status !== 404) throw error; // Not Found
    return null;
  };

  const get = (context, url) =>
    client
      .get(context, url)
      .then(processResponse(context));

  const post = (context, url, data) =>
    client
      .post(context, url, data)
      .then(processResponse(context));

  const put = (context, url, data) =>
    client
      .put(context, url, data)
      .then(processResponse(context));

  const getStream = (context, url) => client.getStream(context, url).then(response => response.data);

  // TODO: Needs fixed timeout of 2 sec... Use a different '2 sec' client?
  const isUp = () => client
    .get({}, 'health')
    .then(
      () => true,
      () => false);

  const caseNoteUsageList = (context, offenderNumbers) => get(context, `api/case-notes/usage?type=KA&subType=KS&numMonths=6&${toQueryParameters(offenderNumbers)}`);
  const getAdjudications = (context, bookingId) => get(context, `api/bookings/${bookingId}/adjudications`);
  const getAppointmentTypes = (context) => get(context, 'api/reference-domains/scheduleReasons?eventType=APP');
  const getAssignedOffenders = (context) => get(context, 'api/users/me/bookingAssignments');
  const getAssessments = (context, bookingId) => get(context, `api/bookings/${bookingId}/assessments`);
  const getBalances = (context, bookingId) => get(context, `api/bookings/${bookingId}/balances`);
  const getCategoryAssessment = (context, bookingId) => get(context, `api/bookings/${bookingId}/assessment/CATEGORY`).catch(map404ToNull);
  const getContacts = (context, bookingId) => get(context, `api/bookings/${bookingId}/contacts`);
  const getDetails = (context, offenderNo) => get(context, `api/bookings/offenderNo/${offenderNo}?fullInfo=true`);
  const getDetailsLight = (context, offenderNo) => get(context, `api/bookings/offenderNo/${offenderNo}?fullInfo=false`);
  const getEventsForToday = (context, bookingId) => get(context, `api/bookings/${bookingId}/events/today`);
  const getEventsForThisWeek = (context, bookingId) => get(context, `api/bookings/${bookingId}/events/thisWeek`);
  const getEventsForNextWeek = (context, bookingId) => get(context, `api/bookings/${bookingId}/events/nextWeek`);
  const getIepSummary = (context, bookingId) => get(context, `api/bookings/${bookingId}/iepSummary`);
  const getLastVisit = (context, bookingId) => get(context, `api/bookings/${bookingId}/visits/last`);
  const getLocationsForAppointments = (context, agencyId) => get(context, `api/agencies/${agencyId}/locations?eventType=APP`);
  const getKeyworker = (context, offenderNo) => get(context, `api/bookings/offenderNo/${offenderNo}/key-worker`);
  const getMainOffence = (context, bookingId) => get(context, `api/bookings/${bookingId}/mainOffence`);
  const getMyInformation = (context) => get(context, 'api/users/me');
  const getNegativeCaseNotes = ({ context, bookingId, fromDate, toDate }) => get(context, `api/bookings/${bookingId}/caseNotes/NEG/IEP_WARN/count?fromDate=${fromDate}&toDate=${toDate}`);
  const getNextVisit = (context, bookingId) => get(context, `api/bookings/${bookingId}/visits/next`);
  const getOffendersSentenceDates = (context, offenderNumbers) => get(context, `api/offender-sentences/?${toQueryParameters(offenderNumbers)}`);
  const getPositiveCaseNotes = ({ context, bookingId, fromDate, toDate }) => get(context, `api/bookings/${bookingId}/caseNotes/POS/IEP_ENC/count?fromDate=${fromDate}&toDate=${toDate}`);
  const getRelationships = (context, bookingId) => get(context, `api/bookings/${bookingId}/relationships`);
  const getStaffRoles = (context, staffId, agencyId) => get(context, `api/staff/${staffId}/${agencyId}/roles`);
  const getSentenceData = (context, bookingId) => get(context, `api/bookings/${bookingId}/sentenceDetail`);
  const getSummaryForOffenders = (context, offenderNumbers) => get(context, `api/bookings?iepLevel=true&${toQueryParameters(offenderNumbers)}`);
  const getUserAccessRoles = (context) => get(context, 'api/users/me/roles');
  const getWhereaboutsConfig = (context, agencyId) => get(context, `api/agencies/${agencyId}/locations/whereabouts`);

  return {
    caseNoteUsageList,
    get,
    getStream,
    getAdjudications,
    getAppointmentTypes,
    getAssignedOffenders,
    getAssessments,
    getBalances,
    getCategoryAssessment,
    getContacts,
    getDetails,
    getDetailsLight,
    getEventsForToday,
    getEventsForThisWeek,
    getEventsForNextWeek,
    getIepSummary,
    getKeyworker,
    getLastVisit,
    getLocationsForAppointments,
    getMainOffence,
    getMyInformation,
    getNegativeCaseNotes,
    getNextVisit,
    getOffendersSentenceDates,
    getPositiveCaseNotes,
    getRelationships,
    getSentenceData,
    getStaffRoles,
    getSummaryForOffenders,
    getUserAccessRoles,
    getWhereaboutsConfig,
    isUp,
    post,
    put,
  }
};

module.exports = { eliteApiFactory };