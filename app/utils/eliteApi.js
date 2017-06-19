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
  return Object.keys(searchObj).filter((key) => searchObj[key]).map((key) => {
    const value = searchObj[key];
    switch (key) {
      case 'firstName':
        return `firstName:like:'${value}%'`;
      case 'lastName':
        return `lastName:like:'${value}%'`;
      case 'offenderNo':
        return `offenderNo:like:'%25${value}%'`;
      case 'bookingNo':
        return `bookingNo:like:'%25${value}%'`;
      case 'locations':
        if (value && value.length > 0) {
          return `assignedLivingUnitId:in:${value.join('|')}`;
        }
        return 'strip';
      default:
        return `${key}:eq:${value}`;
    }
  }).filter((x) => x !== 'strip').join(',and:');
};

export const bookings = (token, searchObj, pagination, baseUrl) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `/booking?query=${searchQueryToString(searchObj)}&limit=${pagination.perPage}&offset=${pagination.perPage * pagination.pageNumber}`,
  headers: { Authorization: token } })
    .then((response) => response.data);

export const officerAssignments = (token, _, pagination, baseUrl) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `/users/me/bookingAssignments?limit=${pagination.perPage}&offset=${pagination.perPage * pagination.pageNumber}`,
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

export const bookingAlerts = (token, baseUrl, id, pagination) => {
  const queryParams = `?limit=${pagination.perPage}&offset=${pagination.perPage * pagination.pageNumber}`;
  return axios({
    baseURL: baseUrl,
    method: 'get',
    url: `/booking/${id}/alerts${queryParams}`,
    headers: { Authorization: token } })
    .then((response) => response.data);
};

const casenoteQueryStringGen = (caseNoteOptions) => {
  // HACK: caseNoteOptions is an immutable map if there's nothing inside it; otherwise a regular js object.
  // could likely be fixed better!
  if (!caseNoteOptions || caseNoteOptions.size === 0) {
    return '';
  }
  return `&query=${Object.keys(caseNoteOptions).filter((key) => caseNoteOptions[key]).map((key) => {
    const value = caseNoteOptions[key];
    switch (key) {
      case 'caseNoteTypeFilter':
        return `type:in:'${value}'`;
      case 'caseNoteSubTypeFilter':
        return `subType:in:'${value}'`;
      case 'caseNoteSourceFilter':
        return `source:in:'${value}'`;
      default:
        return `${key}:eq:${value}`;
    }
  }).join(',and:')}`;
};

export const bookingCaseNotes = (token, baseUrl, id, pagination, query) => {
  const queryParams = `?limit=${pagination.perPage}&offset=${pagination.perPage * pagination.pageNumber}${casenoteQueryStringGen(query)}`;
  return axios({
    baseURL: baseUrl,
    method: 'get',
    url: `/booking/${id}/caseNotes${queryParams}`,
    headers: { Authorization: token } })
    .then((response) => response.data);
};

export const addCaseNote = (token, baseUrl, bookingId, type, subType, text) => {
  const data = {
    type, subType, text,
  };

  return axios({
    baseURL: baseUrl,
    method: 'post',
    url: `/booking/${bookingId}/caseNotes`,
    headers: {
      'content-type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Authorization: token },
    data })
    .then((response) => response.data);
};
export const amendCaseNote = (token, baseUrl, bookingId, caseNoteId, text) => {
  const data = {
    text,
  };

  return axios({
    baseURL: baseUrl,
    method: 'put',
    url: `/booking/${bookingId}/caseNotes/${caseNoteId}`,
    headers: {
      'content-type': 'application/json',
      Authorization: token },
    data })
    .then((response) => response.data);
};
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
  switchCaseLoads: (token, baseUrl, caseLoadId) => axios({
    baseURL: baseUrl,
    method: 'put',
    url: '/users/me/activeCaseLoad',
    headers: { Authorization: token },
    data: { caseLoadId },
  }).then((response) => response.data),
  staffId: (token, id, baseUrl) => axios({
    baseURL: baseUrl,
    method: 'get',
    url: `/users/${id}`,
    headers: { Authorization: token },
  }).then((response) => response.data),

};

const paginationToQuery = (pagination) => `limit=${pagination.perPage}&offset=${pagination.perPage * pagination.pageNumber}`;

export const locations = (token, baseUrl, pagination) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `/locations${pagination ? `?${paginationToQuery(pagination)}` : ''}`,
  headers: { Authorization: token } })
    .then((response) => {
      const metaData = response.data.pageMetaData;
      const locs = response.data.locations;
      // If there are any more locations get them now...
      if (metaData.offset + metaData.limit < metaData.totalRecords) {
        return locations(token, baseUrl, { perPage: metaData.limit, pageNumber: (metaData.offset + metaData.limit) / metaData.limit })
          .then((newLocations) => locs.concat(newLocations)
        );
      }

      return locs;
    });

export const loadCaseNoteSubTypes = (token, baseUrl, caseLoadType, pagination = { perPage: 1000, pageNumber: 0 }) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `referenceDomains/caseNotes/subTypes/${caseLoadType}${pagination ? `?${paginationToQuery(pagination)}` : ''}`,
  headers: { Authorization: token } })
    .then((response) => {
      const metaData = response.data.pageMetaData;
      const refCodes = response.data.ReferenceCodes;

      // If there are any extra caseNoteTypes append them to the current call.
      if (metaData.offset + metaData.limit < metaData.totalRecords) {
        return loadCaseNoteSubTypes(token, baseUrl, caseLoadType, { perPage: metaData.limit, pageNumber: (metaData.offset + metaData.limit) / metaData.limit })
          .then((nextRefCodes) => refCodes.concat(nextRefCodes));
      }

      return refCodes;
    });

export const loadCaseNoteTypes = (token, baseUrl, caseNoteSource, pagination = { perPage: 1000, pageNumber: 0 }) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `referenceDomains/caseNotes/types/${caseNoteSource}${pagination ? `?${paginationToQuery(pagination)}` : ''}`,
  headers: { Authorization: token } })
    .then((response) => {
      const metaData = response.data.pageMetaData;
      const refCodes = response.data.ReferenceCodes; // .map((refCode) => loadCaseNoteSubTypes(token, baseUrl, refCode.code).then((subTypes) => Object.assign(refCode, { subTypes })));
      const typeObjs = refCodes.map((refCode) => {
        // Load in ALL subTypes.
        const subTypes = loadCaseNoteSubTypes(token, baseUrl, refCode.code).then((subArray) => {
          const SubObject = subArray.reduce((acc, sub) => Object.assign(acc, { [sub.code]: { Data: sub, Status: { Type: 'SUCCESS' } } }), {});
          return SubObject;
        }).then((subObj) => ({ Data: refCode, SubTypes: subObj }));

        return subTypes;
      });
      return Promise.all([metaData, Promise.all(typeObjs)]);
    })
    .then((response) => {
      const metaData = response[0];
      const refCodes = response[1];

      // If there are any extra caseNoteTypes append them to the current call.
      if (metaData.offset + metaData.limit < metaData.totalRecords) {
        return loadCaseNoteTypes(token, baseUrl, caseNoteSource, { perPage: metaData.limit, pageNumber: (metaData.offset + metaData.limit) / metaData.limit })
          .then((nextRefCodes) => refCodes.concat(nextRefCodes));
      }

      return refCodes;
    });

export const alertTypes = (token, baseUrl) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: '/referenceDomains/alertTypes',
  headers: { Authorization: token } })
    .then((response) => response.data);

export const alertTypeData = (token, baseUrl, type) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `/referenceDomains/alertTypes/${type}`,
  headers: { Authorization: token } })
    .then((response) => response.data);

export const alertTypeCodeData = (token, baseUrl, type, code) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `/referenceDomains/alertTypes/${type}/codes/${code}`,
  headers: { Authorization: token } })
    .then((response) => response.data);

export const imageMeta = (token, baseUrl, imageId) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `images/${imageId}`,
  headers: { Authorization: token } })
    .then((response) => response.data);

export const officerDetails = (token, baseUrl, staffId) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `users/${staffId}`,
  headers: { Authorization: token } })
    .then((res) => res.data);

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
