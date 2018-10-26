import { createSelector } from 'reselect'

import selectUser from '../Authentication/selectors'
import { selectUserCaseLoads, selectUserRoles } from '../EliteApiLoader/selectors'
import { selectAssignmentsTotal } from '../Assignments/selectors'

export default () =>
  createSelector(
    selectUser(),
    selectUserCaseLoads(),
    selectUserRoles(),
    selectAssignmentsTotal(),
    (userState, caseLoadsState, rolesState, totalAssignmentsState) => {
      if (userState && caseLoadsState) {
        const allCaseLoads = caseLoadsState.toJS()
        const activeCaseLoad = allCaseLoads.filter(x => x.caseLoadId === userState.activeCaseLoadId)[0]
        const roles = rolesState ? rolesState.toJS() : []
        return {
          ...userState,
          activeCaseLoad,
          totalAssignments: totalAssignmentsState,
          caseLoads: allCaseLoads,
          caseLoadOptions: allCaseLoads.filter(x => x.caseLoadId !== userState.activeCaseLoadId),
          roles,
        }
      }
      return undefined
    }
  )
