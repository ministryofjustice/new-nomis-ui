// import { createSelector } from 'reselect';

const selectHeader = () => (state) => state.get('header');
//
// const selectUser = () => createSelector(
//   selectLogin(),
//   (loginState) => loginState.get('user')
// );
//
// const selectLoggedIn = () => createSelector(
//   selectLogin(),
//   (loginState) => loginState.get('loggedIn')
// );
//
// const selectUsername = () => createSelector(
//   selectLogin(),
//   (loginState) => loginState.get('usernameInput')
// );
//
// const selectPassword = () => createSelector(
//   selectLogin(),
//   (loginState) => loginState.get('passwordInput')
// );

export {
  selectHeader,
  // selectUser,
  // selectLoggedIn,
  // selectUsername,
  // selectPassword,
};
