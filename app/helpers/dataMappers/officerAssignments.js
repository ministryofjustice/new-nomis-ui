import { Map, List } from 'immutable';

export const Model = Map({
  pagination: Map({
    perPage: 10,
    pageNumber: 0,
  }),
  sortOrder: 'ASC',
  results: List([]),
  meta: Map({
    totalRecords: 0,
  }),
  error: '',
});

export function transform(data) {
  return Model.mergeDeepWith((prev, next, key) => {
    if (!next) {
      return prev;
    }
    return next;
  }, data);
}
