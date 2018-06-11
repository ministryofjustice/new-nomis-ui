
import { createSelector } from 'reselect';

const selectLogin = () => (state) => state.get('authentication');

const selectUser = () => createSelector(
    selectLogin(),
    (loginState) => loginState.get('user')
  );

export {
  selectUser,
};
