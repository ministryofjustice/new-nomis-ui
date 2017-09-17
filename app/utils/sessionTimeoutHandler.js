import axios from 'axios';
import { push } from 'react-router-redux';

import {
  selectToken,
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
    if (newToken) {
      store.dispatch({
        type: TOKEN_UPDATE,
        payload: newToken,
      });
    }

    return config;
  }, (error) => {
    const { status } = error.response;

    if (status === 401) {
      store.dispatch({
        type: LOGOUT_SUCCESS,
      });
      store.dispatch(push('/sessionTimeout'));
      return null;
    }
    return Promise.reject(error);
  });
}