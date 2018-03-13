import axios from 'axios';
import moment from 'moment';
import { DATE_ONLY_FORMAT_SPEC } from 'containers/App/constants';

export const login = (username, password, baseUrl) => axios({
  baseURL: baseUrl,
  method: 'post',
  url: '/login',
  data: { username, password } })
  .then((response) => response.data);

export const officerAssignments = (_, pagination, baseUrl) => axios({
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

export const bookingDetails = (baseUrl, id) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `/bookings/details/${id}` })
    .then((response) => response.data);

export const bookingAliases = (baseUrl, id) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `/bookings/${id}/aliases` })
    .then((response) => response.data);

export const bookingAlerts = (baseUrl, id, pagination) => axios({
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
    const dateFrom = moment(startDate, DATE_ONLY_FORMAT_SPEC).format(iso8601Format);
    dateFilters.push(`&from=${dateFrom}`);
  }
  if (endDate) {
    const dateTo = moment(endDate, DATE_ONLY_FORMAT_SPEC).format(iso8601Format);
    dateFilters.push(`&to=${dateTo}`);
  }
  const query = queryArray.length > 0 ? `&query=${queryArray.join(',and:')}` : '';
  const dates = dateFilters.join('');
  return query + dates;
};

export const bookingCaseNotes = (baseUrl, id, pagination, query) => {
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

export const addCaseNote = (baseUrl, bookingId, type, subType, text, occurrenceDateTime) => {
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

export const amendCaseNote = (baseUrl, bookingId, caseNoteId, amendmentText) => axios({
  baseURL: baseUrl,
  method: 'put',
  url: `/bookings/${bookingId}/caseNotes/${caseNoteId}`,
  headers: {
    'content-type': 'application/json',
  },
  data: {
    text: amendmentText,
  },
}).then((response) => response.data)
  .catch(error => {
    if (error.response.status === 403) {
      error.message = 'You are not authorised to amend this case note.';
    }

    throw error;
  });

export const users = {
  me: (baseUrl) => axios({
    baseURL: baseUrl,
    method: 'get',
    url: '/users/me',
  }).then((response) => response.data),
  caseLoads: (baseUrl) => axios({
    baseURL: baseUrl,
    method: 'get',
    url: '/users/me/caseLoads',
  }).then((response) => response.data),
  switchCaseLoads: (baseUrl, caseLoadId) => axios({
    baseURL: baseUrl,
    method: 'put',
    url: '/users/me/activeCaseLoad',
    data: { caseLoadId },
  }).then((response) => response.data),
  staff: (baseUrl, id) => axios({
    baseURL: baseUrl,
    method: 'get',
    url: `/users/staff/${id}`,
  }).then((response) => response.data),
  caseNoteTypes: (baseUrl) => axios({
    baseURL: baseUrl,
    method: 'get',
    url: '/users/me/caseNoteTypes',
  }).then((response) => CaseNoteTypeMapper(response.data)),
};

export const loadSomeCaseNoteTypes = (baseUrl, offset) => axios({
  baseURL: baseUrl,
  headers: {
    'Page-Offset': offset.offset,
    'Page-Limit': offset.limit,
  },
  method: 'get',
  url: 'reference-domains/caseNoteTypes' });

export const getAll = (func, itemName, args) => {
  const newFunc = (baseUrl, offset = { offset: 0, limit: 1000 }) => func(baseUrl, offset, args).then((response) => {
    const items = response.data;
    const newOffset = response.headers['page-offset'] + response.headers['page-limit'];
    const newLimit = response.headers['total-records'] - newOffset;
    if (newLimit > 0) {
      return newFunc(baseUrl, { offset: newOffset, limit: newLimit }, args)
        .then((newItems) => items.concat(newItems)
        );
    }
    return items;
  });
  return newFunc;
};

export const loadAllCaseNoteFilterItems = (baseUrl) => {
  const types = getAll(loadSomeCaseNoteTypes, 'referenceCodes')(baseUrl);
  return Promise.all([types]).then((res) => {
    const allTypes = res[0].map((t) => ({ code: t.code, description: t.description }));
    const subTypes = res[0].map((t) => (t.subCodes.map((sc) => ({ code: sc.code, description: sc.description, parentCode: t.code }))));
    return { types: allTypes, subTypes };
  });
};

export const CaseNoteTypeMapper = (res) => {
  const allTypes = res.map((t) => ({ code: t.code, description: t.description }));
  const subTypes = res.map(type => type.subCodes.map((sc) => ({ code: sc.code, description: sc.description, parentCode: type.code })))

  return { types: allTypes, subTypes: flatten(subTypes) };
};

const flatten = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

export const imageMeta = (baseUrl, imageId) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: `images/${imageId}` })
    .then((response) => response.data);

export const officerDetails = (baseUrl, staffId, username) => axios({
  baseURL: baseUrl,
  method: 'get',
  url: (staffId) ? `users/staff/${staffId}` : `users/${username}` })
    .then((res) => res.data);

export const imageData = (baseUrl, imageId) => axios({
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

export const loadMyLocations = (baseUrl) => axios({
  baseURL: `${baseUrl}`,
  method: 'get',
  url: '/users/me/locations',
  withCredentials: true,
})
  .then((response) => response.data);

const parseLocationPrefix = (prefix) => prefix === 'All' ? '_' : (prefix || '_');

export const searchOffenders = ({ baseUrl, query,
                                  sort = { order: 'ASC' },
                                  pagination = { offset: 0, limit: 1000 } }) =>
  axios({
    baseURL: `${baseUrl}`,
    url: query.keywords ?
       `locations/description/${query.locationPrefix}/inmates?keywords=${query.keywords}` :
       `locations/description/${query.locationPrefix}/inmates`,
    headers: {
      'Page-Offset': pagination.offset,
      'Page-Limit': pagination.limit,
      'Sort-Fields': ['lastName', 'firstName'],
      'Sort-Order': sort.order,
    },
    withCredentials: true,
  }).then((response) => ({
    bookings: response.data,
    totalRecords: parseInt(response.headers['total-records']),
  }));

export const loadKeyDates = (bookingId) => axios({
  method: 'get',
  url: `/app/keydates/${bookingId}`,
  withCredentials: true,
}).then(response => response.data);

export const loadQuickLook = (bookingId) => axios({
  method: 'get',
  url: `/app/bookings/quicklook/${bookingId}`,
  withCredentials: true,
}).then((response) => response.data);

export const loadScheduledEventsForThisWeek = (bookingId) => axios({
  method: 'get',
  url: `/app/bookings/scheduled/events/forThisWeek/${bookingId}`,
  withCredentials: true,
}).then(response => response.data);

export const loadScheduledEventsForNextWeek = (bookingId) => axios({
  method: 'get',
  url: `/app/bookings/scheduled/events/forNextWeek/${bookingId}`,
  withCredentials: true,
}).then(response => response.data);

export const loadAppointmentViewModel = ({ agencyId }) => axios({
  method: 'get',
  url: `/app/bookings/loadAppointmentViewModel/${agencyId}`,
  withCredentials: true,
}).then(response => response.data);

export const addAppointment = ({ bookingId, startTime, endTime, appointmentType, locationId, comment }) => axios({
  method: 'post',
  url: `/app/bookings/addAppointment/${bookingId}`,
  data: {
    startTime,
    endTime,
    appointmentType,
    locationId,
    comment,
  },
  withCredentials: true,
});