const url = require('url')
const path = require('path')
const moment = require('moment')
const { logger } = require('./services/logger')
const errorStatusCode = require('./error-status-code')

/*
 * This isn't really middleware. Its a wrapper for many of the async function calls in this file.
 */
const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(error => {
    logger.error(error)
    res.status(errorStatusCode(error))
    res.end()

    // Throwing 'error' here results in 'unhandled promise rejections'.
    // Node doesn't like that: [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated
    //
    // throw error;
    // The node documentation says to do this:
    next(error)
  })
}

const controllerFactory = ({
  elite2Api,
  userService,
  bookingService,
  eventsService,
  keyworkerService,
  caseNotesApi,
}) => {
  function enableCaching(res) {
    res.setHeader('Cache-Control', 'max-age=3600')
    const expirationDate = moment().add(1, 'h') // one hour from now
    const rfc822Date = moment(expirationDate).format('ddd, DD MMM YYYY HH:mm:ss ZZ')
    res.setHeader('Expires', rfc822Date)
    // Undo helmet noCache:
    res.removeHeader('Surrogate-Control')
    res.removeHeader('Pragma')
  }

  const fetchImage = ({ targetEndpoint, req, res }) => {
    const placeHolder = path.join(__dirname, './assets/images/image-missing.png')
    enableCaching(res)

    if (!req.params.imageId || req.params.imageId === 'placeholder') {
      res.sendFile(placeHolder)
    } else {
      elite2Api
        .getStream(res.locals, targetEndpoint)
        .then(data => {
          res.type('image/jpeg')
          data.pipe(res)
        })
        .catch(error => {
          logger.error(error)
          res.sendFile(placeHolder)
        })
    }
  }

  const getImage = asyncMiddleware(async (req, res) => {
    fetchImage({
      targetEndpoint: `api/images/${req.params.imageId}/data`,
      req,
      res,
    })
  })

  const getFullSizeImage = asyncMiddleware(async (req, res) => {
    fetchImage({
      targetEndpoint: `api/images/${req.params.imageId}/data?fullSizeImage=true`,
      req,
      res,
    })
  })

  const keyDates = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.params
    if (!offenderNo) {
      logger.error('Missing parameter')
      res.status(400)
      res.end()
      return
    }

    const data = await bookingService.getKeyDatesVieModel(res.locals, offenderNo)
    res.json(data)
  })

  const bookingDetails = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.params
    if (!offenderNo) {
      logger.error('Missing parameter')
      res.status(400)
      res.end()
      return
    }

    const data = await bookingService.getBookingDetailsViewModel(res.locals, offenderNo)
    res.json(data)
  })

  const quickLook = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.params
    if (!offenderNo) {
      logger.error('Missing parameter')
      res.status(400)
      res.end()
      return
    }

    const data = await bookingService.getQuickLookViewModel(res.locals, offenderNo)
    res.json(data)
  })

  const eventsForThisWeek = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.params
    if (!offenderNo) {
      logger.error('Missing parameter')
      res.status(400)
      res.end()
      return
    }

    const data = await eventsService.getScheduledEventsForThisWeek(res.locals, offenderNo)
    res.json(data)
  })

  const eventsForNextWeek = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.params
    if (!offenderNo) {
      logger.error('Missing parameter')
      res.status(400)
      res.end()
      return
    }

    const data = await eventsService.getScheduledEventsForNextWeek(res.locals, offenderNo)
    res.json(data)
  })

  const loadAppointmentViewModel = asyncMiddleware(async (req, res) => {
    const { agencyId } = req.params

    if (!agencyId) {
      logger.error('Missing parameter')
      res.status(400)
      res.end()
      return
    }

    const viewModel = await eventsService.getAppointmentViewModel(res.locals, agencyId)
    res.json(viewModel)
  })

  const getExistingEvents = asyncMiddleware(async (req, res) => {
    const { agencyId, offenderNo } = req.params
    const { date } = req.query
    if (!agencyId || !date || !offenderNo) {
      logger.error(`Missing parameter: agencyId=${agencyId} date=${date} offenderNo=${offenderNo}`)
      res.status(400)
      res.end()
      return
    }

    const convertedDate = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
    const events = await eventsService.getExistingEvents(res.locals, agencyId, convertedDate, offenderNo)
    res.json(events)
  })

  const addAppointment = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.params
    if (!offenderNo) {
      logger.error('Missing parameter')
      res.status(400)
      res.end()
      return
    }

    const { bookingId } = await elite2Api.getDetailsLight(res.locals, offenderNo)
    req.body.appointments = [{ bookingId }]

    await elite2Api.post(res.locals, `api/appointments`, req.body)
    res.status(200)
    res.end()
  })

  const alerts = asyncMiddleware(async (req, res) => {
    const alertTypeValid = alertType => (alertType ? /^[A-Z]{1,4}$/.test(alertType) : true)
    const dateValid = date => (date ? /^\d{4}-\d{2}-\d{2}$/.test(date) : true)
    const offenderNoValid = offenderNo => (offenderNo ? /^[A-Z0-9]+$/.test(offenderNo) : true)
    const alertTypeQuery = alertType => (alertType ? `alertType:in:'${alertType}'` : '')
    const fromQuery = fromDate => (fromDate ? `dateCreated:gteq:DATE'${fromDate}'` : '')
    const toQuery = toDate => (toDate ? `dateCreated:lteq:DATE'${toDate}'` : '')

    const { offenderNo } = req.params
    const { from, to, alertType } = req.query

    if (!alertTypeValid(alertType) || !dateValid(from) || !dateValid(to) || !offenderNoValid(offenderNo)) {
      logger.error(`Missing parameter: alertType=${alertType} from=${from} to=${to} offenderNo=${offenderNo}`)
      res.status(400)
      res.end()
      return
    }

    const { bookingId } = await elite2Api.getDetailsLight(res.locals, offenderNo)

    const queryParts = [fromQuery(from), toQuery(to), alertTypeQuery(alertType)].filter(value => value).join(',and:')

    const query = queryParts ? `?query=${queryParts}` : ''

    const data = await elite2Api.get(res.locals, `api/bookings/${bookingId}/alerts${query}`)

    res.set(res.locals.responseHeaders)

    res.json(data)
  })

  const caseNoteTypes = asyncMiddleware(async (req, res) => {
    const data = await caseNotesApi.getCaseNoteTypes(res.locals)
    res.set(res.locals.responseHeaders)
    res.json(data)
  })

  const myCaseNoteTypes = asyncMiddleware(async (req, res) => {
    const data = await caseNotesApi.myCaseNoteTypes(res.locals)
    res.set(res.locals.responseHeaders)
    res.json(data)
  })

  const caseNotes = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.params
    if (!offenderNo) {
      logger.error('Missing parameter')
      res.status(400)
      res.end()
      return
    }

    const queryString = url.parse(req.url).query

    const { bookingId } = await elite2Api.getDetailsLight(res.locals, offenderNo)

    const data = await elite2Api.get(res.locals, `api/bookings/${bookingId}/caseNotes?${queryString}`)

    res.set(res.locals.responseHeaders)

    res.json(data)
  })

  const addCaseNote = asyncMiddleware(async (req, res) => {
    const { offenderNo } = req.params
    if (!offenderNo) {
      logger.error('Missing parameter')
      res.status(400)
      res.end()
      return
    }

    const data = await caseNotesApi.addCaseNote(res.locals, offenderNo, req.body)
    res.json(data)
  })

  const amendCaseNote = asyncMiddleware(async (req, res) => {
    const { offenderNo, caseNoteId } = req.params

    if (!offenderNo || !caseNoteId) {
      logger.error(`Missing parameter: offenderNo=${offenderNo} caseNoteId=${caseNoteId}`)
      res.status(400)
      res.end()
      return
    }

    const data = await caseNotesApi.amendCaseNote(res.locals, offenderNo, caseNoteId, req.body)
    res.json(data)
  })

  const myAssignments = asyncMiddleware(async (req, res) => {
    const result = await keyworkerService.myAllocationsViewModel(res.locals)
    res.json(result)
  })

  const user = asyncMiddleware(async (req, res) => {
    const result = await userService.me(res.locals)
    res.json(result)
  })

  return {
    keyDates,
    bookingDetails,
    quickLook,
    eventsForNextWeek,
    eventsForThisWeek,
    loadAppointmentViewModel,
    getExistingEvents,
    addAppointment,
    alerts,
    caseNoteTypes,
    myCaseNoteTypes,
    caseNotes,
    addCaseNote,
    amendCaseNote,
    getImage,
    getFullSizeImage,
    myAssignments,
    user,
  }
}

module.exports = {
  controllerFactory,
}
