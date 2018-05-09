import { createSelector } from 'reselect';
import { selectUser } from '../Authentication/selectors';
import { selectUserRoles } from '../EliteApiLoader/selectors';

const selectHome = () => (state) => state.get('home');
const selectApp = () => (state) => state.get('app');

const selectLocations = () => createSelector(
  selectHome(),
  (home) => home.get('locations').toJS()
);

const selectUserHomeInfo = () => createSelector(
  selectUser(),
  selectUserRoles(),
  (userState, rolesState) => {
    if (userState && rolesState) {
      const roles = rolesState.toJS();
      return { ...userState,
        roles,
      };
    }
    return undefined;
  }
);

const selectOmicUrl = () => createSelector(
    selectApp(),
    (appState) => appState.get('omicUrl')
  );

export {
  selectLocations, selectUserHomeInfo, selectOmicUrl,
};
