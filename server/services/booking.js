const moment = require('moment')

const keyDatesMapper = require('../data-mappers/keydates')
const { isoDateFormat } = require('./../constants')
const toAward = require('../data-mappers/to-award')
const { toVisit } = require('../data-mappers/to-visit')
const { toLastVisit } = require('../data-mappers/to-visit')
const { properCaseName } = require('../utils')
const { logger } = require('../services/logger')

const toActivityViewModel = require('../data-mappers/to-activity-viewmodel')

const logErrorAndContinue = fn =>
  new Promise(resolve => {
    fn.then(response => resolve(response)).catch(error => {
      logger.error(error)
      resolve(null)
    })
  })

const bookingServiceFactory = (eliteApi, keyworkerApi, allocationManagerApi, dataComplianceApi, pathfinderApi) => {
  const getKeyDatesVieModel = async (context, offenderNo) => {
    const { bookingId } = await eliteApi.getDetailsLight(context, offenderNo)

    const [sentenceData, categoryAssessment] = await Promise.all(
      [
        eliteApi.getSentenceDetail(context, bookingId),
        eliteApi.getCategoryAssessment(context, bookingId),
      ].map(apiCall => logErrorAndContinue(apiCall))
    )

    const sentence = keyDatesMapper.sentence(sentenceData)
    const other = keyDatesMapper.otherDates(sentenceData)

    return {
      sentence,
      other,
      reCategorisationDate: categoryAssessment && categoryAssessment.nextReviewDate,
    }
  }

  const getKeyworker = async (context, offenderNo) => {
    try {
      const caseloads = await eliteApi.getCaseLoads(context)
      const activeCaseLoadId = caseloads.find(cl => cl.currentlyActive).caseLoadId
      return await keyworkerApi.getKeyworkerByCaseloadAndOffenderNo(context, activeCaseLoadId, offenderNo)
    } catch (error) {
      return {}
    }
  }

  const isOffenderRecordRetained = async (context, offenderNo) => {
    return dataComplianceApi.isOffenderRecordRetained(context, offenderNo)
  }

  const getAddressType = address => {
    if (!address) {
      return 'ABSENT'
    }
    return address.noFixedAddress ? 'NFA' : 'PRESENT'
  }

  const getBookingDetailsViewModel = async (context, offenderNo) => {
    const [details, addresses, keyworker, offenderRecordRetained, pathfinderId] = await Promise.all(
      [
        eliteApi.getDetails(context, offenderNo),
        eliteApi.getAddresses(context, offenderNo),
        getKeyworker(context, offenderNo),
        isOffenderRecordRetained(context, offenderNo),
        pathfinderApi.getPathfinderId(context, offenderNo),
      ].map(apiCall => logErrorAndContinue(apiCall))
    )
    const { bookingId } = details
    const [iepDetails, contacts, identifiers, kwCaseNoteDates] = await Promise.all(
      [
        eliteApi.getIepSummary(context, bookingId),
        eliteApi.getContacts(context, bookingId),
        eliteApi.getIdentifiers(context, bookingId),
        eliteApi.caseNoteUsageList(context, [bookingId]),
      ].map(apiCall => logErrorAndContinue(apiCall))
    )
    const { iepLevel } = iepDetails
    const primaryAddress = addresses && addresses.find(address => address.primary)

    let lastKeyWorkerSessionDate = null
    if (kwCaseNoteDates && kwCaseNoteDates.length > 0) {
      lastKeyWorkerSessionDate = kwCaseNoteDates.reduce((m, v, i) => (v.latestCaseNote > m.latestCaseNote && i ? v : m))
        .latestCaseNote
    }

    return {
      ...details,
      iepLevel,
      keyworker,
      offenderRecordRetained,
      csra: details.csra,
      category: details.category,
      primaryAddress: {
        ...primaryAddress,
        type: getAddressType(primaryAddress),
      },
      lastKeyWorkerSessionDate,
      nextOfKin:
        (contacts &&
          contacts.nextOfKin &&
          contacts.nextOfKin.map(contact => ({
            firstName: contact.firstName,
            lastName: contact.lastName,
            middleName: contact.middleName,
            relationship: contact.relationshipDescription,
            contactTypeDescription: contact.contactTypeDescription,
          }))) ||
        [],
      identifiers,
      pathfinderId,
    }
  }

  const getQuickLookViewModel = async (context, offenderNo) => {
    const threeMonthsInThePast = moment()
      .subtract(3, 'months')
      .format(isoDateFormat)
    const today = moment().format(isoDateFormat)

    const { bookingId } = await eliteApi.getDetailsLight(context, offenderNo)

    logger.info(`Fetching quick look page data for booking ${bookingId}`)

    const apiCalls = [
      eliteApi.getBalances(context, bookingId),
      eliteApi.getIepSummary(context, bookingId),
      eliteApi.getMainOffence(context, bookingId),
      eliteApi.getSentenceDetail(context, bookingId),
      eliteApi.getEventsForToday(context, bookingId),
      eliteApi.getPositiveCaseNotes({ context, bookingId, fromDate: threeMonthsInThePast, toDate: today }),
      eliteApi.getNegativeCaseNotes({ context, bookingId, fromDate: threeMonthsInThePast, toDate: today }),
      eliteApi.getAdjudications(context, bookingId),
      eliteApi.getLastVisit(context, bookingId),
      eliteApi.getNextVisit(context, bookingId),
      eliteApi.getRelationships(context, bookingId),
      allocationManagerApi.getPomByOffenderNo(context, offenderNo),
    ]

    const [
      balance,
      iepSummary,
      offenceData,
      sentenceData,
      activityData,
      positiveCaseNotes,
      negativeCaseNotes,
      adjudications,
      lastVisit,
      nextVisit,
      relationships,
      prisonOffenderManagerData,
    ] = await Promise.all(apiCalls.map(apiCall => logErrorAndContinue(apiCall)))

    const activities = toActivityViewModel(activityData)
    const hasAnyActivity =
      activities.morningActivities.length > 0 ||
      activities.afternoonActivities.length > 0 ||
      activities.eveningDuties.length > 0

    const offenceDetails =
      offenceData &&
      offenceData.map(offenceDetail => ({
        type: offenceDetail.offenceDescription,
      }))

    const getFirstRelationshipByType = (relationshipType, data) => {
      const results = data.filter(rel => rel.relationship === relationshipType)
      return results.length >= 1
        ? {
            firstName: results[0].firstName,
            lastName: results[0].lastName,
          }
        : null
    }

    const getPrisonOffenderManagerName = pom => {
      if (pom.name) {
        logger.info(`Attempting to process prison offender manager name ${pom.name}`)
        if (pom.name.indexOf(',') >= 0) {
          const names = pom.name.split(',')
          return {
            firstName: properCaseName(names[1].trim()),
            lastName: properCaseName(names[0].trim()),
          }
        }
        return {
          firstName: properCaseName(pom.name),
        }
      }

      return null
    }

    function awardFilter(a) {
      const { status } = a
      return status && !status.startsWith('SUSP') && status !== 'QUASHED'
    }

    return {
      lastVisit: lastVisit && toLastVisit(lastVisit),
      nextVisit: nextVisit && toVisit(nextVisit),
      assignedStaffMembers: {
        communityOffenderManager: relationships && getFirstRelationshipByType('COM', relationships),
        offenderSupervisor: relationships && getFirstRelationshipByType('OFS', relationships),
        caseAdministrator: relationships && getFirstRelationshipByType('CA', relationships),
        drugWorker: relationships && getFirstRelationshipByType('DART', relationships),
        prisonOffenderManager:
          prisonOffenderManagerData &&
          prisonOffenderManagerData.primary_pom &&
          getPrisonOffenderManagerName(prisonOffenderManagerData.primary_pom),
        coworkingPrisonOffenderManager:
          prisonOffenderManagerData &&
          prisonOffenderManagerData.secondary_pom &&
          getPrisonOffenderManagerName(prisonOffenderManagerData.secondary_pom),
      },
      balance: balance && {
        spends: balance.spends,
        cash: balance.cash,
        savings: balance.savings,
        currency: balance.currency,
      },
      activities: hasAnyActivity ? activities : null,
      positiveCaseNotes: (positiveCaseNotes && positiveCaseNotes.count) || 0,
      negativeCaseNotes: (negativeCaseNotes && negativeCaseNotes.count) || 0,
      daysSinceReview: iepSummary ? iepSummary.daysSinceReview : null,
      offences: offenceDetails && offenceDetails.length > 0 ? offenceDetails : null,
      releaseDate: sentenceData ? sentenceData.releaseDate : null,
      tariffDate: sentenceData ? sentenceData.tariffDate : null,
      indeterminateReleaseDate: Boolean(sentenceData && sentenceData.tariffDate && !sentenceData.releaseDate),
      adjudications: {
        proven: (adjudications && adjudications.adjudicationCount) || 0,
        awards:
          (adjudications &&
            adjudications.awards &&
            adjudications.awards.filter(awardFilter).map(award => toAward(award))) ||
          [],
      },
    }
  }

  return {
    getQuickLookViewModel,
    getKeyDatesVieModel,
    getBookingDetailsViewModel,
  }
}

module.exports = {
  bookingServiceFactory,
}
