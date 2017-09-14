import { put } from 'redux-saga/effects';
import axios from 'axios';
import moment from 'moment';
import { DEFAULT_MOMENT_DATE_FORMAT_SPEC } from 'containers/App/constants';


export const login = (username, password, baseUrl) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'post',
  url: '/login',
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

const paginationToQuery = (pagination) => `limit=${pagination.perPage}&offset=${pagination.perPage * pagination.pageNumber}`;
const offsetQuery = ({ offset, limit }) => `limit=${limit}&offset=${offset}`;

export const bookings = (token, searchObj, pagination, baseUrl) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: `/booking?query=${searchQueryToString(searchObj)}&limit=${pagination.perPage}&offset=${pagination.perPage * pagination.pageNumber}`})
    .then((response) => response.data);

export const officerAssignments = (token, _, pagination, baseUrl) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: `/users/me/bookingAssignments?limit=${pagination.perPage}&offset=${pagination.perPage * pagination.pageNumber}`})
    .then((response) => response.data);

export const bookingDetails = (token, baseUrl, id) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: `/booking/${id}`})
    .then((response) => response.data);

export const bookingAliases = (token, baseUrl, id) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: `/booking/${id}/aliases`})
    .then((response) => response.data);

export const bookingAlerts = (token, baseUrl, id, pagination) => {
  const queryParams = `?limit=${pagination.perPage}&offset=${pagination.perPage * pagination.pageNumber}`;
  return axios({
    baseURL: baseUrl.replace('api','app'),
    method: 'get',
    url: `/booking/${id}/alerts${queryParams}`})
    .then((response) => response.data);
};

const casenoteQueryStringGen = (caseNoteOptions) => {
  const { source, typeSubType, dateRange } = caseNoteOptions;
  let { type, subType } = typeSubType;
  const { startDate, endDate } = dateRange;
  const queryArray = [];

  if (type === 'All') { type = null; }

  if (subType === 'All') { subType = null; }

  if (type && Array.isArray(type) !== true) {
    const t = type;
    type = [];
    type.push(t);
  }

  if (subType && Array.isArray(subType) !== true) {
    const st = subType;
    subType = [];
    subType.push(st);
  }

  if (source && source.length > 0) {
    queryArray.push(`source:in:'${source.join('\'|\'')}'`);
  }

  if (type && type.length > 0) {
    queryArray.push(`type:in:'${type.join('\'|\'')}'`);
  }

  if (subType && subType.length > 0) {
    queryArray.push(`subType:in:'${subType.join('\'|\'')}'`);
  }

  const iso8601Format = 'YYYY-MM-DD';
  const dateFilterKeys = {
    startDate: 'occurrenceDateTime:gteq',
    endDate: 'occurrenceDateTime:lteq',
  };
  const dateFilters = [];

  if (startDate) {
    const dateFrom = moment(startDate, DEFAULT_MOMENT_DATE_FORMAT_SPEC).format(iso8601Format);
    dateFilters.push(`${dateFilterKeys.startDate}:'${dateFrom}'`);
  }

  if (endDate) {
    const dateTo = moment(endDate, DEFAULT_MOMENT_DATE_FORMAT_SPEC).format(iso8601Format);
    dateFilters.push(`${dateFilterKeys.endDate}:'${dateTo}'`);
  }

  if (dateFilters.length > 0) { queryArray.push(dateFilters.join(',and:')); }

  return queryArray.length > 0 ? `&query=${queryArray.join(',and:')}` : '';
};

export const bookingCaseNotes = (token, baseUrl, id, pagination, query) => {
  const queryParams = `?limit=${pagination.perPage}&offset=${pagination.perPage * pagination.pageNumber}${casenoteQueryStringGen(query)}`;
  return axios({
    baseURL: baseUrl.replace('api','app'),
    method: 'get',
    url: `/booking/${id}/caseNotes${queryParams}`})
    .then((response) => response.data);
};

export const addCaseNote = (token, baseUrl, bookingId, type, subType, text, occurrenceDateTime) => {
  const data = {
    type, subType, text, occurrenceDateTime,
  };

  return axios({
    baseURL: baseUrl.replace('api','app'),
    method: 'post',
    url: `/booking/${bookingId}/caseNotes`,
    headers: {
      'content-type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'},
    data })
    .then((response) => response.data);
};
export const amendCaseNote = (token, baseUrl, bookingId, caseNoteId, text) => {
  const data = {
    text,
  };

  return axios({
    baseURL: baseUrl.replace('api','app'),
    method: 'put',
    url: `/booking/${bookingId}/caseNotes/${caseNoteId}`,
    headers: {
      'content-type': 'application/json'},
    data })
    .then((response) => response.data);
};
export const users = {
  me: (token, baseUrl) => axios({
    baseURL: baseUrl.replace('api','app'),
    method: 'get',
    url: '/users/me'
  }).then((response) => response.data),
  caseLoads: (token, baseUrl) => axios({
    baseURL: baseUrl.replace('api','app'),
    method: 'get',
    url: '/users/me/caseLoads',
  }).then((response) => response.data),
  switchCaseLoads: (token, baseUrl, caseLoadId) => axios({
    baseURL: baseUrl.replace('api','app'),
    method: 'put',
    url: '/users/me/activeCaseLoad',
    data: { caseLoadId },
  }).then((response) => response.data),
  staff: (token, baseUrl, id) => axios({
    baseURL: baseUrl.replace('api','app'),
    method: 'get',
    url: `/users/staff/${id}`
  }).then((response) => response.data),
};


export const locations = (token, baseUrl, offset = { offset: 0, limit: 10000 }) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: `/locations${offset ? `?${offsetQuery(offset)}` : ''}`})
    .then((response) => {
      const metaData = response.data.pageMetaData;
      const locs = response.data.locations;
      // If there are any more locations get them now...
      const newOffset = metaData.offset + metaData.limit;
      const newLimit = metaData.totalRecords - newOffset;
      if (newLimit > 0) {
        return locations(token, baseUrl, { offset: newOffset, limit: newLimit })
          .then((newLocations) => locs.concat(newLocations)
        );
      }

      return locs;
    });

export const loadCaseNoteSubTypes = (token, baseUrl, caseLoadType, pagination = { perPage: 1000, pageNumber: 0 }) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: `referenceDomains/caseNotes/subTypes/${caseLoadType}${pagination ? `?${paginationToQuery(pagination)}` : ''}`})
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
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: `referenceDomains/caseNotes/types/${caseNoteSource}${pagination ? `?${paginationToQuery(pagination)}` : ''}`})
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


export const loadSomeCaseNoteSources = (token, baseUrl, offset) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: `referenceDomains/caseNoteSources${offset ? `?${offsetQuery(offset)}` : ''}`});

export const loadSomeCaseNoteTypes = (token, baseUrl, offset) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: `referenceDomains/caseNoteTypes${offset ? `?${offsetQuery(offset)}` : ''}`});

export const loadSomeCaseNoteSubTypes = (token, baseUrl, offset, type) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: `referenceDomains/caseNoteTypes/${type}/subTypes${offset ? `?${offsetQuery(offset)}` : ''}`});

export const loadSomeUserCaseNoteTypes = (token, baseUrl, offset) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: `users/me/caseNoteTypes${offset ? `?${offsetQuery(offset)}` : ''}`});

export const loadSomeUserCaseNoteSubTypes = (token, baseUrl, offset, type) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: `users/me/caseNoteTypes/${type}${offset ? `?${offsetQuery(offset)}` : ''}`});

// Function wrapper to grab ALL of a paginated data type.
export const getAll = (func, itemName, args) => {
  const newFunc = (token, baseUrl, offset = { offset: 0, limit: 1000 }) => func(token, baseUrl, offset, args).then((response) => {
    const { pageMetaData } = response.data;
    const items = response.data[itemName];
    const newOffset = pageMetaData.offset + pageMetaData.limit;
    const newLimit = pageMetaData.totalRecords - newOffset;
    if (newLimit > 0) {
      return newFunc(token, baseUrl, { offset: newOffset, limit: newLimit }, args)
        .then((newItems) => items.concat(newItems)
      );
    }
    return items;
  });
  return newFunc;
};

export const loadAllCaseNoteFilterItems = (token, baseUrl) => {
  const sources = getAll(loadSomeCaseNoteSources, 'referenceCodes')(token, baseUrl);
  const types = getAll(loadSomeCaseNoteTypes, 'referenceCodes')(token, baseUrl);
  return Promise.all([sources, types]).then((res) => {
    const allSources = res[0].map((s) => ({ code: s.code, description: s.description }));
    const allTypes = res[1].map((t) => ({ code: t.code, description: t.description }));
    return Promise.all(allTypes.map((t) => getAll(loadSomeCaseNoteSubTypes, 'referenceCodes', t.code)(token, baseUrl).then(
      (reso) => reso.map((sT) => ({ code: sT.code, description: sT.description, parentCode: sT.parentCode }))
    ))).then((subTypes) => ({ sources: allSources, types: allTypes, subTypes }));
  });
};

export const loadAllUserCaseNoteTypes = (token, baseUrl) => {
  const types = getAll(loadSomeUserCaseNoteTypes, 'caseNoteTypes')(token, baseUrl);
  return types.then((res) => {
    const allTypes = res.map((t) => ({ code: t.code, description: t.description }));
    return Promise.all(allTypes.map((t) => getAll(loadSomeUserCaseNoteSubTypes, 'caseNoteSubTypes', t.code)(token, baseUrl).then(
      (reso) => reso.map((sT) => ({ code: sT.code, description: sT.description, parentCode: t.code }))
    ))).then((subTypes) => ({ types: allTypes, subTypes }));
  });
};


export const alertTypes = (token, baseUrl) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: '/referenceDomains/alertTypes'})
    .then((response) => response.data);

export const alertTypeData = (token, baseUrl, type) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: `/referenceDomains/alertTypes/${type}`})
    .then((response) => response.data);

export const alertTypeCodeData = (token, baseUrl, type, code) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: `/referenceDomains/alertTypes/${type}/codes/${code}`})
    .then((response) => response.data);

export const imageMeta = (token, baseUrl, imageId) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: `images/${imageId}` })
    .then((response) => response.data);

export const officerDetails = (token, baseUrl, staffId, username) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: (staffId) ? `users/staff/${staffId}` : `users/${username}`})
    .then((res) => res.data);

export const imageData = (token, baseUrl, imageId) => axios({
  baseURL: baseUrl.replace('api','app'),
  method: 'get',
  url: `photo/${imageId}/data`,
  responseType: 'arraybuffer'})
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


export const loadMyLocations = (token, baseUrl) => axios({
  baseURL: `${baseUrl.replace('api','app')}/v2`,
  method: 'get',
  url: '/users/me/locations'})
  .then((response) => response.data);

const parseLocationPrefix = (prefix) => prefix === 'All' ? '_' : (prefix || '_');

export const searchOffenders = ({ token, baseUrl, query,
                                  sort = { order: 'asc' },
                                  pagination = { offset: 0, limit: 1000 } }) =>
  axios({
    baseURL: `${baseUrl.replace('api','app')}/v2`,
    url: query.keywords ?
       `search-offenders/${parseLocationPrefix(query.locationPrefix)}/${query.keywords}` :
       `search-offenders/${parseLocationPrefix(query.locationPrefix)}`,
    headers: {
      'Page-Offset': pagination.offset,
      'Page-Limit': pagination.limit,
      'Sort-Fields': ['lastName', 'firstName'],
      'Sort-Order': sort.order,
    },
  }).then((response) => ({
    bookings: response.data,
    totalRecords: parseInt(response.headers['total-records']),
  }));
