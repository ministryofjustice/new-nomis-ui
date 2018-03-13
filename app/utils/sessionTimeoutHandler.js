import axios from 'axios';

export default function registerSessionTimeoutHandler(store) {
  axios.interceptors.request.use(config => config, Promise.reject);
  axios.interceptors.response.use(config => config, (error) => {
    const { status } = error.response;

    if (status === 401) {
      alert('Your session has expired, please click OK to be redirected back to the login page');
      window.location = '/logout';
    }
    return Promise.reject(error);
  });
}