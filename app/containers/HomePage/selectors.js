import { createSelector } from 'reselect';

const selectHome = () => (state) => state.get('home');

const selectLocations = () => createSelector(
  selectHome(),
  (home) => home.get('locations').toJS()
);

export {
  selectLocations,
};
