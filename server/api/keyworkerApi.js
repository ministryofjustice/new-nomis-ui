const contextProperties = require('../contextProperties');

const processResponse = (context) => (response) => {
  contextProperties.setResponsePagination(context, response.headers);
  return response.data;
};

const processError = error => {
  if (!error.response) throw error;
  if (!error.response.status) throw error;
  if (error.response.status !== 404) throw error; // Not Found
  return {}
};


const keyworkerApiFactory = (client) => {
  const get = (context, url) =>
    client
      .get(context, url)
      .then(processResponse(context))
      .catch(processError);

  const getKeyworkerByCaseloadAndOffenderNo = (context, activeCaseLoadId, offenderNo) =>
    get(context, `key-worker/${activeCaseLoadId}/offender/${offenderNo}`);

  const getPrisonMigrationStatus = (context, prisonId) => get(context, `key-worker/prison/${prisonId}`);

  const getAssignedOffenders = (context, staffId, prisonId) => get(context, `key-worker/${staffId}/prison/${prisonId}/offenders`);

  const getKeyworkerByStaffIdAndPrisonId = (context, staffId, prisonId) => get(context, `key-worker/${staffId}/prison/${prisonId}`);

  return {
    getKeyworkerByCaseloadAndOffenderNo,
    getPrisonMigrationStatus,
    getAssignedOffenders,
    getKeyworkerByStaffIdAndPrisonId,
  }
};

module.exports = { keyworkerApiFactory };