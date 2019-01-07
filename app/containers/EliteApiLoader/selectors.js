import { List } from 'immutable'
import { createSelector } from 'reselect'
import { queryHash, paginationHash, idsFromPagination } from './helpers'

const selectEliteApi = () => state => state.get('eliteApiLoader')

const selectUser = () =>
  createSelector(
    selectEliteApi(),
    eliteApiState => eliteApiState.get('User')
  )

const selectUsersTypesAndSubTypes = () =>
  createSelector(
    selectEliteApi(),
    selectUser(),
    (api, user) => ({
      types: user.get('CaseNoteTypes'),
      subTypes: user.get('CaseNoteSubTypes'),
    })
  )

const calcBookingResultStatus = (eliteApiState, { query, pagination, sortOrder }) => {
  const searchQueryStatus = eliteApiState.getIn([
    'Bookings',
    'Search',
    queryHash(query),
    'Sorted',
    sortOrder,
    'Paginations',
    paginationHash(pagination),
    'Status',
  ])
  if (!searchQueryStatus) {
    return { Type: 'NOT LOADED' }
  }
  return searchQueryStatus.toJS()
}

const selectBookingResultStatus = ({ query, pagination, sortOrder }) =>
  createSelector(
    selectEliteApi(),
    eliteApiState => calcBookingResultStatus(eliteApiState, { query, pagination, sortOrder })
  )

const calcBookingResults = (eliteApiState, { query, pagination, sortOrder }) => {
  const status = calcBookingResultStatus(eliteApiState, { query, pagination, sortOrder })

  if (status.Type !== 'SUCCESS') {
    return []
  }

  const searchQueryIds = eliteApiState
    .getIn(['Bookings', 'Search', queryHash(query), 'Sorted', sortOrder, 'SortedIds'])
    .toJS()

  // Get the sortedIds for the full page of search results
  const ids = idsFromPagination(pagination)
    .map(sortId => searchQueryIds[sortId])
    .filter(n => n)
  const bookingSummaries = eliteApiState.getIn(['Bookings', 'Summaries']).toJS()
  return ids.map(id => bookingSummaries[id])
}

const calcBookingResultsTotalRecords = (eliteApiState, { query }) =>
  eliteApiState.getIn(['Bookings', 'Search', queryHash(query), 'MetaData', 'TotalRecords'])

const selectBookingResults = ({ query, pagination, sortOrder }) =>
  createSelector(
    selectEliteApi(),
    eliteApi => calcBookingResults(eliteApi, { query, pagination, sortOrder })
  )

const selectImages = () =>
  createSelector(
    selectEliteApi(),
    eliteApi => eliteApi.get('Images')
  )

const selectImageId = () => (_, props) => props.imageId

const selectImage = () =>
  createSelector(
    selectImages(),
    selectImageId(),
    (images, id) => images.get(id)
  )

const selectOfficers = () =>
  createSelector(
    selectEliteApi(),
    eliteApi => eliteApi.get('Officers')
  )

const selectOfficerKey = () => (_, props) => props.officerKey

const selectOfficer = () =>
  createSelector(
    selectOfficers(),
    selectOfficerKey(),
    (officers, id) => {
      officers.get(id)
    }
  )

const selectOfficerStatus = () =>
  createSelector(
    selectOfficer(),
    officer => {
      if (officer) return officer.get('Status').toJS()
      return { Type: 'NOT STARTED' }
    }
  )

const selectBookingDetails = () =>
  createSelector(
    selectEliteApi(),
    eliteApi => eliteApi.getIn(['Bookings', 'Details'])
  )

const selectAlertTypes = () =>
  createSelector(
    selectEliteApi(),
    eliteApi => eliteApi.get('AlertTypes')
  )

const selectAlertTypeId = () => (_, props) => props.alertType

const selectAlertTypeObj = () =>
  createSelector(
    selectAlertTypes(),
    selectAlertTypeId(),
    (alertTypes, alertTypeId) => alertTypes.get(alertTypeId)
  )

const selectAlertType = () =>
  createSelector(
    selectAlertTypeObj(),
    alertTypeObj => {
      if (!alertTypeObj) return undefined
      return alertTypeObj.get('Data')
    }
  )

const selectAlertTypeStatus = () =>
  createSelector(
    selectAlertTypeObj(),
    alertTypeObj => {
      if (!alertTypeObj) return undefined
      return alertTypeObj.getIn(['Status', 'Type'])
    }
  )

const selectAlertCodeId = () => (_, props) => props.alertCode

const selectAlertCodeObj = () =>
  createSelector(
    selectAlertTypeObj(),
    selectAlertCodeId(),
    (alertTypeObj, alertCode) => {
      if (!alertTypeObj) return undefined
      return alertTypeObj.getIn(['Codes', alertCode])
    }
  )

const selectAlertTypeCodeStatus = () =>
  createSelector(
    selectAlertCodeObj(),
    alertCodeObj => {
      if (!alertCodeObj) return undefined
      return alertCodeObj.getIn(['Status', 'Type'])
    }
  )

const selectAlertTypeCode = () =>
  createSelector(
    selectAlertCodeObj(),
    alertCodeObj => {
      if (!alertCodeObj) return undefined
      return alertCodeObj.getIn(['Data'])
    }
  )

const selectCaseNoteTypes = () =>
  createSelector(
    selectEliteApi(),
    eliteApi => eliteApi.getIn(['CaseNoteTypes'])
  )

const selectCaseNoteTypesSelect = () =>
  createSelector(
    selectEliteApi(),
    eliteApi => eliteApi.getIn(['CaseNoteTypesSelect', 'TypeList'])
  )

const selectCaseNoteSourceId = () => (_, props) => props.source

const selectCaseNoteSourceObj = () =>
  createSelector(
    selectCaseNoteTypes(),
    selectCaseNoteSourceId(),
    (caseNoteTypes, source) => caseNoteTypes.get(source)
  )

const selectCaseNoteSourceStatus = () =>
  createSelector(
    selectCaseNoteSourceObj(),
    caseNoteSource => (caseNoteSource ? caseNoteSource.getIn(['Status', 'Type']) : undefined)
  )

const selectCaseNoteSource = () =>
  createSelector(
    selectCaseNoteSourceObj(),
    caseNoteSource => (caseNoteSource ? caseNoteSource.get('Data') : undefined)
  )

const selectCaseNoteTypeAndSubtype = () => (_, props) => ({ type: props.type, subType: props.subType })

const selectCaseNoteTypeDetails = () =>
  createSelector(
    selectCaseNoteSource(),
    selectCaseNoteTypeAndSubtype(),
    (caseNoteSource, { type, subType }) => {
      if (!caseNoteSource || !type || !subType) return undefined
      const typeObj = caseNoteSource.getIn([type, 'Data'])
      const subTypeObj = caseNoteSource.getIn([type, 'SubType', subType, 'Data'])
      return { type: typeObj, subType: subTypeObj }
    }
  )

const selectUserCaseLoads = () =>
  createSelector(
    selectUser(),
    userState => {
      const CaseLoadState = userState.getIn(['CaseLoads', 'Data'])
      return CaseLoadState || List([])
    }
  )

const selectUserRoles = () =>
  createSelector(
    selectUser(),
    userState => userState.getIn(['Roles', 'Data'])
  )

const selectLoadingBookingDetailsStatus = () =>
  createSelector(
    selectEliteApi(),
    state => state.getIn(['Bookings', 'Details', 'LoadingStatus'])
  )

const selectAppointmentTypesAndLocations = () =>
  createSelector(
    selectEliteApi(),
    state => state.get('AppointmentTypesAndLocations') && state.get('AppointmentTypesAndLocations').toJS()
  )

export {
  selectEliteApi,
  selectBookingResultStatus,
  selectBookingResults,
  calcBookingResultStatus,
  calcBookingResults,
  calcBookingResultsTotalRecords,
  selectImage,
  selectOfficer,
  selectOfficerStatus,
  selectBookingDetails,
  selectAlertType,
  selectAlertTypeStatus,
  selectAlertTypeCode,
  selectAlertTypeCodeStatus,
  selectCaseNoteSourceStatus,
  selectCaseNoteTypeDetails,
  selectCaseNoteTypes,
  selectCaseNoteTypesSelect,
  selectUserCaseLoads,
  selectUserRoles,
  selectLoadingBookingDetailsStatus,
  selectUsersTypesAndSubTypes,
  selectAppointmentTypesAndLocations,
}
