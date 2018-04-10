const url = require('url')
const config = require('./config');
const elite2ApiFallThrough = require('./app').sessionHandler;
const retry = require('./api/retry');

const elite2Api = require('./api/elite2Api');
const session = require('./session');
const bookingService = require('./services/booking');
const eventsService = require('./services/events');
const keyworkerService = require('./services/keyworker');

const { logger } = require('./services/logger');

const baseUrl = config.apis.elite2.url;

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
  const isApiUp = await retry.getApiHealth();
  logger.info(`loginIndex - health check called and the isaAppUp = ${isApiUp}`);
  res.render('pages/login', { authError: false, apiUp: isApiUp });
};

const login = async (req, res) => {
  const loginData = `username=${req.body.username.toString().toUpperCase()}&password=${req.body.password}&grant_type=password`;
  retry.httpRequest({
    method: 'post',
    url: url.resolve(baseUrl, 'oauth/token'),
    headers: {
      authorization: `Basic ${retry.encodeClientCredentials()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: loginData,
    timeout: 2000,
  }).then((response) => {
    req.session.isAuthenticated = true;

    session.setHmppsCookie(res, response.data);

    res.redirect('/');
  }).catch(error => {
    const code = retry.errorStatusCode(error.response);
    res.status(code);
    if (code < 500) {
      logger.warn('Login failed, invalid password', { user: String(req.body.username) });
      res.render('pages/login', { authError: true, apiUp: true });
    } else {
      logger.error(error);
      res.render('pages/login', { authError: false, apiUp: false });
    }
    res.render('pages/login', { authError: true, apiUp: true });
  });
};

const logout = (req, res) => {
  session.deleteHmppsCookie(res);
  req.session = null;
  res.redirect('/login');
};

const fetchImage = ({ targetEndpoint, req, res }) => {
  retry.callApi({
    method: 'get',
    url: targetEndpoint,
    responseType: 'stream',
    headers: {},
    reqHeaders: { jwt: { access_token: req.access_token, refresh_token: req.refresh_token }, host: req.headers.host },
    onTokenRefresh: session.updateHmppsCookie(res),
  }).then(response => {
    response.data.pipe(res);
  }).catch(error => {
    logger.error(error);
    res.status(retry.errorStatusCode(error.response));
    res.end();
  });
};

const offenderImage = asyncMiddleware(async (req, res) => {
  const { bookingId } = await elite2Api.getDetailsLight(req, res);

  fetchImage({
    targetEndpoint: url.resolve(baseUrl, `api/bookings/${bookingId}/image/data`),
    req,
    res,
  });
});

const getImage = asyncMiddleware(async (req, res) => {
  fetchImage({
    targetEndpoint: url.resolve(baseUrl, `api/images/${req.params.imageId}/data`),
    req,
    res,
  });
});


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

const myAssignments = asyncMiddleware(async (req, res) => {
  const result = await keyworkerService.getAssignedOffenders(req, res);
  res.json(result);
});

module.exports = {
  keyDates,
  login,
  loginIndex,
  logout,
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
  offenderImage,
  getImage,
  myAssignments,
};