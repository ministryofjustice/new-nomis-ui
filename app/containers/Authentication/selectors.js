
import { createSelector } from 'reselect';

const selectLogin = () => (state) => state.get('authentication');

const selectUser = () => createSelector(
  selectLogin(),
  (loginState) => loginState.get('user')
);

const selectLoggedIn = () => createSelector(
  selectLogin(),
  (loginState) => loginState.get('loggedIn')
);

const selectUsername = () => createSelector(
  selectLogin(),
  (loginState) => loginState.get('usernameInput')
);

const selectPassword = () => createSelector(
  selectLogin(),
  (loginState) => loginState.get('passwordInput')
);

const selectToken = () => createSelector(
  selectLogin(),
  (loginState) => loginState.get('loginData')
);

export {
  selectLogin,
  selectUser,
  selectLoggedIn,
  selectUsername,
  selectPassword,
  selectToken,
};
