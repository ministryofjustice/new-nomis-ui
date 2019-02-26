const { logger } = require('./logger')

const userServiceFactory = (elite2Api, oauthApi) => {
  async function getActiveCaseloadAndSetIfNotSet(context, details) {
    const caseloads = await elite2Api.getCaseLoads(context)

    const activeCaseLoad = caseloads.find(cl => cl.currentlyActive)

    if (activeCaseLoad) return activeCaseLoad.caseLoadId

    if (caseloads.length > 0) {
      const firstCaseLoadId = caseloads[0].caseLoadId
      logger.warn({ details }, `No active caseload set: setting to ${firstCaseLoadId}`)
      await elite2Api.put(context, '/api/users/me/activeCaseLoad', { caseLoadId: firstCaseLoadId })
      return firstCaseLoadId
    }
    const msg = 'No active caseload set: none available'
    logger.error({ details }, msg)
    throw new Error(msg)
  }

  const me = async context => {
    const [detailsData, accessRoles] = await Promise.all([
      oauthApi.getMyInformation(context),
      oauthApi.getUserAccessRoles(context),
    ])

    const activeCaseLoadId = await getActiveCaseloadAndSetIfNotSet(context, detailsData)

    const { staffId } = detailsData
    const agencyId = activeCaseLoadId
    let staffRoles
    let whereaboutsConfig
    try {
      ;[staffRoles, whereaboutsConfig] = await Promise.all([
        elite2Api.getStaffRoles(context, staffId, agencyId),
        elite2Api.getWhereaboutsConfig(context, agencyId),
      ])
    } catch (error) {
      logger.error(error)
    }

    return {
      ...detailsData,
      activeCaseLoadId,
      accessRoles: accessRoles || [],
      staffRoles: staffRoles || [],
      isWhereabouts: whereaboutsConfig && whereaboutsConfig.enabled,
    }
  }

  return {
    me,
  }
}
module.exports = {
  userServiceFactory,
}
