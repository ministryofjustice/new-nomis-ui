import { Map, List } from 'immutable';

export const Model = Map({
  details: {
    locations: List([]),
  },
  query: Map({
    locationPrefix: '',
    keywords: '',
    pagination: Map({
      perPage: 10,
      pageNumber: 0,
    }),
  }),
  error: null,
  sortOrder: 'ASC',
  totalResults: 0,
  results: List([]),
  pagination: Map({
    perPage: 10,
    pageNumber: 0,
  }),
  resultsView: 'List',
  loading: false,
});
