const apiService = require('./apiService'), 
  errorStatusCode = apiService.errorStatusCode;
const session = require('./session');

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

const keyDates = (req,res) => {
  if (!req.params.bookingId) {
    res.status(400);
    res.end();
    return;
  }

  Promise.all([apiService.getSentenceData(req), apiService.getIepSummary(req)]).then(response => {
    const sentence = keyDatesMapper.sentence(response[0].sentence);
    const other = keyDatesMapper.otherDates(response[0].sentence);
    const iepSummary = response[1].iepSummary;

    res.setHeader('jwt', session.extendSession(req.headers));
    res.json({
      iepLevel: iepSummary.iepLevel,
      daysSinceReview: iepSummary.daysSinceReview,
      sentence,
      other,
    });
  }).catch(error => {
    res.status(errorStatusCode(error.response));
    res.end();
  });
};

const bookingDetails = (req, res) => {
  const bookingId = req.params.bookingId;

  if (!bookingId) {
    res.status(400);
    res.end();
    return;
  }
  
  const getIepLevel = apiService.getIepSummary(req)
    .then(response => new Promise(r => r({ iepLevel: response.iepSummary.iepLevel })))
    .catch(response => new Promise(r => r({ iepLevel: '--' }))); // eslint-disable-line no-unused-vars

  Promise.all([apiService.getDetails(req), getIepLevel]).then(response => {
    const details = response[0].details;
    const iepLevel = (response[1] && response[1].iepLevel) || {};
    const firstAssessment = details.assessments[0];

    const csraLevel = firstAssessment && firstAssessment.assessmentCode === 'CSR' ? firstAssessment.classification : '--';

    debugger;
    const data = Object.assign({}, details, {
      iepLevel,
    },
      {
        csra: csraLevel,
      });

    res.setHeader('jwt', session.extendSession(req.headers));

    res.json(data);
  }).catch(error => {
    res.status(errorStatusCode(error.response));
    res.end();
  });
}

module.exports = {
  keyDates,
  login,
  images,
  bookingDetails,
}