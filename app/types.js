import { shape, string, bool, oneOfType, arrayOf, node, number, object } from 'prop-types'

export const childrenType = oneOfType([arrayOf(node), node])

export const routeMatchType = shape({
  isExact: bool.isRequired,
  path: string.isRequired,
  url: string.isRequired,
})

export const caseNoteQueryType = shape({
  pageNumber: number.isRequired,
  perPage: number.isRequired,
})

export const userType = shape({
  accessRoles: arrayOf(object),
  activeCaseLoadId: string,
  canGlobalSearch: bool,
  expiredFlag: bool,
  firstName: string,
  hasAdminRights: bool,
  isKeyWorker: bool,
  isKeyWorkerAdmin: bool,
  isWhereabouts: bool,
  lastName: string,
  lockedFlag: bool,
  staffId: number,
  staffRoles: arrayOf(object),
  username: string,
})

export const metaType = shape({
  touched: bool,
  error: string,
})

export const inputType = shape({
  name: string.isRequired,
  value: string,
})
