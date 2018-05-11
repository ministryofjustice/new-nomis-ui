import axios from 'axios';

export default function registerSessionTimeoutHandler() {
  axios.interceptors.request.use(config => config, Promise.reject);
  axios.interceptors.response.use(config => config, (error) => {
    const { status } = error.response;

    if (status === 401 || status === 403) {
      alert('Your session has expired, please click OK to be redirected back to the login page'); // eslint-disable-line no-alert
      window.location = '/logout';
    }

    if (status === 503) {
      window.location = '/logout';
    }

    return Promise.reject(error);
  });
}