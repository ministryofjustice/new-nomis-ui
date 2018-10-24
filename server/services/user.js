const { logger } = require('./logger')

const userServiceFactory = elite2Api => {
  async function setFirstLoginCaseLoad(context, details) {
    const caseLoads = await elite2Api.get(context, '/api/users/me/caseLoads')
    if (caseLoads.length > 0) {
      const firstCaseLoad = caseLoads[0].caseLoadId
      logger.warn({ details }, `No active caseload set: setting to ${firstCaseLoad}`)
      await elite2Api.put(context, '/api/users/me/activeCaseLoad', { caseLoadId: firstCaseLoad })
      details.activeCaseLoadId = firstCaseLoad
    } else {
      const msg = 'No active caseload set: none available'
      logger.error({ details }, msg)
      throw new Error(msg)
    }
  }

  const me = async context => {
    const [details, accessRoles] = await Promise.all([
      elite2Api.getMyInformation(context),
      elite2Api.getUserAccessRoles(context),
    ])

    if (!details.activeCaseLoadId) {
      await setFirstLoginCaseLoad(context, details)
    }

    const { staffId } = details
    const agencyId = details.activeCaseLoadId

    const [staffRoles, whereaboutsConfig] = await Promise.all([
      elite2Api.getStaffRoles(context, staffId, agencyId),
      elite2Api.getWhereaboutsConfig(context, agencyId),
    ])
    return {
      ...details,
      accessRoles: [{ roleCode: 'GLOBAL_SEARCH' }, ...accessRoles] || [],
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
