import { arrayOf, bool, node, number, object, oneOfType, shape, string } from 'prop-types'

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
  canAddBulkAppointments: bool,
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

export const caseNoteType = shape({
  typeDescription: string.isRequired,
  subTypeDescription: string.isRequired,
  amendments: arrayOf(object),
  occurrenceDateTime: string.isRequired,
  text: string.isRequired,
  bookingId: number.isRequired,
  authorName: string.isRequired,
  subType: string.isRequired,
  type: string.isRequired,
  creationDateTime: string.isRequired,
  staffId: number.isRequired,
  source: string.isRequired,
  caseNoteId: number.isRequired,
})

export const typeSelectorType = arrayOf(shape({ label: string.isRequired, value: string.isRequired }).isRequired)
