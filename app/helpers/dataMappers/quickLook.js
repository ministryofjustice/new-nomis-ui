import { Map, List } from 'immutable'

export const Model = Map({
  lastVisit: Map({}),
  nextVisit: Map({}),
  offences: List([]),
  adjudications: Map({
    awards: List([]),
    proven: '',
  }),
  activities: Map({
    morningActivities: List([]),
    afternoonActivities: List([]),
    eveningDuties: List([]),
  }),
  nextOfKin: List([]),
  lastKeyWorkerSessionDate: null,
  balance: Map({
    cash: 0,
    spends: 0,
    savings: 0,
    currency: 'GBP',
  }),
  assignedStaffMembers: Map({
    communityOffenderManager: Map({}),
    offenderSupervisor: Map({}),
    caseAdministrator: Map({}),
    drugWorker: Map({}),
  }),
})

export function transform(data) {
  return Model.mergeDeepWith((prev, next) => {
    if (!next) {
      return prev
    }
    return next
  }, data)
}
