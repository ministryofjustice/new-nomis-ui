import { List, Map } from 'immutable';

export const Model = Map({
  results: List([]),
  totalResults: 0,
  pagination: Map({
    perPage: 10,
    pageNumber: 0,
  }),
  selectedViewOption: 'list',
  amendCaseNoteModal: false,
  caseNoteDetailId: 0,
  query: Map({
    dateRange: Map({
      startDate: '',
      endDate: '',
    }),
    source: List([]),
    typeSubType: Map({
      subType: List([]),
      type: List([]),
    }),
  }),

});


export function transform(data) {
  return Model.mergeDeepWith((prev, next, key) => {
    if (!next) {
      return prev;
    }
    return next;
  }, data);
}