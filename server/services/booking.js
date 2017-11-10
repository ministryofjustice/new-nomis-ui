const elite2Api = require('../elite2Api');
const moment = require('moment');

const RiskAssessment = require('../model/riskAssessment');
const keyDatesMapper = require('../view-model-mappers/keydates');

const getKeyDatesVieModel = async (req) => {
  const sentenceData = await elite2Api.getSentenceData(req);
  const iepSummary = (await elite2Api.getIepSummary(req));

  const sentence = keyDatesMapper.sentence(sentenceData);
  const other = keyDatesMapper.otherDates(sentenceData);

  return {
    iepLevel: iepSummary.iepLevel,
    daysSinceReview: iepSummary.daysSinceReview,
    sentence,
    other,
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
  const threeMonthsInThePast = moment().subtract(3,'months');
  const filterMorning = (array) => array.filter(a => moment(a.startTime).get('hour') < 12);
  const filterAfternoon = (array) => array.filter(a => moment(a.startTime).get('hour') > 11);
  const hasAnyActivity = (activities) => activities.morningActivities.length > 0 || activities.afternoonActivities.length > 0;

  const activityMapper = (activity) => ({
    description: activity.eventSourceDesc,
    startTime: activity.startTime,
    endTime: activity.endTime,
  });

  const balance = await elite2Api.getBalances(req);
  const sentence = await elite2Api.getMainSentence(req);
  const activityData = await elite2Api.getActivitiesForToday(req);
  const positiveCaseNotes = await elite2Api.getPositiveCaseNotes({ req, fromDate: threeMonthsInThePast });
  const negativeCaseNotes = await elite2Api.getNegativeCaseNotes({ req, fromDate: threeMonthsInThePast });

  const morningActivity = filterMorning(activityData);
  const afternoonActivity = filterAfternoon(activityData);

  const activities = {
    morningActivities: morningActivity && morningActivity.map(data => activityMapper(data)),
    afternoonActivities: afternoonActivity && afternoonActivity.map(data => activityMapper(data)),
  };

  const hasSentenceInformation =
    sentence &&
    sentence.mainOffenceDescription &&
    sentence.releaseDate;

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
    sentence: hasSentenceInformation && {
      type: sentence.mainOffenceDescription,
      lengthOfSentence: sentence.sentenceLength,
      releaseDate: sentence.releaseDate,
    },
  };
}

const service = {
  getQuickLookViewModel,
  getKeyDatesVieModel,
  getBookingDetailsViewModel,
};

module.exports = service;