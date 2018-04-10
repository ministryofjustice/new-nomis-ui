const keyworkerApi = require('../api/keyworker-api');
const elite2Api = require('../api/elite2Api');
const config = require('../config');


const getAssignedOffenders = async (req, res) => {
  if (config.apis.keyworker.url) {
    const { staffId, activeCaseLoadId: agencyId } = await elite2Api.getMyInformation(req, res);

    const status = await keyworkerApi.getPrisonMigrationStatus(req, res, agencyId);
    if (status.migrated) {
      const offenders = await keyworkerApi.getAssignedOffenders(req, res, staffId, agencyId);

      if (offenders && offenders.length > 0) {
        const ids = offenders.map(o => o.offenderNo);
        return elite2Api.getSummaryForOffenders(req, res, ids);
      }

      return [];
    }
  }

  return elite2Api.getAssignedOffenders(req, res);
};


const service = {
  getAssignedOffenders,
};

module.exports = service;