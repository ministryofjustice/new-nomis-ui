import qs from 'querystring'

export const properCase = word =>
  typeof word === 'string' && word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

export const isBlank = str => !str || /^\s*$/.test(str)

export const properCaseName = name =>
  isBlank(name)
    ? ''
    : name
        .split('-')
        .map(properCase)
        .join('-')

export const toFullName = ({ firstName, lastName, name }) =>
  !isBlank(name)
    ? name
        .split(' ')
        .map(properCaseName)
        .join(', ')
    : (!isBlank(lastName) ? `${properCaseName(lastName)}, ` : '') +
      (!isBlank(firstName) ? properCaseName(firstName) : '')

export const splitCamelCase = string => string && string.length > 1 && string.replace(/([A-Z])/g, ' $1').substring(1)

const validQueryValue = value =>
  (Array.isArray(value) && value.length > 0) || (!Array.isArray(value) && (value || Number.isInteger(value)))

export const cleanQuery = query => {
  const result = {}
  const names = Object.getOwnPropertyNames(query)
  names.forEach(name => {
    if (validQueryValue(query[name])) result[name] = query[name]
  })
  return result
}

export const buildSearchQueryString = query =>
  qs.stringify(
    cleanQuery({
      location: query.location,
      keywords: query.keywords || '',
      alerts: query.alerts,
      perPage: query.perPage || 20,
      pageNumber: query.pageNumber || 0,
      sortFields: query.sortFields || ['lastName', 'firstName'],
      sortOrder: query.sortOrder || 'ASC',
    })
  )

export const buildCaseNotQueryString = query =>
  qs.stringify({
    perPage: query.perPage || 10,
    pageNumber: query.pageNumber || 0,
    type: query.type || '',
    subType: query.subType || '',
    startDate: query.startDate || '',
    endDate: query.endDate || '',
  })

export const buildPaginationQueryString = query =>
  qs.stringify({
    perPage: query.perPage || 10,
    pageNumber: query.pageNumber || 0,
  })

export const buildQueryString = parameters => qs.stringify(parameters)
