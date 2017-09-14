import axios from 'axios';
import { push } from 'react-router-redux';

export default function registerSessionTimeoutHandler(store) {

  axios.interceptors.response.use(function (config) {
    return config;
  }, function (error) {

    const { status } = error.response;

    if(status === 401){
      store.dispatch(push('/sessionTimeout'));
    }else {
      return Promise.reject(error);
    }
  });
}