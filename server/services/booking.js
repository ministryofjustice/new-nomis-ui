const elite2Api = require('../elite2Api');
const moment = require('moment');

const RiskAssessment = require('../model/riskAssessment');
const keyDatesMapper = require('../view-model-mappers/keydates');
const isoDateFormat = require('./../constants').isoDateFormat;

const pluraliseDay = (days) => days > 1 ? 'days' : 'day';
const pluraliseMonth = (months) => months > 1 ? 'months' : 'month';

const groupBy = (property,array) => array.reduce((result,current) => {
  const date = current[property];
  if (!result[date]) { result[date] = []; }

  result[date].push(current);

  return result;
},[]);

const awardMapper = (award) => ({
  sanctionCodeDescription: descriptionWithLimit(award),
  comment: award.comment,
  effectiveDate: award.effectiveDate,
  durationText: durationText(award),
});

const getComment = (entry) => entry.eventSubType === 'PA' ? null : entry.eventSourceDesc;

const toEvent = (entry) => {
  const comment = getComment(entry);
  return {
    type: (entry.eventSubType === 'PA' && entry.eventSourceDesc) || entry.eventSubTypeDesc,
    comment,
    shortComment: comment && comment.length > 40 ? `${comment.substring(0, 40)}...` : comment,
    startTime: entry.startTime,
    endTime: entry.endTime,
  }
};

const descriptionWithLimit = (award) => {
  switch (award.sanctionCode) {
    case 'STOP_PCT': {
      return `${award.sanctionCodeDescription.replace('(%)','').trim()} (${award.limit}%)`;
    }

    case 'STOP_EARN': {
      return `${award.sanctionCodeDescription.replace('(amount)','').trim()} (£${parseFloat(award.limit).toFixed(2)})`;
    }

    default: return award.sanctionCodeDescription;
  }
};

const durationText = (award) => {
  if (award.months && award.days) {
    return `${award.months} ${pluraliseMonth(award.months)} and ${award.days} ${pluraliseDay(award.days)}`
  }

  return (award.months && `${award.months} ${pluraliseMonth(award.months)}`) ||
       (award.days && `${award.days} ${pluraliseDay(award.days)}`);
};

const getKeyDatesVieModel = async (req) => {
  const sentenceData = await elite2Api.getSentenceData(req);
  const iepSummary = (await elite2Api.getIepSummary(req));
  const categoryAssessment = await elite2Api.getCategoryAssessment(req);

  const sentence = keyDatesMapper.sentence(sentenceData);
  const other = keyDatesMapper.otherDates(sentenceData);

  return {
    iepLevel: iepSummary.iepLevel,
    daysSinceReview: iepSummary.daysSinceReview,
    sentence,
    other,
    reCategorisationDate: categoryAssessment && categoryAssessment.nextReviewDate,
  };
};

const getBookingDetailsViewModel = async (req) => {
  const details = (await elite2Api.getDetails(req));
  const iepLevel = (await elite2Api.getIepSummary(req)).iepLevel;

  const csraAssessment = details.assessments
    .map(assessment => RiskAssessment(assessment))
    .filter((assessment) => assessment.isCRSA() && assessment.isActive())[0];

  return {
    ...details,
    iepLevel ,
    csra: csraAssessment && csraAssessment.riskLevel(),
  };
};

const getQuickLookViewModel = async (req) => {
  const threeMonthsInThePast = moment().subtract(3, 'months').format(isoDateFormat);
  const today = moment().format(isoDateFormat);

  const filterMorning = (array) => array.filter(a => moment(a.startTime).get('hour') < 12);
  const filterAfternoon = (array) => array.filter(a => moment(a.startTime).get('hour') > 11);
  const hasAnyActivity = (activities) => activities.morningActivities.length > 0 || activities.afternoonActivities.length > 0;

  const balance = await elite2Api.getBalances(req);
  const offenceData = await elite2Api.getMainOffence(req);
  const sentenceData = await elite2Api.getSentenceData(req);
  const activityData = await elite2Api.getEventsForToday(req);
  const positiveCaseNotes = await elite2Api.getPositiveCaseNotes({ req, fromDate: threeMonthsInThePast,toDate: today });
  const negativeCaseNotes = await elite2Api.getNegativeCaseNotes({ req, fromDate: threeMonthsInThePast,toDate: today });
  const contacts = await elite2Api.getContacts(req);
  const adjudications = await elite2Api.getAdjudications({ req, fromDate: threeMonthsInThePast });

  const morningActivity = filterMorning(activityData);
  const afternoonActivity = filterAfternoon(activityData);

  const activities = {
    morningActivities: morningActivity && morningActivity.map(data => toEvent(data)),
    afternoonActivities: afternoonActivity && afternoonActivity.map(data => toEvent(data)),
  };

  const offenceDetails = offenceData && offenceData.map(offenceDetail => ({
    type: offenceDetail.offenceDescription,
  }));

  return {
    balance: balance && {
      spends: balance.spends,
      cash: balance.cash,
      savings: balance.savings,
      currency: balance.currency,
    },
    activities: hasAnyActivity(activities) ? activities : null,
    positiveCaseNotes: (positiveCaseNotes && positiveCaseNotes.count) || 0,
    negativeCaseNotes: (negativeCaseNotes && negativeCaseNotes.count) || 0,
    offences: (offenceDetails && offenceDetails.length > 0) ? offenceDetails : null,
    releaseDate: sentenceData ? sentenceData.releaseDate : null,
    tariffDate: sentenceData ? sentenceData.tariffDate : null,
    indeterminateReleaseDate: Boolean(sentenceData && sentenceData.tariffDate && !sentenceData.releaseDate),
    adjudications: {
      proven: (adjudications && adjudications.adjudicationCount) || 0,
      awards: (adjudications && adjudications.awards && adjudications.awards.map(award => awardMapper(award))) || [],
    },
    nextOfKin: (contacts && contacts.nextOfKin && contacts.nextOfKin.map(contact => ({
      firstName: contact.firstName,
      lastName: contact.lastName,
      middleName: contact.middleName,
      relationship: contact.relationshipDescription,
      contactTypeDescription: contact.contactTypeDescription,
    }))) || [],
  };
};

const getScheduledEventsForThisWeek = async (req) => {
  const data = await elite2Api.getEventsForThisWeek(req) || [];
  return buildScheduledEvents(data, buildCalendarViewFor([0,1,2,3,4,5,6]));
};

const getScheduledEventsForNextWeek = async (req) => {
  const data = await elite2Api.getEventsForNextWeek(req) || [];
  return buildScheduledEvents(data, buildCalendarViewFor([7,8,9,10,11,12,13]));
};

const buildScheduledEvents = (data, calendarView) => {
  const groupedByDate = groupBy('eventDate', data);
  const filterMorning = (array) => array.filter(a => moment(a.startTime).get('hour') < 12);
  const filterAfternoon = (array) => array.filter(a => moment(a.startTime).get('hour') > 11);

  return calendarView.map(view => {
    const events = Object.keys(groupedByDate)
      .filter(key => moment(key).format(isoDateFormat) === view.date.format(isoDateFormat))
      .map(date => groupedByDate[date])
      .reduce((result,current) => result.concat(current),[])
      .sort((a,b) => {
        if (moment(a.startTime).isBefore(moment(b.startTime))) { return -1; }
        if (moment(a.startTime).isAfter(moment(b.startTime))) { return 1; }

        if (moment(a.endTime).isBefore(moment(b.endTime))) { return -1; }
        if (moment(a.endTime).isAfter(moment(b.endTime))) { return 1; }

        return 0;
      })
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

const service = {
  getQuickLookViewModel,
  getKeyDatesVieModel,
  getBookingDetailsViewModel,
  getScheduledEventsForThisWeek,
  getScheduledEventsForNextWeek,
};

module.exports = service;