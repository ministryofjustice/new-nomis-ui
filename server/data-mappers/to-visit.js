const moment = require('../ZoneAwareMoment');
const isoDateTimeFormat = require('../constants').isoDateTimeFormat;

const visitStatusCodes = {
  cancelled: 'CANC',
  cancelledOutcome: 'CAN',
  attended: 'ATT',
  scheduled: 'SCH',
};

const toVisit = (visit) => {
  const nameParts = visit.leadVisitor && visit.leadVisitor.split(' ');
  const toName = (value) => value && value.split('').map((letter,index) => index === 0 ? letter.toUpperCase() : letter.toLowerCase()).join('');

  const leadVisitorName = nameParts && `${toName(nameParts[0])} ${toName(nameParts[1])}`;
  const leadVisitorRelationship = visit.relationshipDescription ? ` (${visit.relationshipDescription})` : '';

  return {
    leadVisitor: (leadVisitorName) && `${leadVisitorName}${leadVisitorRelationship}`,
    date: visit.startTime,
    type: visit.visitTypeDescription,
  };
};

const toLastVisit = (visit) => {
  const now = moment().format(isoDateTimeFormat);

  const isCancelledVisit = visit.eventStatus === visitStatusCodes.cancelled ||
    visit.eventOutcome === visitStatusCodes.cancelledOutcome;

  let status = visit.eventStatus === visitStatusCodes.cancelled
    ? visit.eventStatusDescription : visit.eventOutcomeDescription;

  if (visit.eventStatus !== visitStatusCodes.cancelled &&
    visit.eventOutcome !== visitStatusCodes.attended &&
    visit.eventOutcome !== visitStatusCodes.scheduled &&
    visit.eventOutcome !== visitStatusCodes.cancelledOutcome) {
    return null;
  }

  if (visit.eventStatus === visitStatusCodes.scheduled
    && moment(visit.startTime,isoDateTimeFormat).isBefore(now) && moment(visit.endTime,isoDateTimeFormat).isAfter(now)) {
    status = 'Ongoing';
  }

  return {
    ...toVisit(visit),
    status,
    cancellationReason: isCancelledVisit && visit.cancelReasonDescription,
  }
};


module.exports = {
  toLastVisit,
  toVisit,
}