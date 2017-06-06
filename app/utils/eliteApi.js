import axios from 'axios';

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

export const bookings = (token, searchObj, pagination, baseUrl) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `/booking?query=${searchQueryToString(searchObj)}&limit=${pagination.perPage}&offset=${pagination.perPage * pagination.pageNumber}`,
  headers: { Authorization: token } })
    .then((response) => response.data);

export const bookingDetails = (token, baseUrl, id) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `/booking/${id}`,
  headers: { Authorization: token } })
    .then((response) => response.data);

export const bookingAliases = (token, baseUrl, id) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `/booking/${id}/aliases`,
  headers: { Authorization: token } })
    .then((response) => response.data);

export const bookingAlerts = (token, baseUrl, id) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `/booking/${id}/alerts`,
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

export const locations = (token, baseUrl) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: '/locations?limit=1000',
  headers: { Authorization: token } })
    .then((response) => response.data);

export const alertTypes = (token, baseUrl) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: '/referenceDomains/alertTypes',
  headers: { Authorization: token } })
    .then((response) => response.data);

export const imageMeta = (token, baseUrl, imageId) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `images/${imageId}`,
  headers: { Authorization: token } })
    .then((response) => response.data);

export const imageData = (token, baseUrl, imageId) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `images/${imageId}/data`,
  responseType: 'arraybuffer',
  headers: { Authorization: token } })
    .then((response) => {
      // Convert Response to a dataURL
      const arr = new Uint8Array(response.data);

      // Convert the int array to a binary string
      // We have to use apply() as we are converting an *array*
      // and String.fromCharCode() takes one or more single values, not
      // an array.
      const raw = String.fromCharCode.apply(null, arr);

      // This works!!!
      const b64 = btoa(raw);
      const dataURL = `data:${response.headers['content-type']};base64,${b64}`;
      return dataURL;
    });
