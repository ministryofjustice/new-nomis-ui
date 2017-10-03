const apiService = require('./apiService'), 
  errorStatusCode = apiService.errorStatusCode;
const session = require('./session');

const keyDatesMapper = require('./view-model-mappers/sentenceKeyDates');

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
  const getSentenceData = apiService.callApi({
    method: 'get',
    url: `bookings/${req.params.bookingId}/sentenceDetail`,
    headers: {},
    reqHeaders: req.headers,
    onTokenRefresh: (token) => { req.headers.jwt = token },
  }).then(response => new Promise(r => r({ sentence: response.data })));

  const getiepSummary = apiService.callApi({
    method: 'get',
    url: `bookings/${req.params.bookingId}/iepSummary`,
    headers: {},
    reqHeaders: req.headers,
    onTokenRefresh: (token) => { req.headers.jwt = token },
  }).then(response => new Promise(r => r({ iepSummary: response.data })));

  Promise.all([getSentenceData, getiepSummary]).then(response => {
    const sentence = keyDatesMapper(response[0].sentence);
    const iepSummary = response[1].iepSummary;

    res.setHeader('jwt', session.extendSession(req.headers));
    res.json({
      iepLevel: iepSummary.iepLevel,
      daysSinceReview: iepSummary.daysSinceReview,
      sentence,
      other: null,
    });
  }).catch(error => {
    res.status(errorStatusCode(error.response));
    res.end();
  });
};

module.exports = {
  keyDates,
  login,
  images,
}