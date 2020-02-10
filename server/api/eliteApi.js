const contextProperties = require('../contextProperties')

const toQueryParameters = (values, name) => values.map(v => `${name}=${v}`).join('&')

const eliteApiFactory = client => {
  const processResponse = context => response => {
    contextProperties.setResponsePagination(context, response.headers)
    return response.body
  }

  const map404ToNull = error => {
    if (!error.response) throw error
    if (!error.response.status) throw error
    if (error.response.status !== 404) throw error // Not Found
    return null
  }

  const get = (context, url) => client.get(context, url).then(processResponse(context))

  const post = (context, url, data) => client.post(context, url, data).then(processResponse(context))

  const put = (context, url, data) => client.put(context, url, data).then(processResponse(context))

  const getStream = (context, url) => client.getStream(context, url)

  // TODO: Needs fixed timeout of 2 sec... Use a different '2 sec' client?
  const isUp = () =>
    client.get({}, 'ping').then(
      () => true,
      () => false
    )

  const caseNoteUsageList = (context, bookingIds) =>
    get(context, `api/case-notes/summary?type=KA&subType=KS&numMonths=1&${toQueryParameters(bookingIds, 'bookingId')}`)
  const getAddresses = (context, offenderNo) => get(context, `api/offenders/${offenderNo}/addresses`)
  const getAdjudications = (context, bookingId) => get(context, `api/bookings/${bookingId}/adjudications`)
  const getAppointmentTypes = context => get(context, 'api/reference-domains/scheduleReasons?eventType=APP')
  const getAssignedOffenders = context => get(context, 'api/users/me/bookingAssignments')
  const getBalances = (context, bookingId) => get(context, `api/bookings/${bookingId}/balances`)
  const getCategoryAssessment = (context, bookingId) =>
    get(context, `api/bookings/${bookingId}/assessment/CATEGORY`).catch(map404ToNull)
  const getCaseLoads = context => get(context, 'api/users/me/caseLoads')
  const getContacts = (context, bookingId) => get(context, `api/bookings/${bookingId}/contacts`)
  const getDetails = (context, offenderNo) => get(context, `api/bookings/offenderNo/${offenderNo}?fullInfo=true`)
  const getDetailsLight = (context, offenderNo) => get(context, `api/bookings/offenderNo/${offenderNo}?fullInfo=false`)
  const getEventsForToday = (context, bookingId) => get(context, `api/bookings/${bookingId}/events/today`)
  const getEventsForThisWeek = (context, bookingId) => get(context, `api/bookings/${bookingId}/events/thisWeek`)
  const getEventsForNextWeek = (context, bookingId) => get(context, `api/bookings/${bookingId}/events/nextWeek`)
  const getIepSummary = (context, bookingId) => get(context, `api/bookings/${bookingId}/iepSummary`)
  const getLastVisit = (context, bookingId) => get(context, `api/bookings/${bookingId}/visits/last`)
  const getLocationsForAppointments = (context, agencyId) =>
    get(context, `api/agencies/${agencyId}/locations?eventType=APP`)
  const getKeyworker = (context, offenderNo) => get(context, `api/bookings/offenderNo/${offenderNo}/key-worker`)
  const getMainOffence = (context, bookingId) => get(context, `api/bookings/${bookingId}/mainOffence`)
  const getNegativeCaseNotes = ({ context, bookingId, fromDate, toDate }) =>
    get(context, `api/bookings/${bookingId}/caseNotes/NEG/IEP_WARN/count?fromDate=${fromDate}&toDate=${toDate}`).catch(
      map404ToNull
    )
  const getNextVisit = (context, bookingId) => get(context, `api/bookings/${bookingId}/visits/next`)
  const getOffendersSentenceDates = (context, offenderNumbers) =>
    get(context, `api/offender-sentences/?${toQueryParameters(offenderNumbers, 'offenderNo')}`)
  const getPositiveCaseNotes = ({ context, bookingId, fromDate, toDate }) =>
    get(context, `api/bookings/${bookingId}/caseNotes/POS/IEP_ENC/count?fromDate=${fromDate}&toDate=${toDate}`).catch(
      map404ToNull
    )
  const getRelationships = (context, bookingId) => get(context, `api/bookings/${bookingId}/relationships`)
  const getStaffRoles = (context, staffId, agencyId) => get(context, `api/staff/${staffId}/${agencyId}/roles`)
  const getSentenceDetail = (context, bookingId) => get(context, `api/bookings/${bookingId}/sentenceDetail`)
  const getSentenceData = (context, offenderNumbers) => post(context, `api/offender-sentences`, offenderNumbers)

  const getSummaryForOffenders = (context, offenderNumbers) =>
    get(context, `api/bookings?iepLevel=true&${toQueryParameters(offenderNumbers, 'offenderNo')}`)

  // get existing events for an offender
  const getVisits = (context, { agencyId, date, timeSlot, offenderNumbers }) =>
    post(context, `api/schedules/${agencyId}/visits?timeSlot=${timeSlot}&date=${date}`, offenderNumbers)
  const getAppointments = (context, { agencyId, date, timeSlot, offenderNumbers }) =>
    post(context, `api/schedules/${agencyId}/appointments?timeSlot=${timeSlot}&date=${date}`, offenderNumbers)
  const getActivities = (context, { agencyId, date, timeSlot, offenderNumbers }) =>
    post(
      context,
      `api/schedules/${agencyId}/activities?timeSlot=${timeSlot}&date=${date}&includeExcluded=true`,
      offenderNumbers
    )
  const getCourtEvents = (context, { agencyId, date, offenderNumbers }) =>
    post(context, `api/schedules/${agencyId}/courtEvents?date=${date}`, offenderNumbers)
  const getExternalTransfers = (context, { agencyId, date, offenderNumbers }) =>
    post(context, `api/schedules/${agencyId}/externalTransfers?date=${date}`, offenderNumbers)
  const getIdentifiers = (context, bookingId) => get(context, `api/bookings/${bookingId}/identifiers`)

  return {
    caseNoteUsageList,
    get,
    getStream,
    getAddresses,
    getAdjudications,
    getAppointmentTypes,
    getAssignedOffenders,
    getBalances,
    getCategoryAssessment,
    getCaseLoads,
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
    getNegativeCaseNotes,
    getNextVisit,
    getOffendersSentenceDates,
    getPositiveCaseNotes,
    getRelationships,
    getSentenceDetail,
    getSentenceData,
    getStaffRoles,
    getSummaryForOffenders,
    getVisits,
    getAppointments,
    getActivities,
    getCourtEvents,
    getExternalTransfers,
    getIdentifiers,
    isUp,
    post,
    put,
  }
}

module.exports = { eliteApiFactory }
