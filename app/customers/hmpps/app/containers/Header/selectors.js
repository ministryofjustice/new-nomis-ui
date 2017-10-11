import { createSelector } from 'reselect';

import { selectUser } from 'containers/Authentication/selectors';
import { selectUserCaseLoads } from 'containers/EliteApiLoader/selectors';
import { selectAssignmentsTotal } from 'containers/Assignments/selectors';

const selectUserHeaderInfo = () => createSelector(
  selectUser(),
  selectUserCaseLoads(),
  selectAssignmentsTotal(),
  (userState, caseLoadsState, totalAssignmentsState) => {
    if (userState && caseLoadsState) {
      const allCaseLoads = caseLoadsState.toJS();
      const activeCaseLoad = allCaseLoads.filter((x) => x.caseLoadId === userState.activeCaseLoadId)[0];

      return { ...userState, activeCaseLoad, totalAssignments: totalAssignmentsState, caseLoads: allCaseLoads, caseLoadOptions: allCaseLoads.filter((x) => x.caseLoadId !== userState.activeCaseLoadId) };
    }
    return undefined;
  }
);

export {
  selectUserHeaderInfo,
};
