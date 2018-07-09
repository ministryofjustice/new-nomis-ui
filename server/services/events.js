const moment = require('moment');
const utils = require('../utils');
const isoDateFormat = require('./../constants').isoDateFormat;
const toActivityViewModel = require('../data-mappers/to-activity-viewmodel');
const nomisCodes = require('../data-mappers/nomis-codes');

const eventsServiceFactory = (eliteApi) => {
  const getAppointmentViewModel = async (context, agencyId) => {
    const [locationsData, appointmentTypes] = await Promise.all([
      eliteApi.getLocationsForAppointments(context, agencyId),
      eliteApi.getAppointmentTypes(context),
    ]);

    const locations = locationsData.map((type) => ({
      locationId: type.locationId,
      description: type.userDescription || type.description,
    })).sort((a, b) => {
      if (a.description < b.description) return -1;
      if (a.description > b.description) return 1;
      return 0;
    });

    return {
      locations,
      appointmentTypes,
    }
  };

  const getScheduledEventsForThisWeek = async (context, offenderNo) => {
    const { bookingId } = await eliteApi.getDetailsLight(context, offenderNo);

    const data = await eliteApi.getEventsForThisWeek(context, bookingId) || [];
    return buildScheduledEvents(data, buildCalendarViewFor([0, 1, 2, 3, 4, 5, 6]));
  };

  const getScheduledEventsForNextWeek = async (context, offenderNo) => {
    const { bookingId } = await eliteApi.getDetailsLight(context, offenderNo);

    const data = await eliteApi.getEventsForNextWeek(context, bookingId) || [];
    return buildScheduledEvents(data, buildCalendarViewFor([7, 8, 9, 10, 11, 12, 13]));
  };

  const buildScheduledEvents = (data, calendarView) => {
    const groupedByDate = utils.groupBy('eventDate', data);

    return calendarView.map(view => {
      const events = Object.keys(groupedByDate)
        .filter(key => moment(key).format(isoDateFormat) === view.date.format(isoDateFormat))
        .map(date => groupedByDate[date])
        .reduce((result, current) => result.concat(current), [])
        .sort(byStartTimeThenByEndTime)
        .filter(event => event.eventType === nomisCodes.eventTypes.visit || event.eventStatus === nomisCodes.statusCodes.scheduled);

      const activities = toActivityViewModel(events);

      return {
        date: view.date,
        ...activities,
      }
    });
  };

  const buildCalendarViewFor = (days) => days.map(day => moment().add(day, 'days'))
    .reduce((result, current) => {
      result.push({
        date: current,
      });

      return result;
    }, []);

  const byStartTimeThenByEndTime = (a, b) => {
    if (moment(a.startTime).isBefore(moment(b.startTime))) {
      return -1;
    }
    if (moment(a.startTime).isAfter(moment(b.startTime))) {
      return 1;
    }

    if (!a.endTime) return -1;
    if (!b.endTime) return 1;

    if (moment(a.endTime).isBefore(moment(b.endTime))) {
      return -1;
    }
    if (moment(a.endTime).isAfter(moment(b.endTime))) {
      return 1;
    }

    return 0;
  };

  return {
    getScheduledEventsForThisWeek,
    getScheduledEventsForNextWeek,
    getAppointmentViewModel,
  };
};
module.exports = {
  eventsServiceFactory,
};
