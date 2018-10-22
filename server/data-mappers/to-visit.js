const momentTimeZone = require('moment-timezone')

const { isoDateTimeFormat } = require('../constants')
const nomisCodes = require('./nomis-codes')

const visitStatusCodes = nomisCodes.statusCodes

const toVisit = visit => {
  const nameParts = visit.leadVisitor && visit.leadVisitor.split(' ')
  const toName = value =>
    value &&
    value
      .split('')
      .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter.toLowerCase()))
      .join('')

  const leadVisitorName = nameParts && `${toName(nameParts[0])} ${toName(nameParts[1])}`
  const leadVisitorRelationship = visit.relationshipDescription ? ` (${visit.relationshipDescription})` : ''

  return {
    leadVisitor: leadVisitorName && `${leadVisitorName}${leadVisitorRelationship}`,
    date: visit.startTime,
    type: visit.visitTypeDescription,
  }
}

const calculateStatus = visit => {
  const zone = 'Europe/London'
  const now = momentTimeZone.tz(zone)
  const startTime = momentTimeZone.tz(visit.startTime, isoDateTimeFormat, zone)
  const endTime = momentTimeZone.tz(visit.endTime, isoDateTimeFormat, zone)

  if (visit.eventStatus === visitStatusCodes.scheduled && now.isAfter(startTime) && now.isBefore(endTime)) {
    return 'Ongoing'
  }
  return visit.eventStatus === visitStatusCodes.cancelled ? visit.eventStatusDescription : visit.eventOutcomeDescription
}

const toLastVisit = visit => {
  if (
    visit.eventStatus !== visitStatusCodes.cancelled &&
    visit.eventOutcome !== visitStatusCodes.attended &&
    visit.eventOutcome !== visitStatusCodes.scheduled &&
    visit.eventOutcome !== visitStatusCodes.cancelledOutcome
  ) {
    return null
  }

  const status = calculateStatus(visit)

  const isCancelledVisit =
    visit.eventStatus === visitStatusCodes.cancelled || visit.eventOutcome === visitStatusCodes.cancelledOutcome

  return {
    ...toVisit(visit),
    status,
    cancellationReason: isCancelledVisit && visit.cancelReasonDescription,
  }
}

module.exports = {
  toLastVisit,
  toVisit,
}
