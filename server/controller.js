const url = require('url')
const baseUrl = process.env.API_ENDPOINT_URL || 'http://localhost:3000';
const elite2ApiFallThrough = require('./app').sessionHandler;
const retry = require('./api/retry');

const elite2Api = require('./api/elite2Api');
const session = require('./session');
const bookingService = require('./services/booking');
const eventsService = require('./services/events');
const { logger } = require('./services/logger');

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(error => {
        logger.error(error);
        res.status(retry.errorStatusCode(error.response));
        res.end();

        throw error;
      });
  };

const loginIndex = async (req, res) => {
  let isApiUp = true;
  logger.info('loginIndex - About to call the health check endpoint');
  await retry.getApiHealth().catch(error => {
    logger.error(error);
    isApiUp = false;
  });
  logger.info(`loginIndex - health check called and the isaAppUp = ${isApiUp}`);
  res.render('pages/login', { authError: false, apiUp: isApiUp });
};

const login = async (req, res) => {
  let isApiUp = true;
  logger.info('login - About to call the health check endpoint');
  await retry.getApiHealth().catch(error => {
    logger.error(error);
    isApiUp = false;
  });
  logger.info(`login - health check called and the isaAppUp = ${isApiUp}`);

  if (isApiUp) {
    const loginData = `username=${req.body.username.toString().toUpperCase()}&password=${req.body.password}&grant_type=password`;
    retry.httpRequest({
      method: 'post',
      url: url.resolve(baseUrl, 'oauth/token'),
      headers: {
        authorization: `Basic ${retry.encodeClientCredentials()}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: loginData,
    }).then((response) => {
      req.session.isAuthenticated = true;

      session.setHmppsCookie(res, response.data);

      res.redirect('/');
    }).catch(error => {
      logger.error(error);
      res.status(retry.errorStatusCode(error.response));
      res.render('pages/login', { authError: true, apiUp: true });
    });
  } else {
    res.status(503);
    res.render('pages/login', { authError: false, apiUp: false });
  }
};

const logout = (req, res) => {
  session.deleteHmppsCookie(res);
  req.session = null;
  res.redirect('/login');
};

const images = (req, res) => {
  retry.callApi({
    method: 'get',
    url: url.resolve(baseUrl,`api/images${req.url}`),
    responseType: 'stream',
    headers: {},
    reqHeaders: { jwt: { access_token: req.access_token, refresh_token: req.refresh_token }, host: req.headers.host },
    onTokenRefresh: session.updateHmppsCookie(res),
  }).then(response => {
    Object.keys(response.headers).forEach(key => {
      res.setHeader(key, response.headers[key]);
    });

    response.data.pipe(res);
  }).catch(error => {
    logger.error(error);
    res.status(retry.errorStatusCode(error.response));
    res.end();
  });
};

const keyDates = asyncMiddleware(async (req,res) => {
  if (!req.params.offenderNo) {
    res.status(400);
    res.end();
    return;
  }

  const data = await bookingService.getKeyDatesVieModel(req, res);
  res.json(data);
});

const bookingDetails = asyncMiddleware(async (req, res) => {
  if (!req.params.offenderNo) {
    res.status(400);
    res.end();
    return;
  }

  const data = await bookingService.getBookingDetailsViewModel(req, res);
  res.json(data);
});

const quickLook = asyncMiddleware(async (req, res) => {
  if (!req.params.offenderNo) {
    res.status(400);
    res.end();
    return;
  }

  const data = await bookingService.getQuickLookViewModel(req, res);
  res.json(data);
});

const eventsForThisWeek = asyncMiddleware(async (req,res) => {
  if (!req.params.offenderNo) {
    res.status(400);
    res.end();
    return;
  }

  const data = await eventsService.getScheduledEventsForThisWeek(req, res);
  res.json(data);
});

const eventsForNextWeek = asyncMiddleware(async (req,res) => {
  if (!req.params.offenderNo) {
    res.status(400);
    res.end();
    return;
  }

  const data = await eventsService.getScheduledEventsForNextWeek(req, res);
  res.json(data);
});

const loadAppointmentViewModel = asyncMiddleware(async (req,res) => {
  const agencyId = req.params.agencyId;

  if (!agencyId) {
    res.status(400);
    res.end();
    return;
  }

  const viewModel = await eventsService.getAppointmentViewModel(req, res);
  res.json(viewModel);
});

const addAppointment = asyncMiddleware(async (req, res) => {
  if (!req.params.offenderNo) {
    res.status(400);
    res.end();
    return;
  }

  const { bookingId } = await elite2Api.getDetailsLight(req, res);
  req.url = `/bookings/${bookingId}/appointments`;

  elite2ApiFallThrough(req, res);
});

const alerts = asyncMiddleware(async (req, res) => {
  if (!req.params.offenderNo) {
    res.status(400);
    res.end();
    return;
  }

  const { bookingId } = await elite2Api.getDetailsLight(req, res);
  req.bookingId = bookingId;
  req.url = `/bookings/${bookingId}/alerts`;

  elite2ApiFallThrough(req, res);
});

const caseNotes = asyncMiddleware(async (req, res) => {
  if (!req.params.offenderNo) {
    res.status(400);
    res.end();
    return;
  }

  const queryString = url.parse(req.url).query;
  const { bookingId } = await elite2Api.getDetailsLight(req, res);
  req.url = `/bookings/${bookingId}/caseNotes?${queryString}`;

  elite2ApiFallThrough(req, res);
});

const addCaseNote = asyncMiddleware(async (req, res) => {
  if (!req.params.offenderNo) {
    res.status(400);
    res.end();
    return;
  }

  const { bookingId } = await elite2Api.getDetailsLight(req, res);
  req.url = `/bookings/${bookingId}/caseNotes`;

  elite2ApiFallThrough(req, res);
});

const updateCaseNote = asyncMiddleware(async (req, res) => {
  if (!req.params.offenderNo || !req.params.caseNoteId) {
    res.status(400);
    res.end();
    return;
  }

  const { caseNoteId } = req.params;
  const { bookingId } = await elite2Api.getDetailsLight(req, res);
  req.url = `/bookings/${bookingId}/caseNotes/${caseNoteId}`;

  elite2ApiFallThrough(req, res);
});

module.exports = {
  keyDates,
  login,
  loginIndex,
  logout,
  images,
  bookingDetails,
  quickLook,
  eventsForNextWeek,
  eventsForThisWeek,
  loadAppointmentViewModel,
  addAppointment,
  alerts,
  caseNotes,
  addCaseNote,
  updateCaseNote,
};