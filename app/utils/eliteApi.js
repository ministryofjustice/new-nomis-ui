import axios from 'axios';
import moment from 'moment';
import { DEFAULT_MOMENT_DATE_FORMAT_SPEC } from 'containers/App/constants';

export const login = (username, password, baseUrl) => axios({
  baseURL: baseUrl,
  method: 'post',
  url: '/login',
  data: { username, password } })
  .then((response) => response.data);


export const officerAssignments = (token, _, pagination, baseUrl) => axios({
  baseURL: baseUrl,
  method: 'get',
  headers: {
    'Page-Offset': pagination.perPage * pagination.pageNumber,
    'Page-Limit': pagination.perPage,
  },
  url: '/users/me/bookingAssignments' })
    .then((response) => ({
      bookings: response.data,
      totalRecords: parseInt(response.headers['total-records']),
    })
  );

export const bookingDetails = (token, baseUrl, id) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `/bookings/details/${id}` })
    .then((response) => response.data);

export const bookingAliases = (token, baseUrl, id) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `/bookings/${id}/aliases` })
    .then((response) => response.data);

export const bookingAlerts = (token, baseUrl, id, pagination) => axios({
  baseURL: baseUrl,
  method: 'get',
  headers: {
    'Page-Offset': pagination.perPage * pagination.pageNumber,
    'Page-Limit': pagination.perPage,
  },
  url: `/bookings/${id}/alerts` })
    .then((response) => ({
      alerts: response.data,
      totalRecords: parseInt(response.headers['total-records']),
    })
    );

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
  const dateFilters = [];
  if (startDate) {
    const dateFrom = moment(startDate, DEFAULT_MOMENT_DATE_FORMAT_SPEC).format(iso8601Format);
    dateFilters.push(`&from=${dateFrom}`);
  }
  if (endDate) {
    const dateTo = moment(endDate, DEFAULT_MOMENT_DATE_FORMAT_SPEC).format(iso8601Format);
    dateFilters.push(`&to=${dateTo}`);
  }
  const query = queryArray.length > 0 ? `&query=${queryArray.join(',and:')}` : '';
  const dates = dateFilters.join('');
  return query + dates;
};

export const bookingCaseNotes = (token, baseUrl, id, pagination, query) => {
  const queryParams = `?${casenoteQueryStringGen(query)}`;
  return axios({
    baseURL: baseUrl,
    method: 'get',
    headers: {
      'Page-Offset': pagination.perPage * pagination.pageNumber,
      'Page-Limit': pagination.perPage,
    },
    url: `/bookings/${id}/caseNotes${queryParams}` })
    .then((response) => ({
      data: response.data,
      totalRecords: parseInt(response.headers['total-records']),
    }));
};

export const addCaseNote = (token, baseUrl, bookingId, type, subType, text, occurrenceDateTime) => {
  const data = {
    type, subType, text, occurrenceDateTime,
  };

  return axios({
    baseURL: baseUrl,
    method: 'post',
    url: `/bookings/${bookingId}/caseNotes`,
    headers: {
      'content-type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest' },
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
    url: `/bookings/${bookingId}/caseNotes/${caseNoteId}`,
    headers: {
      'content-type': 'application/json' },
    data })
    .then((response) => response.data);
};
export const users = {
  me: (token, baseUrl) => axios({
    baseURL: baseUrl,
    headers: {
      jwt: token,
    },
    method: 'get',
    url: '/users/me',
  }).then((response) => response.data),
  caseLoads: (token, baseUrl) => axios({
    baseURL: baseUrl,
    method: 'get',
    url: '/users/me/caseLoads',
  }).then((response) => response.data),
  switchCaseLoads: (token, baseUrl, caseLoadId) => axios({
    baseURL: baseUrl,
    method: 'put',
    url: '/users/me/activeCaseLoad',
    data: { caseLoadId },
  }).then((response) => response.data),
  staff: (token, baseUrl, id) => axios({
    baseURL: baseUrl,
    method: 'get',
    url: `/users/staff/${id}`,
  }).then((response) => response.data),
};


export const loadSomeCaseNoteSources = (token, baseUrl, offset) => axios({
  baseURL: baseUrl,
  method: 'get',
  headers: {
    'Page-Offset': offset.offset,
    'Page-Limit': offset.limit,
  },
  url: 'reference-domains/caseNoteSources' });

export const loadSomeCaseNoteTypes = (token, baseUrl, offset) => axios({
  baseURL: baseUrl,
  headers: {
    'Page-Offset': offset.offset,
    'Page-Limit': offset.limit,
  },
  method: 'get',
  url: 'reference-domains/caseNoteTypes?includeSubTypes=true' });

export const loadSomeCaseNoteSubTypes = (token, baseUrl, offset, type) => axios({
  baseURL: baseUrl,
  method: 'get',
  headers: {
    'Page-Offset': offset.offset,
    'Page-Limit': offset.limit,
  },
  url: `reference-domains/caseNoteSubTypes/${type}` });

export const loadSomeUserCaseNoteTypes = (token, baseUrl) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: 'users/me/caseNoteTypes?includeSubTypes=true' });

export const getAll = (func, itemName, args) => {
  const newFunc = (token, baseUrl, offset = { offset: 0, limit: 1000 }) => func(token, baseUrl, offset, args).then((response) => {
    const items = response.data;
    const newOffset = response.headers['page-offset'] + response.headers['page-limit'];
    const newLimit = response.headers['total-records'] - newOffset;
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
    const subTypes = res[1].map((t) => (t.subCodes.map((sc) => ({ code: sc.code, description: sc.description, parentCode: t.code }))));
    return { sources: allSources, types: allTypes, subTypes };
  });
};

export const loadAllUserCaseNoteTypes = (token, baseUrl) => {
  const types = getAll(loadSomeUserCaseNoteTypes, 'caseNoteTypes')(token, baseUrl);
  return types.then((res) => CaseNoteTypeMapper(res));
};

export const CaseNoteTypeMapper = (res) => {
  const allTypes = res.map((t) => ({ code: t.code, description: t.description }));
  const subTypes = res.map(type => type.subCodes.map((sc) => ({ code: sc.code, description: sc.description, parentCode: type.code })))

  return { types: allTypes, subTypes: flatten(subTypes) };
};

const flatten = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);
export const imageMeta = (token, baseUrl, imageId) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `images/${imageId}` })
    .then((response) => response.data);

export const officerDetails = (token, baseUrl, staffId, username) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: (staffId) ? `users/staff/${staffId}` : `users/${username}` })
    .then((res) => res.data);

export const imageData = (token, baseUrl, imageId) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `photo/${imageId}/data`,
  responseType: 'arraybuffer' })
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
  baseURL: `${baseUrl}`,
  method: 'get',
  url: '/users/me/locations' })
  .then((response) => response.data);

const parseLocationPrefix = (prefix) => prefix === 'All' ? '_' : (prefix || '_');

export const searchOffenders = ({ baseUrl, query,
                                  sort = { order: 'ASC' },
                                  pagination = { offset: 0, limit: 1000 } }) =>
  axios({
    baseURL: `${baseUrl}`,
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

export const loadKeyDates = (bookingId) => axios({
  method: 'get',
  url: `/app/keydates/${bookingId}`,
}).then(response => response.data);

export const loadQuickLook = (bookingId) => axios({
  method: 'get',
  url: `/app/bookings/quicklook/${bookingId}`,
}).then((response) => response.data);