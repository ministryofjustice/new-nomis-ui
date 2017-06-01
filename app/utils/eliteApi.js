import axios from 'axios';
//
// const apiBase = 'http://207.230.255.121:8080/api/';
//
// const instance = axios.create({
//   baseURL: apiBase,
// });

export const login = (username, password, baseUrl) => axios({
  baseURL: baseUrl,
  method: 'post',
  url: '/users/login',
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
  data: { username, password } })
  .then((response) => response.data);

const searchQueryToString = (searchObj) => {
  // HACK: searchObj is an immutable map if there's nothing inside it; otherwise a regular js object.
  // could likely be fixed better!
  if (searchObj.size === 0) {
    return '';
  }
  return Object.keys(searchObj).map((key) => {
    const value = searchObj[key];
    switch (key) {
      case 'firstName':
        return `firstName:like:'${value}%'`;
      case 'lastName':
        return `lastName:like:'${value}%'`;
      default:
        return `${key}:eq:${value}`;
    }
  }).join(',and:');
};

export const bookings = (token, searchObj, baseUrl) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `/booking?query=${searchQueryToString(searchObj)}`,
  headers: { Authorization: token } })
    .then((response) => response.data);

export const bookingDetails = (token, id, baseUrl) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `/booking/${id}`,
  headers: { Authorization: token } })
    .then((response) => response.data);

export const users = {
  me: (token, baseUrl) => axios({
    baseURL: baseUrl,
    method: 'get',
    url: '/users/me',
    headers: { Authorization: token },
  }).then((response) => response.data),
  caseLoads: (token, baseUrl) => axios({
    baseURL: baseUrl,
    method: 'get',
    url: '/users/me/caseLoads',
    headers: { Authorization: token },
  }).then((response) => response.data),
  staffId: (token, id, baseUrl) => axios({
    baseURL: baseUrl,
    method: 'get',
    url: `/users/${id}`,
    headers: { Authorization: token },
  }).then((response) => response.data),

};
