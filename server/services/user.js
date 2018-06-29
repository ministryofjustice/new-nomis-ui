const userServiceFactory = elite2Api => {
  const me = async (context) => {
    const details = await elite2Api.getMyInformation(context);

    const staffId = details.staffId;
    const agencyId = details.activeCaseLoadId;

    const calls = [
      elite2Api.getUserAccessRoles(context),
      elite2Api.getStaffRoles(context, staffId, agencyId),
    ];

    const [
      accessRoles,
      staffRoles,
    ] = await Promise.all(calls);

    return {
      ...details,
      accessRoles: accessRoles || [],
      staffRoles: staffRoles || [],
    }
  };

  return {
    me,
  };
};
module.exports = {
  userServiceFactory,
};