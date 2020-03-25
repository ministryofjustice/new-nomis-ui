const express = require('express')
const requestForwarding = require('./request-forwarding')
const config = require('./config')
const { controllerFactory } = require('./controller')
const { userServiceFactory } = require('./services/user')
const { bookingServiceFactory } = require('./services/booking')
const { eventsServiceFactory } = require('./services/events')
const { keyworkerServiceFactory } = require('./services/keyworker')

const router = express.Router()

module.exports = ({
  eliteApi,
  oauthApi,
  keyworkerApi,
  caseNotesApi,
  allocationManagerApi,
  whereaboutsApi,
  dataComplianceApi,
}) => {
  const userService = userServiceFactory(eliteApi, oauthApi, whereaboutsApi, config)
  const bookingService = bookingServiceFactory(eliteApi, keyworkerApi, allocationManagerApi, dataComplianceApi)
  const eventsService = eventsServiceFactory(eliteApi)
  const keyworkerService = keyworkerServiceFactory(eliteApi, oauthApi, keyworkerApi)

  const controller = controllerFactory({
    elite2Api: eliteApi,
    userService,
    bookingService,
    eventsService,
    keyworkerService,
    caseNotesApi,
  })

  router.use('/config', (req, res) => {
    const { feedbackUrl, mailTo } = config.app
    const omicUrl = config.apis.keyworker.ui_url
    const prisonStaffHubUrl = config.apis.prisonStaffHub.ui_url
    const categorisationUrl = config.apis.categorisation.ui_url
    const useOfForceUrl = config.apis.useOfForce.ui_url
    const pathfinderUrl = config.apis.pathfinder.ui_url
    const moicUrl = config.apis.moic.ui_url
    const licencesUrl = config.apis.licences.ui_url
    const { displayRetentionLink } = config.apis.dataCompliance

    if (!feedbackUrl && !omicUrl && !prisonStaffHubUrl && !mailTo && !categorisationUrl) {
      res.end()
      return
    }
    res.json({
      feedbackUrl,
      omicUrl,
      prisonStaffHubUrl,
      mailTo,
      categorisationUrl,
      useOfForceUrl,
      pathfinderUrl,
      moicUrl,
      licencesUrl,
      displayRetentionLink,
    })
  })

  router.use('/app', requestForwarding.extractRequestPaginationMiddleware)

  router.use('/app/keydates/:offenderNo', controller.keyDates)
  router.use('/app/bookings/details/:offenderNo', controller.bookingDetails)
  router.use('/app/bookings/quicklook/:offenderNo', controller.quickLook)
  router.use('/app/bookings/scheduled/events/forThisWeek/:offenderNo', controller.eventsForThisWeek)
  router.use('/app/bookings/scheduled/events/forNextWeek/:offenderNo', controller.eventsForNextWeek)
  router.use('/app/bookings/loadAppointmentViewModel/:agencyId', controller.loadAppointmentViewModel)
  router.use('/app/bookings/getExistingEvents/:agencyId/:offenderNo', controller.getExistingEvents)
  router.use('/app/bookings/:offenderNo/alerts', controller.alerts)
  router.get('/app/bookings/:offenderNo/caseNotes', controller.caseNotes)
  router.post('/app/bookings/:offenderNo/caseNotes', controller.addCaseNote)
  router.put('/app/bookings/:offenderNo/caseNotes/:caseNoteId', controller.amendCaseNote)
  router.get('/app/full-size-image/:imageId/data', controller.getFullSizeImage)
  router.get('/app/images/:imageId/data', controller.getImage)
  router.get('/app/users/me/bookingAssignments', controller.myAssignments)
  router.get('/app/users/me/caseNoteTypes', controller.myCaseNoteTypes)
  router.get('/app/users/me', controller.user)
  router.use('/app/reference-domains/caseNoteTypes', controller.caseNoteTypes)

  // Forward requests to the eliteApi get/post functions.
  router.use('/app', requestForwarding.forwardingHandlerFactory(eliteApi))

  return router
}
