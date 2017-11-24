const elite2Api = require('./elite2Api'),
  errorStatusCode = elite2Api.errorStatusCode;
const session = require('./session');

const bookingService = require('./services/booking');

const asyncMiddleware = fn =>
  (req, res, next) => {
    res.setHeader('jwt', session.extendSession(req.headers));
    Promise.resolve(fn(req, res, next))
      .catch(error => {
        res.status(errorStatusCode(error.response));
        res.end();

        throw error;
      });
  };

const login = (req, res) => {
  elite2Api.httpRequest({
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
  elite2Api.callApi({
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

  const data = await bookingService.getKeyDatesVieModel(req);
  res.json(data);
});

const bookingDetails = asyncMiddleware(async (req, res) => {
  const bookingId = req.params.bookingId;

  if (!bookingId) {
    res.status(400);
    res.end();
    return;
  }

  const data = await bookingService.getBookingDetailsViewModel(req);
  res.json(data);
});

const quickLook = asyncMiddleware(async (req, res) => {
  const bookingId = req.params.bookingId;

  if (!bookingId) {
    res.status(400);
    res.end();
    return;
  }
   
  const data = await bookingService.getQuickLookViewModel(req);
  res.json(data);
});

const appointmentsForThisWeek = asyncMiddleware(async (req,res) => {
  const bookingId = req.params.bookingId;

  if (!bookingId) {
    res.status(400);
    res.end();
    return;
  }

  const data = await bookingService.getScheduledActivitiesForThisWeek(req);
  res.json(data);
});

const appointmentsForNextWeek = asyncMiddleware(async (req,res) => {
  const bookingId = req.params.bookingId;

  if (!bookingId) {
    res.status(400);
    res.end();
    return;
  }

  const data = await bookingService.getScheduledActivitiesForNextWeek(req);
  res.json(data);
});

module.exports = {
  keyDates,
  login,
  images,
  bookingDetails,
  quickLook,
  appointmentsForNextWeek,
  appointmentsForThisWeek,
};