const elite2Api = require('./elite2Api'),
  errorStatusCode = elite2Api.errorStatusCode;
const session = require('./session');
const config = require('./config');

const bookingService = require('./services/booking');
const eventsService = require('./services/events');

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(error => {
        res.status(errorStatusCode(error.response));
        res.end();

        throw error;
      });
  };

const loginIndex = (req, res) => {
  res.render('pages/login', { authError: false });
};

const login = (req, res) => {
  elite2Api.httpRequest({
    method: 'post',
    url: 'oauth/token',
    headers: {
      authorization: `Basic ${elite2Api.encodeClientCredentials()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    params: {
      grant_type: 'password',
      username: req.body.username.toString().toUpperCase(),
      password: req.body.password,
    },
  }).then((response) => {
    req.session.isAuthenticated = true;

    session.setHmppsCookie(res, response.data);

    res.redirect('/');
  }).catch(error => {
    console.error(error);
    res.status(errorStatusCode(error.response));
    res.render('pages/login', { authError: true });
  });
};

const logout = (req, res) => {
  session.deleteHmppsCookie(res);
  req.session = null;
  res.redirect('/login');
};

const images = (req, res) => {
  elite2Api.callApi({
    method: 'get',
    url: `api/images${req.url}`,
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

  const data = await bookingService.getKeyDatesVieModel(req, res);
  res.json(data);
});

const bookingDetails = asyncMiddleware(async (req, res) => {
  const bookingId = req.params.bookingId;

  if (!bookingId) {
    res.status(400);
    res.end();
    return;
  }

  const data = await bookingService.getBookingDetailsViewModel(req, res);
  res.json(data);
});

const quickLook = asyncMiddleware(async (req, res) => {
  const bookingId = req.params.bookingId;

  if (!bookingId) {
    res.status(400);
    res.end();
    return;
  }

  const data = await bookingService.getQuickLookViewModel(req, res);
  res.json(data);
});

const eventsForThisWeek = asyncMiddleware(async (req,res) => {
  const bookingId = req.params.bookingId;

  if (!bookingId) {
    res.status(400);
    res.end();
    return;
  }

  const data = await eventsService.getScheduledEventsForThisWeek(req, res);
  res.json(data);
});

const eventsForNextWeek = asyncMiddleware(async (req,res) => {
  const bookingId = req.params.bookingId;

  if (!bookingId) {
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

const addAppointment = asyncMiddleware(async (req,res) => {
  const bookingId = req.params.bookingId;

  if (!bookingId) {
    res.status(400);
    res.end();
    return;
  }

  await elite2Api.addAppointment({ req, res });
  res.status(200);
  res.end();
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
};