const { setPageLimit } = require('../contextProperties')

const keyworkerServiceFactory = (eliteApi, oauthApi, keyworkerApi) => {
  const getAssignedOffenders = async (context, staffId, agencyId) => {
    const status = await keyworkerApi.getPrisonMigrationStatus(context, agencyId)

    if (status.migrated) {
      const offenders = await keyworkerApi.getAssignedOffenders(context, staffId, agencyId)

      if (offenders && offenders.length > 0) {
        const offenderNumbers = offenders.map(o => o.offenderNo)
        return eliteApi.getSummaryForOffenders(context, offenderNumbers)
      }
      return []
    }

    return eliteApi.getAssignedOffenders(context)
  }

  const offendersWithConditionalReleaseDate = async (context, offenders = []) => {
    const offenderNumbers = offenders.map(offender => offender.offenderNo)
    const dates = (await eliteApi.getOffendersSentenceDates(context, offenderNumbers)) || []

    return offenders.map(offender => {
      const sentence = dates.filter(date => date.offenderNo === offender.offenderNo)

      const sentenceDetail = sentence.length && sentence[0] && sentence[0].sentenceDetail

      const conditionalReleaseDate = (sentenceDetail && sentenceDetail.conditionalReleaseDate) || null

      return {
        ...offender,
        conditionalReleaseDate,
      }
    })
  }

  const offendersLastKWSession = async (context, offenders = []) => {
    if (offenders.length === 0) {
      return []
    }
    const bookingIds = offenders.map(offender => offender.bookingId)
    const caseNotes = (await eliteApi.caseNoteUsageList(context, bookingIds)) || []

    return offenders.map(offender => {
      const kwCaseNoteDates = caseNotes.filter(caseNote => caseNote.bookingId === offender.bookingId)

      let lastKeyWorkerSessionDate = null
      if (kwCaseNoteDates.length > 0) {
        lastKeyWorkerSessionDate = kwCaseNoteDates.reduce((m, v, i) =>
          v.latestCaseNote > m.latestCaseNote && i ? v : m
        ).latestCaseNote
      }
      return {
        ...offender,
        lastKeyWorkerSessionDate,
      }
    })
  }

  const getIfKeyWorkerIsEnabled = async context => {
    const [{ staffId }, caseloads] = await Promise.all([
      oauthApi.getMyInformation(context),
      eliteApi.getCaseLoads(context),
    ])
    const activeCaseLoadId = caseloads.find(cl => cl.currentlyActive).caseLoadId
    const keyworker = await keyworkerApi.getKeyworkerByStaffIdAndPrisonId(context, staffId, activeCaseLoadId)

    return {
      staffId,
      activeCaseLoadId,
      capacity: keyworker && keyworker.capacity,
    }
  }

  const myAllocationsViewModel = async context => {
    const { staffId, activeCaseLoadId, capacity } = await getIfKeyWorkerIsEnabled(context)

    setPageLimit(context, 200)

    const allocations = await offendersLastKWSession(
      context,
      // CSRA NOT NOW displayed: await offendersWithCSRA(context,
      await offendersWithConditionalReleaseDate(context, await getAssignedOffenders(context, staffId, activeCaseLoadId))
    )

    return {
      allocations,
      capacity,
    }
  }

  return {
    myAllocationsViewModel,
    getAssignedOffenders,
  }
}

module.exports = {
  keyworkerServiceFactory,
}
