import { createSelector } from 'reselect';

import { selectEliteApi } from 'containers/EliteApiLoader/selectors';

import createFilterOptions from './fastFilterFun';

const selectLocations = () => createSelector(
  selectEliteApi(),
   (eliteState) => eliteState.get('Locations')
  );

const selectLocationSelectListItems = () => createSelector(
  selectLocations(),
  (locationsState) => locationsState.get('SelectList')
  );

const selectLocationSelectOptionsAndFilterFunc = () => createSelector(
  selectLocationSelectListItems(),
  (selectListState) => {
    const list = selectListState;
    const filterOptions = createFilterOptions({ options: list.toJS() });
    return { options: list.toJS(), filterOptions };
  }
  );

export {
  selectLocationSelectOptionsAndFilterFunc,
};
