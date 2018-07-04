
module.exports = (data) => ({
  isActive: () => !!data.classification,
  isCRSA: () => data.cellSharingAlertFlag === true,
  isCategory: () => data.assessmentCode === 'CATEGORY',
  riskLevel: () => data.classification,
})