
const RiskAssessment = require('../risk-assessment');

describe('RiskAssessmentModel',() => {
  it('should be active and be a CRSA with a riskLevel of basic', () => {
    const assessment = new RiskAssessment({
      cellSharingAlertFlag: true,
      classification: 'Basic',
      assessmentCode: 'CATEGORY',
    });

    expect(assessment.isActive()).toBe(true);
    expect(assessment.isCRSA()).toBe(true);
    expect(assessment.isCategory()).toBe(true);
    expect(assessment.riskLevel()).toBe('Basic');
  });
})