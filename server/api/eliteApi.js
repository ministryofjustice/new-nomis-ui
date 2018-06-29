const eliteApiFactory = (client) => {
  const get = (context, url) =>
    client
      .get(context, url)
      .then(response => response.data);

  // TODO: Needs fixed timeout of 2 sec... ???
  const isUp = () => client
      .get({}, 'health')
      .then(
        () => true,
        () => false);

  // const getSentenceData = (req, res, bookingId) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${bookingId || req.bookingId}/sentenceDetail`) });
  // const getAssessments = (req, res, bookingId) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${bookingId || req.bookingId}/assessments`) });
  // const getIepSummary = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/iepSummary`) });

  const getDetailsLight = (context, offenderNo) => get(context, `api/bookings/offenderNo/${offenderNo}?fullInfo=false`);

  // const getDetails = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/offenderNo/${req.params.offenderNo}?fullInfo=true`) });
  // const getBalances = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/balances`) });
  // const getMainOffence = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/mainOffence`) });
  // const getEventsForToday = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/events/today`) });
  // const getContacts = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/contacts`) });
  // const getAdjudications = ({ req, res, fromDate }) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/adjudications?fromDate=${fromDate}`) });
  // const getEventsForThisWeek = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/events/thisWeek`) });
  // const getEventsForNextWeek = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/events/nextWeek`) });
  // const getCategoryAssessment = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/assessment/CATEGORY`) });
  // const getAppointmentTypes = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, 'api/reference-domains/scheduleReasons?eventType=APP') });
  // const getRelationships = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/bookings/${req.bookingId}/relationships`) });
  // const getLocationsForAppointments = (req, res) => getRequest({ req, res, url: url.resolve(baseUrl, `api/agencies/${req.params.agencyId}/locations?eventType=APP`) });
  const getMyInformation = (context) => get(context, 'api/users/me');
  const getUserAccessRoles = (context) => get(context, 'api/users/me/roles');
  const getStaffRoles = (context, staffId, agencyId) => get(context, `api/staff/${staffId}/${agencyId}/roles`);

  return {
    isUp,
    getDetailsLight,
    getMyInformation,
    getUserAccessRoles,
    getStaffRoles,
  }
};

module.exports = { eliteApiFactory };