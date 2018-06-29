const url = require('url');
const path = require('path');
const config = require('./config');
const elite2ApiFallThrough = require('./app').sessionHandler;
const retry = require('./api/retry');

const session = require('./session');
const bookingService = require('./services/booking');
const eventsService = require('./services/events');
const keyworkerService = require('./services/keyworker');

const { logger } = require('./services/logger');
const moment = require('moment');

const baseUrl = config.apis.elite2.url;
const mailTo = config.app.mailTo;

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(error => {
        logger.error(error);
        res.status(retry.errorStatusCode(error));
        res.end();

        throw error;
      });
  };

const controllerFactory = (
  {
    elite2Api,
    keyworkerApi,
    userService,
  }) => {
  const terms = async (req, res) => {
    res.render('pages/terms', { mailTo });
  };

  function enableCaching(res) {
    res.setHeader('Cache-Control', 'max-age=3600');
    const expirationDate = moment().add(1, 'h'); // one hour from now
    const rfc822Date = moment(expirationDate).format('ddd, DD MMM YYYY HH:mm:ss ZZ');
    res.setHeader('Expires', rfc822Date);
    // Undo helmet noCache:
    res.removeHeader('Surrogate-Control');
    res.removeHeader('Pragma');
  }

  const fetchImage = ({ targetEndpoint, req, res }) => {
    const placeHolder = path.join(__dirname, './assets/images/image-missing.png');
    enableCaching(res);

    if (!req.params.imageId || req.params.imageId === 'placeholder') {
      res.sendFile(placeHolder);
    } else {
      retry.callApi({
        method: 'get',
        url: targetEndpoint,
        responseType: 'stream',
        headers: {},
        host: req.headers.host,
        onTokenRefresh: () => session.setHmppsCookie(res),
      }).then(response => {
        res.type('image/png');
        response.data.pipe(res);
      }).catch(error => {
        logger.error(error);
        res.sendFile(placeHolder);
      });
    }
  };

  const getImage = asyncMiddleware(async (req, res) => {
    fetchImage({
      targetEndpoint: url.resolve(baseUrl, `api/images/${req.params.imageId}/data`),
      req,
      res,
    });
  });

  const keyDates = asyncMiddleware(async (req, res) => {
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

  const eventsForThisWeek = asyncMiddleware(async (req, res) => {
    if (!req.params.offenderNo) {
      res.status(400);
      res.end();
      return;
    }

    const data = await eventsService.getScheduledEventsForThisWeek(req, res);
    res.json(data);
  });

  const eventsForNextWeek = asyncMiddleware(async (req, res) => {
    if (!req.params.offenderNo) {
      res.status(400);
      res.end();
      return;
    }

    const data = await eventsService.getScheduledEventsForNextWeek(req, res);
    res.json(data);
  });

  const loadAppointmentViewModel = asyncMiddleware(async (req, res) => {
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

    const { bookingId } = await elite2Api.getDetailsLight(res.locals, req.params.offenderNo);
    req.url = `/bookings/${bookingId}/appointments`;

    elite2ApiFallThrough(req, res);
  });

  const alerts = asyncMiddleware(async (req, res) => {
    if (!req.params.offenderNo) {
      res.status(400);
      res.end();
      return;
    }

    const { bookingId } = await elite2Api.getDetailsLight(res.locals, req.params.offenderNo);
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

    const { bookingId } = await elite2Api.getDetailsLight(res.locals, req.params.offenderNo);
    req.url = `/bookings/${bookingId}/caseNotes?${queryString}`;

    elite2ApiFallThrough(req, res);
  });

  const addCaseNote = asyncMiddleware(async (req, res) => {
    if (!req.params.offenderNo) {
      res.status(400);
      res.end();
      return;
    }

    const { bookingId } = await elite2Api.getDetailsLight(res.locals, req.params.offenderNo);
    req.url = `/bookings/${bookingId}/caseNotes`;
    elite2ApiFallThrough(req, res);
  });

  const caseNote = asyncMiddleware(async (req, res) => {
    if (!req.params.offenderNo || !req.params.caseNoteId) {
      res.status(400);
      res.end();
      return;
    }

    const { caseNoteId } = req.params;
    const { bookingId } = await elite2Api.getDetailsLight(res.locals, req.params.offenderNo);
    req.url = `/bookings/${bookingId}/caseNotes/${caseNoteId}`;

    elite2ApiFallThrough(req, res);
  });

  const myAssignments = asyncMiddleware(async (req, res) => {
    const result = await keyworkerService.myAllocationsViewModel(req, res);
    res.json(result);
  });

  const user = asyncMiddleware(async (req, res) => {
    const result = await userService.me(res.locals);
    res.json(result);
  });

  return {
    keyDates,
    terms,
    bookingDetails,
    quickLook,
    eventsForNextWeek,
    eventsForThisWeek,
    loadAppointmentViewModel,
    addAppointment,
    alerts,
    caseNotes,
    addCaseNote,
    caseNote,
    getImage,
    myAssignments,
    user,
  };
};

module.exports = {
  controllerFactory,
};