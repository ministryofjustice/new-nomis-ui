const moment = require('moment')

const keyDatesMapper = require('../data-mappers/keydates')
const { isoDateFormat } = require('./../constants')
const toAward = require('../data-mappers/to-award')
const { toVisit } = require('../data-mappers/to-visit')
const { toLastVisit } = require('../data-mappers/to-visit')
const toActivityViewModel = require('../data-mappers/to-activity-viewmodel')

const bookingServiceFactory = (eliteApi, keyworkerApi) => {
  const getKeyDatesVieModel = async (context, offenderNo) => {
    const { bookingId } = await eliteApi.getDetailsLight(context, offenderNo)

    const [sentenceData, iepSummary, categoryAssessment] = await Promise.all([
      eliteApi.getSentenceData(context, bookingId),
      eliteApi.getIepSummary(context, bookingId),
      eliteApi.getCategoryAssessment(context, bookingId),
    ])

    const sentence = keyDatesMapper.sentence(sentenceData)
    const other = keyDatesMapper.otherDates(sentenceData)

    return {
      iepLevel: iepSummary.iepLevel,
      daysSinceReview: iepSummary.daysSinceReview,
      sentence,
      other,
      reCategorisationDate: categoryAssessment && categoryAssessment.nextReviewDate,
    }
  }

  const getKeyworker = async (context, offenderNo) => {
    try {
      const me = await eliteApi.getMyInformation(context)
      return await keyworkerApi.getKeyworkerByCaseloadAndOffenderNo(context, me.activeCaseLoadId, offenderNo)
    } catch (error) {
      return {}
    }
  }

  const getBookingDetailsViewModel = async (context, offenderNo) => {
    const details = await eliteApi.getDetails(context, offenderNo)
    const { bookingId } = details

    const { iepLevel } = await eliteApi.getIepSummary(context, bookingId)

    const keyworker = await getKeyworker(context, offenderNo)

    return {
      ...details,
      iepLevel,
      keyworker,
      csra: details.csra,
      category: details.category,
    }
  }

  const getQuickLookViewModel = async (context, offenderNo) => {
    const threeMonthsInThePast = moment()
      .subtract(3, 'months')
      .format(isoDateFormat)
    const today = moment().format(isoDateFormat)

    const { bookingId } = await eliteApi.getDetailsLight(context, offenderNo)

    const apiCalls = [
      eliteApi.getBalances(context, bookingId),
      eliteApi.getMainOffence(context, bookingId),
      eliteApi.getSentenceData(context, bookingId),
      eliteApi.getEventsForToday(context, bookingId),
      eliteApi.getPositiveCaseNotes({ context, bookingId, fromDate: threeMonthsInThePast, toDate: today }),
      eliteApi.getNegativeCaseNotes({ context, bookingId, fromDate: threeMonthsInThePast, toDate: today }),
      eliteApi.getContacts(context, bookingId),
      eliteApi.getAdjudications(context, bookingId),
      eliteApi.getLastVisit(context, bookingId),
      eliteApi.getNextVisit(context, bookingId),
      eliteApi.getRelationships(context, bookingId),
      eliteApi.caseNoteUsageList(context, [offenderNo]),
    ]

    const [
      balance,
      offenceData,
      sentenceData,
      activityData,
      positiveCaseNotes,
      negativeCaseNotes,
      contacts,
      adjudications,
      lastVisit,
      nextVisit,
      relationships,
      kwCaseNoteDates,
    ] = await Promise.all(apiCalls)

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

    let lastKWSessionDate = null
    if (kwCaseNoteDates.length > 0) {
      lastKWSessionDate = kwCaseNoteDates.reduce((m, v, i) => (v.latestCaseNote > m.latestCaseNote && i ? v : m))
        .latestCaseNote
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
      offences: offenceDetails && offenceDetails.length > 0 ? offenceDetails : null,
      releaseDate: sentenceData ? sentenceData.releaseDate : null,
      tariffDate: sentenceData ? sentenceData.tariffDate : null,
      lastKeyWorkerSessionDate: lastKWSessionDate,
      indeterminateReleaseDate: Boolean(sentenceData && sentenceData.tariffDate && !sentenceData.releaseDate),
      adjudications: {
        proven: (adjudications && adjudications.adjudicationCount) || 0,
        awards:
          (adjudications &&
            adjudications.awards &&
            adjudications.awards.filter(awardFilter).map(award => toAward(award))) ||
          [],
      },
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
