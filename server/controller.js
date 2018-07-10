const url = require('url');
const path = require('path');
const config = require('./config');

const { logger } = require('./services/logger');
const moment = require('moment');
const errorStatusCode = require('./error-status-code');

const mailTo = config.app.mailTo;

/*
 * This isn't really middleware. Its a wrapper for many of the async function calls in this file.
 */
const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(error => {
        logger.error(error);
        res.status(errorStatusCode(error));
        res.end();

        // Throwing 'error' here results in 'unhandled promise rejections'.
        // Node doesn't like that: [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated
        //
        // throw error;
        // The node documentation says to do this:
        next(error);
      });
  };

const controllerFactory = (
  {
    elite2Api,
    userService,
    bookingService,
    eventsService,
    keyworkerService,
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
      elite2Api
        .getStream(res.locals, targetEndpoint)
        .then(data => {
          res.type('image/png');
          data.pipe(res);
        })
        .catch(error => {
          logger.error(error);
          res.sendFile(placeHolder);
        });
    }
  };

  const getImage = asyncMiddleware(async (req, res) => {
    fetchImage({
      targetEndpoint: `api/images/${req.params.imageId}/data`,
      req,
      res,
    });
  });

  const keyDates = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.params;
    if (!offenderNo) {
      res.status(400);
      res.end();
      return;
    }

    const data = await bookingService.getKeyDatesVieModel(res.locals, offenderNo);
    res.json(data);
  });

  const bookingDetails = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.params;
    if (!offenderNo) {
      res.status(400);
      res.end();
      return;
    }

    const data = await bookingService.getBookingDetailsViewModel(res.locals, offenderNo);
    res.json(data);
  });

  const quickLook = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.params;
    if (!offenderNo) {
      res.status(400);
      res.end();
      return;
    }

    const data = await bookingService.getQuickLookViewModel(res.locals, offenderNo);
    res.json(data);
  });

  const eventsForThisWeek = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.params;
    if (!offenderNo) {
      res.status(400);
      res.end();
      return;
    }

    const data = await eventsService.getScheduledEventsForThisWeek(res.locals, offenderNo);
    res.json(data);
  });

  const eventsForNextWeek = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.params;
    if (!offenderNo) {
      res.status(400);
      res.end();
      return;
    }

    const data = await eventsService.getScheduledEventsForNextWeek(res.locals, offenderNo);
    res.json(data);
  });

  const loadAppointmentViewModel = asyncMiddleware(async (req, res) => {
    const { agencyId } = req.params;

    if (!agencyId) {
      res.status(400);
      res.end();
      return;
    }

    const viewModel = await eventsService.getAppointmentViewModel(res.locals, agencyId);
    res.json(viewModel);
  });

  const addAppointment = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.params;
    if (!offenderNo) {
      res.status(400);
      res.end();
      return;
    }

    const { bookingId } = await elite2Api.getDetailsLight(res.locals, offenderNo);

    const data = await elite2Api.post(res.locals, `/api/bookings/${bookingId}/appointments`, req.body);
    res.json(data);
  });

  const alerts = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.params;
    if (!offenderNo) {
      res.status(400);
      res.end();
      return;
    }

    const { bookingId } = await elite2Api.getDetailsLight(res.locals, offenderNo);
    const data = await elite2Api.get(res.locals, `/api/bookings/${bookingId}/alerts`);

    res.set(res.locals.responseHeaders);

    res.json(data);
  });

  const caseNotes = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.params;
    if (!offenderNo) {
      res.status(400);
      res.end();
      return;
    }

    const queryString = url.parse(req.url).query;

    const { bookingId } = await elite2Api.getDetailsLight(res.locals, offenderNo);

    const data = await elite2Api.get(res.locals, `/api/bookings/${bookingId}/caseNotes?${queryString}`);

    res.set(res.locals.responseHeaders);

    res.json(data);
  });

  const addCaseNote = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.params;
    if (!offenderNo) {
      res.status(400);
      res.end();
      return;
    }

    const { bookingId } = await elite2Api.getDetailsLight(res.locals, offenderNo);

    const data = await elite2Api.post(res.locals, `/api/bookings/${bookingId}/caseNotes`, req.body);
    res.json(data);
  });

  const caseNote = asyncMiddleware(async (req, res) => {
    const { offenderNo, caseNoteId } = req.params;

    if (!offenderNo || !caseNoteId) {
      res.status(400);
      res.end();
      return;
    }

    const { bookingId } = await elite2Api.getDetailsLight(res.locals, offenderNo);

    const data = await elite2Api.get(res.locals, `/api/bookings/${bookingId}/caseNotes/${caseNoteId}`);
    res.json(data);
  });

  const amendCaseNote = asyncMiddleware(async (req, res) => {
    const { offenderNo, caseNoteId } = req.params;

    if (!offenderNo || !caseNoteId) {
      res.status(400);
      res.end();
      return;
    }

    const { bookingId } = await elite2Api.getDetailsLight(res.locals, offenderNo);

    const data = await elite2Api.put(res.locals, `/api/bookings/${bookingId}/caseNotes/${caseNoteId}`, req.body);
    res.json(data);
  });

  const myAssignments = asyncMiddleware(async (req, res) => {
    const result = await keyworkerService.myAllocationsViewModel(res.locals);
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
    amendCaseNote,
    caseNote,
    getImage,
    myAssignments,
    user,
  };
};

module.exports = {
  controllerFactory,
};