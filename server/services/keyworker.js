const keyworkerApi = require('../api/keyworker-api');
const elite2Api = require('../api/elite2Api');
const config = require('../config');

const getAssignedOffenders = async (req, res, staffId, agencyId) => {
  if (config.apis.keyworker.url) {
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

const offendersWithConditionalReleaseDate = async (req, res, offenders = []) => {
  const ids = offenders.map(offender => offender.offenderNo);
  const dates = await elite2Api.getOffendersSentenceDates(req, res, ids) || [];

  return offenders.map(offender => {
    const sentence = dates
      .filter(date => date.offenderNo === offender.offenderNo);

    const sentenceDetail = sentence.length && sentence[0] && sentence[0].sentenceDetail;

    const conditionalReleaseDate = (sentenceDetail && sentenceDetail.conditionalReleaseDate) || null;

    return {
      ...offender,
      conditionalReleaseDate,
    }
  });
};

const offendersWithCSRA = async (req, res, offenders = []) => {
  const ids = offenders.map(offender => offender.offenderNo);
  const assessments = await elite2Api.getOffendersAssessments(req, res, 'CSR', ids) || [];

  return offenders.map(offender => {
    const offenderAssessments = assessments
      .filter(assessment => assessment.offenderNo === offender.offenderNo && !!assessment.classification);

    const assessment = offenderAssessments.length && offenderAssessments[0];
    const crsaLevel = (assessment && assessment.classification) || null;

    return {
      ...offender,
      crsaLevel,
    }
  });
};

const offendersLastKWSession = async (req, res, offenders = []) => {
  const ids = offenders.map(offender => offender.offenderNo);
  const caseNotes = await elite2Api.caseNoteUsageList(req, res, ids) || [];

  return offenders.map(offender => {
    const kwCaseNoteDates = caseNotes
      .filter(caseNote => caseNote.offenderNo === offender.offenderNo);

    let lastKeyWorkerSessionDate = null;
    if (kwCaseNoteDates.length > 0) {
      lastKeyWorkerSessionDate = kwCaseNoteDates.reduce((m, v, i) => (v.latestCaseNote > m.latestCaseNote) && i ? v : m).latestCaseNote;
    }
    return {
      ...offender,
      lastKeyWorkerSessionDate,
    }
  });
};

const getIfKeyWorkerIsEnabled = async (req, res) => {
  if (config.apis.keyworker.url) {
    const { staffId, activeCaseLoadId } = await elite2Api.getMyInformation(req, res);
    const keyworker = await keyworkerApi.getKeyworker(req, res, staffId, activeCaseLoadId);

    return {
      staffId,
      activeCaseLoadId,
      capacity: keyworker && keyworker.capacity,
    }
  }
  return {};
};

const myAllocationsViewModel = async (req, res) => {
  const { staffId, activeCaseLoadId, capacity } = await getIfKeyWorkerIsEnabled(req, res);

  const allocations =
    await offendersLastKWSession(req, res,
      await offendersWithCSRA(req, res,
        await offendersWithConditionalReleaseDate(req, res,
          await getAssignedOffenders(req, res, staffId, activeCaseLoadId))));

  return {
    allocations,
    capacity,
  }
};

const service = {
  myAllocationsViewModel,
  getAssignedOffenders,
};

module.exports = service;