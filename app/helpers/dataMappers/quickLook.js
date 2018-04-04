import { Map, List } from 'immutable';

export const Model = Map({
  lastVisit: Map({}),
  offences: List([]),
  adjudications: Map({
    awards: List([]),
    proven: '',
  }),
  activities: Map({
    morningActivities: List([]),
    afternoonActivities: List([]),
  }),
  nextOfKin: List([]),
  balance: Map({
    cash: 0,
    spends: 0,
    savings: 0,
    currency: 'GBP',
  }),
  assignedStaffMembers: Map({
    communityOffenderManager: Map({}),
  }),
});

export function transform(data) {
  return Model.mergeDeepWith((prev, next) => {
    if (!next) {
      return prev;
    }
    return next;
  }, data);
}
