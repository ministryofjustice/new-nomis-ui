const moment = require('moment');
const elite2Api = require('../elite2Api');
const utils = require('../utils');
const isoDateFormat = require('./../constants').isoDateFormat;
const toEvent = require('../data-mappers/to-event');

const getAppointmentViewModel = async (req, res) => {
  const locationsData = await elite2Api.getLocationsForAppointments(req, res);
  const appointmentTypes = await elite2Api.getAppointmentTypes(req, res);

  const locations = locationsData.map((type) => ({
    locationId: type.locationId,
    description: type.userDescription || type.description,
  })).sort((a,b) => {
    if (a.description < b.description) return -1;
    if (a.description > b.description) return 1;
    return 0;
  });

  return {
    locations,
    appointmentTypes,
  }
};

const getScheduledEventsForThisWeek = async (req, res) => {
  const data = await elite2Api.getEventsForThisWeek(req, res) || [];
  return buildScheduledEvents(data, buildCalendarViewFor([0,1,2,3,4,5,6]));
};

const getScheduledEventsForNextWeek = async (req, res) => {
  const data = await elite2Api.getEventsForNextWeek(req, res) || [];
  return buildScheduledEvents(data, buildCalendarViewFor([7,8,9,10,11,12,13]));
};

const buildScheduledEvents = (data, calendarView) => {
  const groupedByDate = utils.groupBy('eventDate', data);
  const filterMorning = (array) => array.filter(a => moment(a.startTime).get('hour') < 12);
  const filterAfternoon = (array) => array.filter(a => moment(a.startTime).get('hour') > 11);

  return calendarView.map(view => {
    const events = Object.keys(groupedByDate)
      .filter(key => moment(key).format(isoDateFormat) === view.date.format(isoDateFormat))
      .map(date => groupedByDate[date])
      .reduce((result,current) => result.concat(current),[])
      .sort(byStartTimeThenByEndTime)
      .filter(event => event.eventStatus === 'SCH');

    return {
      date: view.date,
      forMorning: filterMorning(events).map(entry => toEvent(entry)) || [],
      forAfternoon: filterAfternoon(events).map(entry => toEvent(entry)) || [],
    }
  });
};

const buildCalendarViewFor = (days) => days.map(day => moment().add(day,'days'))
  .reduce((result, current) => {
    result.push({
      date: current,
    });

    return result;
  },[]);

const byStartTimeThenByEndTime = (a,b) => {
  if (moment(a.startTime).isBefore(moment(b.startTime))) { return -1; }
  if (moment(a.startTime).isAfter(moment(b.startTime))) { return 1; }

  if (!a.endTime) return -1;
  if (!b.endTime) return 1;

  if (moment(a.endTime).isBefore(moment(b.endTime))) { return -1; }
  if (moment(a.endTime).isAfter(moment(b.endTime))) { return 1; }

  return 0;
};

const service = {
  getScheduledEventsForThisWeek,
  getScheduledEventsForNextWeek,
  getAppointmentViewModel,
};

module.exports = service;
