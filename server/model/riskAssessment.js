
module.exports = (data) => ({
  isActive: () => !!data.classification,
  isCRSA: () => data.cellSharingAlertFlag === true,
  riskLevel: () => data.classification,
})