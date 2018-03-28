const elite2Api = require('../elite2Api');
const moment = require('moment');

const RiskAssessment = require('../model/risk-assessment');
const keyDatesMapper = require('../data-mappers/keydates');
const isoDateFormat = require('./../constants').isoDateFormat;
const toAward = require('../data-mappers/to-award');
const toEvent = require('../data-mappers/to-event');
const toVisit = require('../data-mappers/to-visit');

const byStartTimeThenByEndTime = (a,b) => {
  if (moment(a.startTime).isBefore(moment(b.startTime))) { return -1; }
  if (moment(a.startTime).isAfter(moment(b.startTime))) { return 1; }

  if (!a.endTime) return -1;
  if (!b.endTime) return 1;

  if (moment(a.endTime).isBefore(moment(b.endTime))) { return -1; }
  if (moment(a.endTime).isAfter(moment(b.endTime))) { return 1; }

  return 0;
};

const getKeyDatesVieModel = async (req, res) => {
  const { bookingId } = await elite2Api.getDetailsLight(req, res);
  req.bookingId = bookingId;

  const sentenceData = await elite2Api.getSentenceData(req, res);
  const iepSummary = (await elite2Api.getIepSummary(req, res));
  const categoryAssessment = await elite2Api.getCategoryAssessment(req, res);

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

const getBookingDetailsViewModel = async (req, res) => {
  const details = (await elite2Api.getDetails(req, res));
  const { bookingId } = details;
  req.bookingId = bookingId;

  const iepLevel = (await elite2Api.getIepSummary(req, res)).iepLevel;

  const csraAssessment = details.assessments
    .map(assessment => RiskAssessment(assessment))
    .filter((assessment) => assessment.isCRSA() && assessment.isActive())[0];

  return {
    ...details,
    iepLevel,
    csra: csraAssessment && csraAssessment.riskLevel(),
  };
};

const getQuickLookViewModel = async (req, res) => {
  const threeMonthsInThePast = moment().subtract(3, 'months').format(isoDateFormat);
  const today = moment().format(isoDateFormat);

  const filterMorning = (array) => array.filter(a => moment(a.startTime).get('hour') < 12);
  const filterAfternoon = (array) => array.filter(a => moment(a.startTime).get('hour') > 11);
  const hasAnyActivity = (activities) => activities.morningActivities.length > 0 || activities.afternoonActivities.length > 0;

  const { bookingId } = await elite2Api.getDetailsLight(req, res);
  req.bookingId = bookingId;

  const balance = await elite2Api.getBalances(req, res);
  const offenceData = await elite2Api.getMainOffence(req, res);
  const sentenceData = await elite2Api.getSentenceData(req, res);
  const activityData = await elite2Api.getEventsForToday(req, res);
  const positiveCaseNotes = await elite2Api.getPositiveCaseNotes({ req, res, fromDate: threeMonthsInThePast,toDate: today });
  const negativeCaseNotes = await elite2Api.getNegativeCaseNotes({ req, res, fromDate: threeMonthsInThePast,toDate: today });
  const contacts = await elite2Api.getContacts(req, res);
  const adjudications = await elite2Api.getAdjudications({ req, res, fromDate: threeMonthsInThePast });
  const lastVisit = await elite2Api.getLastVisit(req, res);
  const relationships = await elite2Api.getRelationships(req, res);

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

  const getFirstRelationshipByType = (relationshipType, data) => {
    const results = data.filter(rel => rel.relationship === relationshipType);
    return results.length >= 1 ? {
      firstName: results[0].firstName,
      lastName: results[0].lastName,
    } : null;
  };

  return {
    lastVisit: lastVisit && toVisit(lastVisit),
    assignedStaffMembers: {
      communityOffenderManager: relationships && getFirstRelationshipByType('COM',relationships),
    },
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