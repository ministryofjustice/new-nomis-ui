import axios from 'axios'
import moment from 'moment'
import qs from 'querystring'
import { DATE_ONLY_FORMAT_SPEC, ISO_8601_DATE_FORMAT } from '../containers/App/constants'

const momentTo8601DateString = m => (m ? m.format(ISO_8601_DATE_FORMAT) : '')
const momentFromDateOnlyFormatString = s => (s ? moment(s, DATE_ONLY_FORMAT_SPEC) : null)
const dateOnlyFormatTo8601 = s => momentTo8601DateString(momentFromDateOnlyFormatString(s))

export const login = (username, password, baseUrl) =>
  axios({
    baseURL: baseUrl,
    method: 'post',
    url: '/login',
    data: { username, password },
  }).then(response => response.data)

export const officerAssignments = baseUrl =>
  axios({
    baseURL: baseUrl,
    method: 'get',
    url: '/users/me/bookingAssignments',
  }).then(response => response.data)

export const bookingDetails = (baseUrl, offenderNo) =>
  axios({
    baseURL: baseUrl,
    method: 'get',
    url: `/bookings/details/${offenderNo}`,
  }).then(response => response.data)

export const bookingAliases = (baseUrl, offenderNo) =>
  axios({
    baseURL: baseUrl,
    method: 'get',
    url: `/bookings/${offenderNo}/aliases`,
  }).then(response => response.data)

/*
 * filter is { alertType: string, fromDate: moment, toDate: moment }
 * All filter property values are optional.
 */
export const bookingAlerts = (baseUrl, offenderNo, pagination, filter) => {
  const { alertType, fromDate, toDate } = filter
  return axios({
    baseURL: baseUrl,
    method: 'get',
    headers: {
      'Page-Offset': pagination.perPage * pagination.pageNumber,
      'Page-Limit': pagination.perPage,
    },
    url: `/bookings/${offenderNo}/alerts`,
    params: {
      from: momentTo8601DateString(fromDate),
      to: momentTo8601DateString(toDate),
      alertType,
    },
  }).then(response => ({
    alerts: response.data,
    totalRecords: parseInt(response.headers['total-records'], 10),
  }))
}

const casenoteQueryStringGen = caseNoteOptions => {
  const { source, startDate, endDate } = caseNoteOptions
  let { type, subType } = caseNoteOptions

  const queryArray = []

  if (type === 'All') {
    type = null
  }

  if (subType === 'All') {
    subType = null
  }

  if (type && Array.isArray(type) !== true) {
    const t = type
    type = []
    type.push(t)
  }

  if (subType && Array.isArray(subType) !== true) {
    const st = subType
    subType = []
    subType.push(st)
  }

  if (source && source.length > 0) {
    queryArray.push(`source:in:'${source.join("'|'")}'`)
  }

  if (type && type.length > 0) {
    queryArray.push(`type:in:'${type.join("'|'")}'`)
  }

  if (subType && subType.length > 0) {
    queryArray.push(`subType:in:'${subType.join("'|'")}'`)
  }

  const dateFilters = []
  if (startDate) {
    const dateFrom = dateOnlyFormatTo8601(startDate)
    // const dateFrom = moment(startDate, DATE_ONLY_FORMAT_SPEC).format(ISO8601_DATE_FORMAT);
    dateFilters.push(`&from=${dateFrom}`)
  }
  if (endDate) {
    const dateTo = dateOnlyFormatTo8601(endDate)
    // const dateTo = moment(endDate, DATE_ONLY_FORMAT_SPEC).format(ISO8601_DATE_FORMAT);
    dateFilters.push(`&to=${dateTo}`)
  }
  const query = queryArray.length > 0 ? `&query=${queryArray.join(',and:')}` : ''
  const dates = dateFilters.join('')
  return query + dates
}

export const bookingCaseNotes = (baseUrl, { offenderNo, query }) => {
  const queryParams = `?${casenoteQueryStringGen(query)}`

  return axios({
    baseURL: baseUrl,
    method: 'get',
    headers: {
      'Page-Offset': query.perPage * query.pageNumber,
      'Page-Limit': query.perPage,
    },
    url: `/bookings/${offenderNo}/caseNotes${queryParams}`,
  }).then(response => ({
    data: response.data,
    totalRecords: parseInt(response.headers['total-records'], 10),
  }))
}

export const addCaseNote = (baseUrl, offenderNo, type, subType, text, occurrenceDateTime) => {
  const data = {
    type,
    subType,
    text,
    occurrenceDateTime,
  }

  return axios({
    baseURL: baseUrl,
    method: 'post',
    url: `/bookings/${offenderNo}/caseNotes`,
    headers: {
      'content-type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    data,
  }).then(response => response.data)
}

export const getCaseNote = (baseUrl, offenderNo, caseNoteId) =>
  axios({
    baseURL: baseUrl,
    method: 'get',
    url: `/bookings/${offenderNo}/caseNotes/${caseNoteId}`,
    headers: {
      'content-type': 'application/json',
    },
  }).then(response => response.data)

export const amendCaseNote = (baseUrl, offenderNo, caseNoteId, amendmentText) =>
  axios({
    baseURL: baseUrl,
    method: 'put',
    url: `/bookings/${offenderNo}/caseNotes/${caseNoteId}`,
    headers: {
      'content-type': 'application/json',
    },
    data: {
      text: amendmentText,
    },
  })
    .then(response => response.data)
    .catch(error => {
      if (error.response.status === 403) {
        error.message = 'You are not authorised to amend this case note.'
      }

      throw error
    })

const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])

export const CaseNoteTypeMapper = res => {
  const allTypes = res.map(t => ({ code: t.code, description: t.description }))
  const subTypes = res.map(type =>
    type.subCodes.map(sc => ({ code: sc.code, description: sc.description, parentCode: type.code }))
  )

  return { types: allTypes, subTypes: flatten(subTypes) }
}

export const users = {
  me: baseUrl =>
    axios({
      baseURL: baseUrl,
      method: 'get',
      url: '/users/me',
    }).then(response => response.data),

  caseLoads: baseUrl =>
    axios({
      baseURL: baseUrl,
      method: 'get',
      url: '/users/me/caseLoads',
    }).then(response => response.data),

  switchCaseLoads: (baseUrl, caseLoadId) =>
    axios({
      baseURL: baseUrl,
      method: 'put',
      url: '/users/me/activeCaseLoad',
      data: { caseLoadId },
    }).then(response => response.data),

  staff: (baseUrl, id) =>
    axios({
      baseURL: baseUrl,
      method: 'get',
      url: `/users/staff/${id}`,
    }).then(response => response.data),

  caseNoteTypes: baseUrl =>
    axios({
      baseURL: baseUrl,
      method: 'get',
      url: '/users/me/caseNoteTypes',
    }).then(response => CaseNoteTypeMapper(response.data)),

  whereaboutsEnabled: (baseUrl, agencyId) =>
    axios({
      baseURL: baseUrl,
      method: 'get',
      url: `/agencies/${agencyId}/locations/whereabouts`,
    }).then(response => CaseNoteTypeMapper(response.data)),
}

export const loadSomeCaseNoteTypes = (baseUrl, offset) =>
  axios({
    baseURL: baseUrl,
    headers: {
      'Page-Offset': offset.offset,
      'Page-Limit': offset.limit,
    },
    method: 'get',
    url: 'reference-domains/caseNoteTypes',
  })

export const loadAllAlertTypes = baseUrl =>
  axios({
    baseURL: baseUrl,
    headers: {
      'Page-Offset': 0,
      'Page-Limit': 1000, // There are never more than 1000 alert types. 10's at most.
    },
    method: 'get',
    url: 'reference-domains/alertTypes',
  }).then(response => response.data)

export const getAll = (func, itemName, args) => {
  const newFunc = (baseUrl, offset = { offset: 0, limit: 1000 }) =>
    func(baseUrl, offset, args).then(response => {
      const items = response.data
      const newOffset = response.headers['page-offset'] + response.headers['page-limit']
      const newLimit = response.headers['total-records'] - newOffset
      if (newLimit > 0) {
        return newFunc(baseUrl, { offset: newOffset, limit: newLimit }, args).then(newItems => items.concat(newItems))
      }
      return items
    })
  return newFunc
}

export const loadAllCaseNoteFilterItems = baseUrl => {
  const types = getAll(loadSomeCaseNoteTypes, 'referenceCodes')(baseUrl)
  return Promise.all([types]).then(res => {
    const allTypes = res[0].map(t => ({ code: t.code, description: t.description }))
    const subTypes = res[0].map(t =>
      t.subCodes.map(sc => ({ code: sc.code, description: sc.description, parentCode: t.code }))
    )
    return { types: allTypes, subTypes }
  })
}

export const officerDetails = (baseUrl, staffId, username) =>
  axios({
    baseURL: baseUrl,
    method: 'get',
    url: staffId ? `users/staff/${staffId}` : `users/${username}`,
  }).then(res => res.data)

export const loadMyLocations = baseUrl =>
  axios({
    baseURL: `${baseUrl}`,
    method: 'get',
    url: '/users/me/locations',
    withCredentials: true,
  }).then(response => response.data)

export const searchOffenders = ({ baseUrl, query, sort = { order: 'ASC' }, pagination = { offset: 0, limit: 1000 } }) =>
  axios({
    baseURL: `${baseUrl}`,
    url: `locations/description/${query.locationPrefix}/inmates`,
    params: {
      keywords: query.keywords,
      alerts: query.alerts,
      returnIep: 'true',
      returnAlerts: 'true',
    },
    paramsSerializer(params) {
      return qs.stringify(
        params.alerts ? params : { keywords: params.keywords, returnIep: 'true', returnAlerts: 'true' }
      )
    },
    headers: {
      'Page-Offset': pagination.offset,
      'Page-Limit': pagination.limit,
      'Sort-Fields': ['lastName', 'firstName'],
      'Sort-Order': sort.order,
    },
    withCredentials: true,
  }).then(response => ({
    bookings: response.data,
    totalRecords: parseInt(response.headers['total-records'], 10),
  }))

export const loadKeyDates = offenderNo =>
  axios({
    method: 'get',
    url: `/app/keydates/${offenderNo}`,
    withCredentials: true,
  }).then(response => response.data)

export const loadQuickLook = offenderNo =>
  axios({
    method: 'get',
    url: `/app/bookings/quicklook/${offenderNo}`,
    withCredentials: true,
  }).then(response => response.data)

export const loadScheduledEventsForThisWeek = offenderNo =>
  axios({
    method: 'get',
    url: `/app/bookings/scheduled/events/forThisWeek/${offenderNo}`,
    withCredentials: true,
  }).then(response => response.data)

export const loadScheduledEventsForNextWeek = offenderNo =>
  axios({
    method: 'get',
    url: `/app/bookings/scheduled/events/forNextWeek/${offenderNo}`,
    withCredentials: true,
  }).then(response => response.data)

export const loadAppointmentViewModel = ({ agencyId }) =>
  axios({
    method: 'get',
    url: `/app/bookings/loadAppointmentViewModel/${agencyId}`,
    withCredentials: true,
  }).then(response => response.data)

export const addAppointment = ({ offenderNo, startTime, endTime, appointmentType, locationId, comment }) =>
  axios({
    method: 'post',
    url: `/app/bookings/addAppointment/${offenderNo}`,
    data: {
      startTime,
      endTime,
      appointmentType,
      locationId,
      comment,
    },
    withCredentials: true,
  })

export const extendSessionRequest = () =>
  axios({
    method: 'GET',
    url: '/heart-beat',
    withCredentials: true,
  })
