const moment = require('moment')
const toEvent = require('./to-event')

const filterMorning = array => array.filter(a => moment(a.startTime).get('hour') < 12)
const filterAfternoon = array =>
  array.filter(a => moment(a.startTime).get('hour') > 11 && moment(a.startTime).get('hour') < 17)
const filterEveningDuties = array => array.filter(a => moment(a.startTime).get('hour') >= 17)

const byStartTimeThenByEndTime = (a, b) => {
  if (moment(a.startTime).isBefore(moment(b.startTime))) {
    return -1
  }
  if (moment(a.startTime).isAfter(moment(b.startTime))) {
    return 1
  }

  if (!a.endTime) return -1
  if (!b.endTime) return 1

  if (moment(a.endTime).isBefore(moment(b.endTime))) {
    return -1
  }
  if (moment(a.endTime).isAfter(moment(b.endTime))) {
    return 1
  }

  return 0
}

module.exports = events => {
  const morningActivity = filterMorning(events)
  const afternoonActivity = filterAfternoon(events)
  const eveningDuties = filterEveningDuties(events)

  return {
    morningActivities: morningActivity && morningActivity.map(data => toEvent(data)).sort(byStartTimeThenByEndTime),
    afternoonActivities:
      afternoonActivity && afternoonActivity.map(data => toEvent(data)).sort(byStartTimeThenByEndTime),
    eveningDuties: eveningDuties && eveningDuties.map(data => toEvent(data)).sort(byStartTimeThenByEndTime),
  }
}
