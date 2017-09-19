import axios from 'axios';
import { push } from 'react-router-redux';

import {
  selectToken,
  selectLoggedIn,
} from '../containers/Authentication/selectors';

import {
  LOGOUT_SUCCESS,
  TOKEN_UPDATE,
} from '../containers/Authentication/constants';

export default function registerSessionTimeoutHandler(store) {
  axios.interceptors.request.use((config) => {
    const jwt = selectToken()(store.getState());

    if (jwt) { config.headers.jwt = jwt; }  // eslint-disable-line no-param-reassign

    return config;
  }, (error) =>
    // Do something with request error
     Promise.reject(error));

  axios.interceptors.response.use((config) => {
    const newToken = config.headers.jwt;
    const previousToken = selectToken()(store.getState());

    if (newToken && newToken !== previousToken) {
      store.dispatch({
        type: TOKEN_UPDATE,
        payload: newToken,
      });
    }

    return config;
  }, (error) => {
    const { status } = error.response;
    const loggedIn = selectLoggedIn()(store.getState());

    if (status === 401 && loggedIn) {
      store.dispatch({
        type: LOGOUT_SUCCESS,
      });
      store.dispatch(push('/sessionTimeout'));
      return null;
    }
    return Promise.reject(error);
  });
}