const apiService = require('./apiService'), 
  errorStatusCode = apiService.errorStatusCode;
const session = require('./session');
const moment = require('moment');

const asyncMiddleware = fn =>
  (req, res, next) => {
    res.setHeader('jwt', session.extendSession(req.headers));
    Promise.resolve(fn(req, res, next))
      .catch(error => {
        res.status(errorStatusCode(error.response));
        res.end();
      });
  };

const keyDatesMapper = require('./view-model-mappers/keydates');

const login = (req, res) => {
  apiService.httpRequest({
    method: 'post',
    url: '/users/login',
    data: req.body,
  }).then((response) => {
    const jwtToken = session.newJWT(response.data);
    res.setHeader('jwt', jwtToken);
    res.json(jwtToken);
  }).catch(error => {
    res.status(errorStatusCode(error.response));
    res.end();
  });
};

const images = (req, res) => {
  apiService.callApi({
    method: 'get',
    url: `images${req.url}`,
    responseType: 'stream',
    headers: {},
    reqHeaders: req.headers,
    onTokenRefresh: (token) => { req.headers.jwt = token },
  }).then(response => {
    res.setHeader('jwt', session.extendSession(req.headers));

    Object.keys(response.headers).forEach(key => {
      res.setHeader(key, response.headers[key]);
    });

    response.data.pipe(res);
  }).catch(error => {
    res.status(errorStatusCode(error.response));
    res.end();
  });
};

const keyDates = asyncMiddleware(async (req,res) => {
  if (!req.params.bookingId) {
    res.status(400);
    res.end();
    return;
  }

  const sentenceData = await apiService.getSentenceData(req);
  const sentence = keyDatesMapper.sentence(sentenceData);
  const other = keyDatesMapper.otherDates(sentenceData);
  const iepSummary = (await apiService.getIepSummary(req));

  const data = {
    iepLevel: iepSummary.iepLevel,
    daysSinceReview: iepSummary.daysSinceReview,
    sentence,
    other,
  };
  res.json(data);
});

const bookingDetails = asyncMiddleware(async (req, res) => {
  const bookingId = req.params.bookingId;

  if (!bookingId) {
    res.status(400);
    res.end();
    return;
  }
  
  const details = (await apiService.getDetails(req));
  const iepLevel = (await apiService.getIepSummary(req)).iepLevel;

  const csraAssessment = details.assessments.filter((assessment) => assessment.cellSharingAlertFlag === true && assessment.classification);
  const csraLevel = csraAssessment && csraAssessment.length > 0 ? csraAssessment[0].classification : '--';

  const data = {
    ...details,
    iepLevel ,
    csra: csraLevel,
  };

  res.json(data);
});

const quickLook = asyncMiddleware(async (req, res) => {
  const bookingId = req.params.bookingId;

  if (!bookingId) {
    res.status(400);
    res.end();
    return;
  }

  const balance = await apiService.getBalances(req);
  const sentence = await apiService.getMainSentence(req);
  const activityData = await apiService.getActivitiesForToday(req);

  const unique = (array) => array.reduce((result, current) => {
    if (result.indexOf(current) < 0) { result.push(current); }
    return result;
  },[]);

  const filterMorning = (array) => array.filter(a => moment(a.startTime).get('hour') < 12);
  const filterAfternoon = (array) => array.filter(a => moment(a.startTime).get('hour') > 11);

  const morningActivity = filterMorning(activityData);
  const afternoonActivity = filterAfternoon(activityData);

  const activities = {
    morningActivities: morningActivity && unique(morningActivity).map(activity => ({
      description: activity.eventSourceDesc,
      startTime: activity.startTime,
      endTime: activity.endTime,
    })),
    afternoonActivities: afternoonActivity && unique(afternoonActivity).map(activity => ({
      description: activity.eventSourceDesc,
      startTime: activity.startTime,
      endTime: activity.endTime,
    })),
  };

  const hasSentenceInformation =
    sentence &&
    sentence.mainOffenceDescription &&
    sentence.sentenceLength &&
    sentence.releaseDate;

  const data = {
    balance,
    activities: (activities.morningActivities.length > 0 || activities.afternoonActivities.length > 0) ? activities : null ,
    sentence: hasSentenceInformation && {
      type: sentence.mainOffenceDescription,
      lengthOfSentence: sentence.sentenceLength,
      releaseDate: sentence.releaseDate,
    },
  };

  res.json(data);
});

module.exports = {
  keyDates,
  login,
  images,
  bookingDetails,
  quickLook,
};