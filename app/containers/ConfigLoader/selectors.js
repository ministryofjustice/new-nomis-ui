import { createSelector } from 'reselect';

const selectConfig = () => (state) => state.get('config');

const selectData = () => createSelector(
  selectConfig(),
  (configState) => configState.get('data')
);

const selectApi = () => createSelector(
  selectData(),
  (configState) => "/api/"
);

export {
  selectConfig,
  selectApi,
};
