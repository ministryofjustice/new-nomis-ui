const { sortByTime, getHoursMinutes } = require('../utils')

const visits = data =>
  (data &&
    data.length &&
    data.filter(event => event.eventStatus === 'SCH').map(event => ({
      eventId: event.eventId,
      startTime: getHoursMinutes(event.startTime),
      endTime: getHoursMinutes(event.endTime),
      eventDescription: event.comment
        ? `${event.eventLocation} - ${event.eventDescription} - ${event.comment}`
        : `${event.eventLocation} - ${event.eventDescription}`,
      eventStatus: event.eventStatus,
    }))) ||
  []

const appointments = data =>
  (data &&
    data.length &&
    data.map(event => ({
      eventId: event.eventId,
      startTime: getHoursMinutes(event.startTime),
      endTime: getHoursMinutes(event.endTime),
      eventDescription: event.comment
        ? `${event.eventLocation} - ${event.eventDescription} - ${event.comment}`
        : `${event.eventLocation} - ${event.eventDescription}`,
      eventStatus: event.eventStatus,
    }))) ||
  []

const activities = data =>
  (data &&
    data.length &&
    data.map(event => ({
      eventId: event.eventId,
      startTime: getHoursMinutes(event.startTime),
      endTime: getHoursMinutes(event.endTime),
      eventDescription: `${event.eventLocation} - Activity - ${event.comment}`,
      eventStatus: event.eventStatus,
      excluded: event.excluded,
    }))) ||
  []

const releaseScheduled = (releaseScheduledData, formattedDate) =>
  releaseScheduledData &&
  releaseScheduledData.length &&
  releaseScheduledData.filter(release => release.sentenceDetail.releaseDate === formattedDate)[0]
    ? [{ eventDescription: 'Release scheduled' }]
    : []

const toCourtEvent = event => ({
  eventId: event.eventId,
  eventDescription: 'Court visit scheduled',
  eventStatus: event.eventStatus,
})

const getOffenderCourtEvents = courtEvents => {
  const events = courtEvents || []

  return events.filter(event => event.eventStatus === 'SCH').map(event => toCourtEvent(event))
}

const scheduledTransfers = transfers =>
  (transfers &&
    transfers.length &&
    transfers.filter(event => event.eventStatus === 'SCH').map(event => ({
      eventId: event.eventId,
      eventDescription: 'Transfer scheduled',
      eventStatus: event.eventStatus,
    }))) ||
  []

const aggregate = (
  formattedDate,
  visitsData,
  appointmentsData,
  activitiesData,
  releaseScheduleData,
  courtEventData,
  transferData
) => [
  ...visits(visitsData),
  ...appointments(appointmentsData),
  ...activities(activitiesData),
  ...releaseScheduled(releaseScheduleData, formattedDate),
  ...getOffenderCourtEvents(courtEventData),
  ...scheduledTransfers(transferData),
]

module.exports = async (elite2Api, context, { offenderNumbers, formattedDate, agencyId }) => {
  if (!offenderNumbers || offenderNumbers.length === 0) return []

  const searchCriteria = { agencyId, date: formattedDate, timeSlot: '', offenderNumbers }
  const [
    visitsData,
    appointmentsData,
    activitiesData,
    releaseScheduleData,
    courtEventData,
    transferData,
  ] = await Promise.all([
    elite2Api.getVisits(context, searchCriteria),
    elite2Api.getAppointments(context, searchCriteria),
    elite2Api.getActivities(context, searchCriteria),
    elite2Api.getSentenceData(context, offenderNumbers),
    elite2Api.getCourtEvents(context, searchCriteria),
    elite2Api.getExternalTransfers(context, searchCriteria),
  ])

  return aggregate(
    formattedDate,
    visitsData,
    appointmentsData,
    activitiesData,
    releaseScheduleData,
    courtEventData,
    transferData
  ).sort((left, right) => sortByTime(left.startTime, right.startTime))
}
