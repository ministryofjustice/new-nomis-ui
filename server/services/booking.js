const elite2Api = require('../api/elite2Api');
const moment = require('moment');
const RiskAssessment = require('../model/risk-assessment');
const keyDatesMapper = require('../data-mappers/keydates');
const isoDateFormat = require('./../constants').isoDateFormat;
const toAward = require('../data-mappers/to-award');
const toVisit = require('../data-mappers/to-visit').toVisit;
const toLastVisit = require('../data-mappers/to-visit').toLastVisit;
const toActivityViewModel = require('../data-mappers/to-activity-viewmodel');

const getKeyDatesVieModel = async (req, res) => {
  const { bookingId } = await elite2Api.getDetailsLight(req, res);
  req.bookingId = bookingId;

  const [sentenceData, iepSummary, categoryAssessment] = await Promise.all([
    elite2Api.getSentenceData(req, res),
    elite2Api.getIepSummary(req, res),
    elite2Api.getCategoryAssessment(req, res),
  ]);

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
  const details = await elite2Api.getDetails(req, res);
  const { bookingId } = details;
  req.bookingId = bookingId;

  const iepLevel = (await elite2Api.getIepSummary(req, res)).iepLevel;

  const csraAssessment = details.assessments
    .map(assessment => RiskAssessment(assessment))
    .filter((assessment) => assessment.isCRSA() && assessment.isActive())[0];

  const keyworker = await elite2Api.getKeyworker(req, res);

  return {
    ...details,
    iepLevel,
    keyworker,
    csra: csraAssessment && csraAssessment.riskLevel(),
  };
};

const getQuickLookViewModel = async (req, res) => {
  const threeMonthsInThePast = moment().subtract(3, 'months').format(isoDateFormat);
  const today = moment().format(isoDateFormat);

  const { bookingId } = await elite2Api.getDetailsLight(req, res);
  req.bookingId = bookingId;

  const ids = [req.params.offenderNo];

  const apiCalls = [
    elite2Api.getBalances(req, res),
    elite2Api.getMainOffence(req, res),
    elite2Api.getSentenceData(req, res),
    elite2Api.getEventsForToday(req, res),
    elite2Api.getPositiveCaseNotes({ req, res, fromDate: threeMonthsInThePast,toDate: today }),
    elite2Api.getNegativeCaseNotes({ req, res, fromDate: threeMonthsInThePast,toDate: today }),
    elite2Api.getContacts(req, res),
    elite2Api.getAdjudications({ req, res, fromDate: threeMonthsInThePast }),
    elite2Api.getLastVisit(req, res),
    elite2Api.getNextVisit({ req, res, fromDate: today }),
    elite2Api.getRelationships(req, res),
    elite2Api.caseNoteUsageList(req, res, ids),
  ];

  const [
    balance,
    offenceData,
    sentenceData,
    activityData,
    positiveCaseNotes,
    negativeCaseNotes,
    contacts,
    adjudications,
    lastVisit,
    nextVisit,
    relationships,
    kwCaseNoteDates,
  ] = await Promise.all(apiCalls);

  const activities = toActivityViewModel(activityData);
  const hasAnyActivity =
    activities.morningActivities.length > 0 ||
    activities.afternoonActivities.length > 0 ||
    activities.eveningDuties.length > 0;

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

  let lastKWSessionDate = null;
  if (kwCaseNoteDates.length > 0) {
    lastKWSessionDate = kwCaseNoteDates.reduce((m, v, i) => (v.latestCaseNote > m.latestCaseNote) && i ? v : m).latestCaseNote;
  }

  return {
    lastVisit: lastVisit && toLastVisit(lastVisit),
    nextVisit: nextVisit && toVisit(nextVisit),
    assignedStaffMembers: {
      communityOffenderManager: relationships && getFirstRelationshipByType('COM',relationships),
    },
    balance: balance && {
      spends: balance.spends,
      cash: balance.cash,
      savings: balance.savings,
      currency: balance.currency,
    },
    activities: hasAnyActivity ? activities : null,
    positiveCaseNotes: (positiveCaseNotes && positiveCaseNotes.count) || 0,
    negativeCaseNotes: (negativeCaseNotes && negativeCaseNotes.count) || 0,
    offences: (offenceDetails && offenceDetails.length > 0) ? offenceDetails : null,
    releaseDate: sentenceData ? sentenceData.releaseDate : null,
    tariffDate: sentenceData ? sentenceData.tariffDate : null,
    lastKeyWorkerSessionDate: lastKWSessionDate,
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