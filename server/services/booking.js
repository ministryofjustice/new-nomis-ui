const elite2Api = require('../elite2Api');
const moment = require('moment');

const RiskAssessment = require('../model/risk-assessment');
const keyDatesMapper = require('../data-mappers/keydates');
const isoDateFormat = require('./../constants').isoDateFormat;
const toAward = require('../data-mappers/to-award');
const toEvent = require('../data-mappers/to-event');

const byStartTimeThenByEndTime = (a,b) => {
  if (moment(a.startTime).isBefore(moment(b.startTime))) { return -1; }
  if (moment(a.startTime).isAfter(moment(b.startTime))) { return 1; }

  if (!a.endTime) return -1;
  if (!b.endTime) return 1;

  if (moment(a.endTime).isBefore(moment(b.endTime))) { return -1; }
  if (moment(a.endTime).isAfter(moment(b.endTime))) { return 1; }

  return 0;
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
  const lastVisit = await elite2Api.getLastVisit(req);
  const relationships = await elite2Api.getRelationships(req);

  const morningActivity = filterMorning(activityData);
  const afternoonActivity = filterAfternoon(activityData);

  const activities = {
    morningActivities: morningActivity && morningActivity
      .map(data => toEvent(data))
      .sort(byStartTimeThenByEndTime),
    afternoonActivities: afternoonActivity && afternoonActivity
      .map(data => toEvent(data))
      .sort(byStartTimeThenByEndTime),
  };

  const offenceDetails = offenceData && offenceData.map(offenceDetail => ({
    type: offenceDetail.offenceDescription,
  }));

  const mapVisit = (visit) => {
    const nameParts = visit.leadVisitor.split(' ');
    const toName = (value) => value && value.split('').map((letter,index) => index === 0 ? letter.toUpperCase() : letter.toLowerCase()).join('');

    return {
      leadVisitor: `${toName(nameParts[0])} ${toName(nameParts[1])} (${visit.relationshipDescription})`,
      date: visit.startTime,
      type: visit.visitTypeDescription,
      cancellationReason: visit.cancelReasonDescription,
      status: visit.eventStatusDescription,
    };
  };

  const getFirstRelationshipByType = (relationshipType, data) => {
    const results = data.filter(rel => rel.relationship === relationshipType);
    return results.length >= 1 ? {
      firstName: results[0].firstName,
      lastName: results[0].lastName,
    } : null;
  };

  console.error(relationships);

  return {
    assignedStaffMembers: {
      prisonOffenderManager: relationships && getFirstRelationshipByType('POM',relationships),
      communityOffenderManager: relationships && getFirstRelationshipByType('COM',relationships),
    },
    lastVisit: lastVisit && mapVisit(lastVisit),
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
      awards: (adjudications && adjudications.awards && adjudications.awards.map(award => toAward(award))) || [],
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

const service = {
  getQuickLookViewModel,
  getKeyDatesVieModel,
  getBookingDetailsViewModel,
};

module.exports = service;