import { createSelector } from 'reselect';

const selectSearch = () => (state) => state.get('search');

const selectSearchResults = () => createSelector(
  selectSearch(),
  (searchState) => searchState.get('results').toJS()
);

export {
  selectSearch,
  selectSearchResults,
};
