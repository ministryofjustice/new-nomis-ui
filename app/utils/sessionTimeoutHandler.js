import axios from 'axios';
import { push } from 'react-router-redux';

import {
  selectToken
} from '../containers/Authentication/selectors';

import {
  LOGOUT_SUCCESS,
  TOKEN_UPDATE
} from '../containers/Authentication/constants';

export default function registerSessionTimeoutHandler(store) {


  axios.interceptors.request.use(function (config) {
    const jwt = selectToken()(store.getState());

    if(jwt)
       config.headers['jwt'] = jwt;

    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  axios.interceptors.response.use(function (config) {

    const newToken = config.headers['jwt'];
    if(newToken){
       store.dispatch({
         type: TOKEN_UPDATE,
         payload: newToken
       });
    }

    return config;
  }, function (error) {

    const { status } = error.response;

    if(status === 401){
      store.dispatch({
        type: LOGOUT_SUCCESS
      });
      store.dispatch(push('/sessionTimeout'));
    }else {
      return Promise.reject(error);
    }
  });
}