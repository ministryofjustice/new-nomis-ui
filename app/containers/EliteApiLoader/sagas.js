import { put, select, call, takeLatest, takeEvery } from 'redux-saga/effects'
import { retrieveUserMe } from '../Authentication/actions'
import { selectApi } from '../ConfigLoader/selectors'
import { loadLocations } from '../Bookings/actions'

import { setMenuOpen, showSpinner, hideSpinner } from '../../globalReducers/app'

import {
  officerDetails,
  bookingDetails,
  bookingAliases,
  bookingCaseNotes,
  users,
  loadAllCaseNoteFilterItems,
  loadAllAlertTypes,
  loadAppointmentViewModel,
  getExistingEvents,
} from '../../utils/eliteApi'

import { selectOfficerStatus } from './selectors'

import {
  APPOINTMENT,
  BOOKINGS,
  LOAD_ALERT_TYPES,
  LOAD_CASE_NOTE_TYPES_SUBTYPES,
  LOAD_MY_CASE_NOTE_TYPES_SUBTYPES,
  OFFICERS,
  CASENOTETYPES,
  USER,
  ALLCASENOTETYPESUBTYPEDATA,
  ALL_ALERT_TYPES_DATA,
} from './constants'

import history from '../../history'

export function* loadAppointmentsViewModel(action) {
  try {
    yield put(showSpinner())
    const viewModel = yield call(loadAppointmentViewModel, { agencyId: action.payload })
    yield put({
      type: APPOINTMENT.SET_VIEW_MODEL,
      payload: viewModel,
    })
    yield put({
      type: APPOINTMENT.SET_EXISTING_EVENTS,
      payload: undefined,
    })
    yield put(hideSpinner())
  } catch (error) {
    yield put(hideSpinner())
  }
}

export function* loadAppointmentsViewModelWatcher() {
  yield takeEvery(APPOINTMENT.LOAD_VIEW_MODEL, loadAppointmentsViewModel)
}

export function* loadExistingEvents(action) {
  try {
    const events = yield call(getExistingEvents, action.payload)
    yield put({
      type: APPOINTMENT.SET_EXISTING_EVENTS,
      payload: events,
    })
    return { Type: 'SUCCESS' }
  } catch (error) {
    return { Type: 'ERROR', Error: error }
  }
}

export function* getExistingEventsWatcher() {
  yield takeEvery(APPOINTMENT.LOAD_EXISTING_EVENTS, loadExistingEvents)
}

export function* bookingDetailsSaga(action) {
  const { offenderNo } = action.payload

  const apiServer = yield select(selectApi())

  try {
    const key = ['eliteApiLoader', 'Bookings', 'Details', action.payload.offenderNo, 'Data']
    const notLoaded = Boolean(yield select(state => state.getIn(key))) === false

    if (notLoaded) {
      const data = yield call(bookingDetails, apiServer, offenderNo)
      const { bookingId } = data
      const aliases = yield call(bookingAliases, apiServer, bookingId)

      yield put({ type: BOOKINGS.DETAILS.SUCCESS, payload: { ...data, aliases } })
    }
    return { Type: 'SUCCESS' }
  } catch (err) {
    yield put({
      type: BOOKINGS.DETAILS.ERROR,
      payload: { offenderNo, error: 'Something went wrong, please try again later' },
    })
    return { Type: 'ERROR', Error: err }
  }
}

export function* bookingDetailsWatcher() {
  yield takeEvery(BOOKINGS.DETAILS.BASE, bookingDetailsSaga)
}

export function* bookingCaseNotesSaga(action) {
  const { offenderNo, query } = action.payload

  yield put(showSpinner())

  const apiServer = yield select(selectApi())

  try {
    const response = yield call(bookingCaseNotes, apiServer, { offenderNo, query })
    yield put({
      type: BOOKINGS.CASENOTES.SUCCESS,
      payload: { offenderNo, query, results: response.data, meta: { totalRecords: response.totalRecords } },
    })
    yield put(hideSpinner())
    return { Type: 'SUCCESS' }
  } catch (err) {
    yield put({ type: BOOKINGS.CASENOTES.ERROR, payload: { offenderNo, query, error: err } })
    yield put(hideSpinner())
    return { Type: 'ERROR', Error: err }
  }
}

export function* bookingCaseNotesWatch() {
  yield takeEvery(BOOKINGS.CASENOTES.BASE, bookingCaseNotesSaga)
}

export function* officerLoadSaga(action) {
  const { staffId, username } = action.payload

  if (!staffId && !username) {
    // nothing to load here...
    return null
  }

  // First check to see if this officer already been loaded (either by staffId or username).
  const officerKey = staffId || username
  const currentStatus = yield select(selectOfficerStatus(), { officerKey })

  if (currentStatus.Type === 'SUCCESS' || currentStatus.Type === 'LOADING') {
    return null
  }

  yield put({ type: OFFICERS.LOADING, payload: { officerKey } })

  const apiServer = yield select(selectApi())

  try {
    const res = yield call(officerDetails, apiServer, staffId, username)

    if (!res) {
      yield put({ type: OFFICERS.ERROR, payload: { officerKey, error: 'SEEMED FINE, BUT APPARENTLY NO RESPONSE' } })
    } else {
      yield put({ type: OFFICERS.SUCCESS, payload: { officerKey, data: res } })
    }

    return null
  } catch (err) {
    yield put({ type: OFFICERS.ERROR, payload: { officerKey, error: err } })

    return null
  }
}

export function* officerLoadWatch() {
  yield takeEvery(OFFICERS.BASE, officerLoadSaga)
}

export function* loadAlertTypes() {
  const apiServer = yield select(selectApi())
  const alertTypes = yield call(loadAllAlertTypes, apiServer)
  yield put({ type: ALL_ALERT_TYPES_DATA, payload: alertTypes })
}

export function* loadALertTypesWatcher() {
  yield takeLatest(LOAD_ALERT_TYPES, loadAlertTypes)
}

export function* preloadAllCaseNoteTypesSubTypes(apiServer) {
  const items = yield call(loadAllCaseNoteFilterItems, apiServer)
  yield put({ type: ALLCASENOTETYPESUBTYPEDATA, payload: items })
}

export function* preloadUserCaseNoteTypes(apiServer) {
  yield put({ type: CASENOTETYPES.PRELOAD.LOADING, payload: {} })

  try {
    const res = yield call(users.caseNoteTypes, apiServer)
    yield put({ type: CASENOTETYPES.PRELOAD.SUCCESS, payload: res })
    return null
  } catch (err) {
    yield put({ type: CASENOTETYPES.PRELOAD.ERROR, payload: { error: err } })
    return { error: err }
  }
}

export function* loadCaseNoteTypesSubTypes() {
  const apiServer = yield select(selectApi())

  yield call(preloadAllCaseNoteTypesSubTypes, apiServer)
}

export function* loadMyCaseNoteTypesSubTypes() {
  const apiServer = yield select(selectApi())

  yield call(preloadUserCaseNoteTypes, apiServer)
}

export function* loadCaseNoteTypesSubTypesWatcher() {
  yield takeLatest(LOAD_CASE_NOTE_TYPES_SUBTYPES, loadCaseNoteTypesSubTypes)
}
export function* loadMyCaseNoteTypesSubTypesWatcher() {
  yield takeLatest(LOAD_MY_CASE_NOTE_TYPES_SUBTYPES, loadMyCaseNoteTypesSubTypes)
}

export function* userCaseLoadsSaga() {
  const apiServer = yield select(selectApi())

  try {
    const caseloads = yield call(users.caseLoads, apiServer)
    yield put({ type: USER.CASELOADS.SUCCESS, payload: { caseloads } })
  } catch (e) {
    yield put({ type: USER.CASELOADS.ERROR, payload: { error: e } })
  }
  return null
}

export function* userCaseLoadsWatcher() {
  yield takeLatest(USER.CASELOADS.BASE, userCaseLoadsSaga)
}

export function* userSwitchCaseLoadsSaga(action) {
  const apiServer = yield select(selectApi())
  const { caseLoadId } = action.payload

  try {
    yield put(setMenuOpen(false))
    yield put(showSpinner())
    yield call(users.switchCaseLoads, apiServer, caseLoadId)
    yield put(retrieveUserMe())
    yield put({ type: BOOKINGS.CLEAR })

    yield put(loadLocations())

    yield put(hideSpinner())
    history.push('/')
  } catch (e) {
    yield put({ type: USER.SWITCHCASELOAD.ERROR })
    yield put(hideSpinner())
  }
  return null
}

export function* userSwitchCaseLoadsWatcher() {
  yield takeLatest(USER.SWITCHCASELOAD.BASE, userSwitchCaseLoadsSaga)
}

export default [
  loadCaseNoteTypesSubTypesWatcher,
  loadMyCaseNoteTypesSubTypesWatcher,
  loadALertTypesWatcher,
  officerLoadWatch,
  bookingDetailsWatcher,
  bookingCaseNotesWatch,
  userCaseLoadsWatcher,
  userSwitchCaseLoadsWatcher,
  loadAppointmentsViewModelWatcher,
  getExistingEventsWatcher,
]
