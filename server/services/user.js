const { logger } = require('./logger')

const userServiceFactory = (elite2Api, oauthApi, config) => {
  async function getActiveCaseloadAndSetIfNotSet(context, details) {
    const caseloads = await elite2Api.getCaseLoads(context)

    const activeCaseLoad = caseloads.find(cl => cl.currentlyActive)

    if (activeCaseLoad) return activeCaseLoad.caseLoadId

    const potentialCaseLoad = caseloads.find(cl => cl.caseLoadId !== '___')
    if (potentialCaseLoad) {
      const firstCaseLoadId = potentialCaseLoad.caseLoadId
      logger.warn({ details }, `No active caseload set: setting to ${firstCaseLoadId}`)
      await elite2Api.put(context, 'api/users/me/activeCaseLoad', { caseLoadId: firstCaseLoadId })
      return firstCaseLoadId
    }
    const msg = 'No active caseload set: none available'
    logger.info({ details }, msg)
    return undefined
  }

  const me = async context => {
    const [detailsData, accessRoles] = await Promise.all([
      oauthApi.getMyInformation(context),
      oauthApi.getUserAccessRoles(context),
    ])

    const activeCaseLoadId = await getActiveCaseloadAndSetIfNotSet(context, detailsData)
    const { staffId } = detailsData

    let staffRoles
    let whereaboutsConfig
    if (activeCaseLoadId) {
      try {
        ;[staffRoles, whereaboutsConfig] = await Promise.all([
          elite2Api.getStaffRoles(context, staffId, activeCaseLoadId),
          elite2Api.getWhereaboutsConfig(context, activeCaseLoadId),
        ])
      } catch (error) {
        logger.error(error)
      }
    }

    const useOfForcePrisons = config.apis.useOfForce.prisons.split(',')
    const sanitisedPrisons = useOfForcePrisons.map(prison => prison.trim().toUpperCase())

    return {
      ...detailsData,
      activeCaseLoadId,
      accessRoles: accessRoles || [],
      staffRoles: staffRoles || [],
      isWhereabouts: (whereaboutsConfig && whereaboutsConfig.enabled) || false,
      isUseOfForce: sanitisedPrisons.includes(activeCaseLoadId),
    }
  }
  return {
    me,
  }
}
module.exports = {
  userServiceFactory,
}
