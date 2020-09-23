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
  pathfinderApi,
}) => {
  const userService = userServiceFactory(eliteApi, oauthApi, whereaboutsApi, config)
  const bookingService = bookingServiceFactory(
    eliteApi,
    keyworkerApi,
    allocationManagerApi,
    dataComplianceApi,
    pathfinderApi
  )
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
    const { feedbackUrl, mailTo, supportUrl } = config.app
    const omicUrl = config.apis.keyworker.ui_url
    const manageAuthAccountsUrl = config.apis.manageaccounts.ui_url
    const prisonStaffHubUrl = config.apis.prisonStaffHub.ui_url
    const categorisationUrl = config.apis.categorisation.ui_url
    const useOfForceUrl = config.apis.useOfForce.ui_url
    const pathfinderUrl = config.apis.pathfinder.ui_url
    const moicUrl = config.apis.moic.ui_url
    const pecsUrl = config.apis.pecs.ui_url
    const licencesUrl = config.apis.licences.ui_url
    const { displayRetentionLink } = config.apis.dataCompliance

    if (!feedbackUrl && !omicUrl && !manageAuthAccountsUrl && !prisonStaffHubUrl && !mailTo && !categorisationUrl) {
      res.end()
      return
    }
    res.json({
      feedbackUrl,
      omicUrl,
      manageAuthAccountsUrl,
      prisonStaffHubUrl,
      mailTo,
      categorisationUrl,
      useOfForceUrl,
      pathfinderUrl,
      moicUrl,
      pecsUrl,
      licencesUrl,
      displayRetentionLink,
      supportUrl,
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

  router.use('/key-worker-allocations', async (req, res) => {
    const user = await userService.me(res.locals)
    const omicUrl = config.apis.keyworker.ui_url
    res.redirect(301, `${omicUrl}key-worker/${user.userId}`)
  })

  const pristonStaffHubUrl = config.apis.prisonStaffHub.ui_url

  router.use('/offenders/:offenderNo/case-notes', async (req, res, next) => {
    if (req.originalUrl && req.originalUrl.includes('amend-case-note')) return next()

    const { offenderNo } = req.params
    return res.redirect(301, `${pristonStaffHubUrl}prisoner/${offenderNo}/case-notes`)
  })

  router.use('/offenders/:offenderNo/personal', async (req, res) => {
    const { offenderNo } = req.params
    res.redirect(301, `${pristonStaffHubUrl}prisoner/${offenderNo}/personal`)
  })

  router.use('/offenders/:offenderNo/alerts', async (req, res) => {
    const { offenderNo } = req.params
    res.redirect(301, `${pristonStaffHubUrl}prisoner/${offenderNo}/alerts`)
  })

  router.use('/offenders/:offenderNo/key-dates', async (req, res) => {
    const { offenderNo } = req.params
    res.redirect(301, `${pristonStaffHubUrl}prisoner/${offenderNo}/sentence-and-release`)
  })

  router.use('/offenders/:offenderNo/quick-look', async (req, res) => {
    const { offenderNo } = req.params
    res.redirect(301, `${pristonStaffHubUrl}prisoner/${offenderNo}`)
  })

  router.use('/offenders/:offenderNo/add-case-note', async (req, res) => {
    const { offenderNo } = req.params
    res.redirect(301, `${pristonStaffHubUrl}prisoner/${offenderNo}/add-case-note`)
  })

  router.use('/offenders/:offenderNo/schedule', async (req, res) => {
    const { offenderNo } = req.params
    res.redirect(301, `${pristonStaffHubUrl}prisoner/${offenderNo}/schedule`)
  })

  router.use('/offenders/:offenderNo/?$', async (req, res) => {
    const { offenderNo } = req.params
    res.redirect(301, `${pristonStaffHubUrl}prisoner/${offenderNo}`)
  })

  // Forward requests to the eliteApi get/post functions.
  router.use('/app', requestForwarding.forwardingHandlerFactory(eliteApi))

  return router
}
