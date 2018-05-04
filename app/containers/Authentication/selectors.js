
import { createSelector } from 'reselect';

const selectLogin = () => (state) => state.get('authentication');

const selectUser = () => {
  return createSelector(
    selectLogin(),
    (loginState) => {
      return loginState.get('user');
    }
  );
};

const selectUsername = () => createSelector(
  selectLogin(),
  (loginState) => loginState.get('usernameInput')
);

const selectPassword = () => createSelector(
  selectLogin(),
  (loginState) => loginState.get('passwordInput')
);

const selectActiveCaseLoad = () => createSelector(
  selectUser(),
  (user) => user.activeCaseLoadId,
);

export {
  selectLogin,
  selectUser,
  selectUsername,
  selectPassword,
  selectOmicUrl,
  selectActiveCaseLoad,
};
