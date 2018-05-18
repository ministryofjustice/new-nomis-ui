const elite2Api = require('../api/elite2Api');

const me = async (req, res) => {
  const details = await elite2Api.getMyInformation(req, res);

  req.params.staffId = details.staffId;
  req.params.agencyId = details.activeCaseLoadId;

  const calls = [
    elite2Api.getUserAccessRoles(req, res), 
    elite2Api.getStaffRoles(req, res),
  ];

  const [
    accessRoles,
    staffRoles,
  ] = await Promise.all(calls);

  return {
    ...details,
    accessRoles,
    staffRoles,
  }
}

const service = {
  me,
}

module.exports = service;