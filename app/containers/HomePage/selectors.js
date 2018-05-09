import { createSelector } from 'reselect';
import {selectLogin, selectUser} from "../Authentication/selectors";
import {selectUserCaseLoads, selectUserRoles} from "../EliteApiLoader/selectors";
import {selectAssignmentsTotal} from "../Assignments/selectors";

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
        roles
      };
    }
    return undefined;
  }
);

const selectOmicUrl = () => {
  return createSelector(
    selectApp(),
    (appState) => {
      return appState.get('omicUrl');
    }
  );
};

export {
  selectLocations, selectUserHomeInfo, selectOmicUrl,
};
