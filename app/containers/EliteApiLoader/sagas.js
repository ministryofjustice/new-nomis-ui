import { put, select, call, takeLatest, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { loadAssignments } from 'containers/Assignments/actions';
import { selectApi } from 'containers/ConfigLoader/selectors';

import { setMobileMenuOpen, showSpinner, hideSpinner } from 'globalReducers/app';

import {
  officerDetails,
  bookingDetails,
  bookingAliases,
  bookingCaseNotes,
  users,
  loadAllCaseNoteFilterItems,
  loadAppointmentViewModel,
} from 'utils/eliteApi';

import {
  APPOINTMENT,
} from 'containers/EliteApiLoader/constants';


import {
  selectOfficerStatus,
} from './selectors';

import {
  loadLocations,
} from '../Bookings/actions';

import {
  BOOKINGS,
  LOAD_CASE_NOTE_TYPES_SUBTYPES,
  OFFICERS,
  CASENOTETYPES,
  USER,
  ALLCASENOTETYPESUBTYPEDATA,
} from './constants';

export function* loadAppointmentsViewModalWatcher() {
  yield takeEvery(APPOINTMENT.LOAD_VIEW_MODAL, loadAppointmentsViewModel);
}

export function* loadAppointmentsViewModel(action) {
  try {
    yield put(showSpinner());
    const viewModel = yield call(loadAppointmentViewModel, { agencyId: action.payload });
    yield put({
      type: APPOINTMENT.SET_VIEW_MODEL,
      payload: viewModel,
    });
    yield put(hideSpinner());
  } catch (error) {
    yield put(hideSpinner());
  }
}

export function* bookingDetailsWatcher() {
  yield takeEvery(BOOKINGS.DETAILS.BASE, bookingDetailsSaga);
}

export function* bookingDetailsSaga(action) {
  const { offenderNo } = action.payload;

  const apiServer = yield select(selectApi());

  try {
    const key = ['eliteApiLoader', 'Bookings', 'Details', action.payload.offenderNo, 'Data'];
    const notLoaded = Boolean(yield select(state => state.getIn(key))) === false;

    if (notLoaded) {
      const data = yield call(bookingDetails, apiServer, offenderNo);
      const bookingId = data.bookingId;
      const aliases = yield call(bookingAliases, apiServer, bookingId);

      yield put({ type: BOOKINGS.DETAILS.SUCCESS, payload: { ...data, aliases } });
    }
    return { Type: 'SUCCESS' };
  } catch (err) {
    yield put({ type: BOOKINGS.DETAILS.ERROR, payload: { offenderNo, error: 'Something went wrong, please try again later' } });
    return { Type: 'ERROR', Error: err };
  }
}

export function* bookingCaseNotesWatch() {
  yield takeEvery(BOOKINGS.CASENOTES.BASE, bookingCaseNotesSaga);
}

export function* bookingCaseNotesSaga(action) {
  const { offenderNo, query } = action.payload;

  yield put(showSpinner());

  const apiServer = yield select(selectApi());

  try {
    const response = yield call(bookingCaseNotes, apiServer, { offenderNo, query });
    yield put({ type: BOOKINGS.CASENOTES.SUCCESS, payload: { offenderNo, query, results: response.data, meta: { totalRecords: response.totalRecords } } });
    yield put(hideSpinner());
    return { Type: 'SUCCESS' };
  } catch (err) {
    yield put({ type: BOOKINGS.CASENOTES.ERROR, payload: { offenderNo, query, error: err } });
    yield put(hideSpinner());
    return { Type: 'ERROR', Error: err };
  }
}

export function* officerLoadWatch() {
  yield takeEvery(OFFICERS.BASE, officerLoadSaga);
}

export function* officerLoadSaga(action) {
  const { staffId, username } = action.payload;

  if (!staffId && !username) {
    // nothing to load here...
    return null;
  }

  // First check to see if this officer already been loaded (either by staffId or username).
  const officerKey = (staffId) ? staffId : username;
  const currentStatus = yield select(selectOfficerStatus(), { officerKey });

  if (currentStatus.Type === 'SUCCESS' || currentStatus.Type === 'LOADING') {
    return null;
  }

  yield put({ type: OFFICERS.LOADING, payload: { officerKey } });

  const apiServer = yield select(selectApi());

  try {
    const res = yield call(officerDetails, apiServer, staffId, username);

    if (!res) {
      yield put({ type: OFFICERS.ERROR, payload: { officerKey, error: 'SEEMED FINE, BUT APPARENTLY NO RESPONSE' } });
    } else {
      yield put({ type: OFFICERS.SUCCESS, payload: { officerKey, data: res } });
    }

    return null;
  } catch (err) {
    yield put({ type: OFFICERS.ERROR, payload: { officerKey, error: err } });

    return null;
  }
}


export function* loadCaseNoteTypesSubTypesWatcher() {
  yield takeLatest(LOAD_CASE_NOTE_TYPES_SUBTYPES, loadCaseNoteTypesSubTypes);
}

export function* loadCaseNoteTypesSubTypes() {
  const apiServer = yield select(selectApi());

  yield call(preloadAllCaseNoteTypesSubTypes, apiServer);
  yield call(preloadUserCaseNoteTypes, apiServer);
}

export function* preloadAllCaseNoteTypesSubTypes(apiServer) {
  const items = yield call(loadAllCaseNoteFilterItems, apiServer);
  yield put({ type: ALLCASENOTETYPESUBTYPEDATA, payload: items });
}

export function* preloadUserCaseNoteTypes(apiServer) {
  yield put({ type: CASENOTETYPES.PRELOAD.LOADING, payload: {} });

  try {
    const res = yield call(users.caseNoteTypes, apiServer);
    yield put({ type: CASENOTETYPES.PRELOAD.SUCCESS, payload: res });
    return null;
  } catch (err) {
    yield put({ type: CASENOTETYPES.PRELOAD.ERROR, payload: { error: err } });
    return { error: err };
  }
}

export function* userCaseLoadsWatcher() {
  yield takeLatest(USER.CASELOADS.BASE, userCaseLoadsSaga);
}

export function* userCaseLoadsSaga() {
  const apiServer = yield select(selectApi());

  try {
    const caseloads = yield call(users.caseLoads, apiServer);
    yield put({ type: USER.CASELOADS.SUCCESS, payload: { caseloads } });
  } catch (e) {
    yield put({ type: USER.CASELOADS.ERROR, payload: { error: e } });
  }
  return null;
}

export function* userSwitchCaseLoadsWatcher() {
  yield takeLatest(USER.SWITCHCASELOAD.BASE, userSwitchCaseLoadsSaga);
}

export function* userSwitchCaseLoadsSaga(action) {
  const apiServer = yield select(selectApi());
  const { caseLoadId } = action.payload;

  try {
    yield put(setMobileMenuOpen(false));
    yield put(showSpinner());
    yield call(users.switchCaseLoads, apiServer, caseLoadId);
    yield put({ type: USER.SWITCHCASELOAD.SUCCESS, payload: caseLoadId });

    yield put(loadLocations());
    yield put(loadAssignments(true));

    const state = yield select();
    const currPath = state.getIn(['route', 'locationBeforeTransitions', 'pathname']);

    yield put({ type: BOOKINGS.CLEAR });
    yield put(hideSpinner());

    if (currPath !== '/assignments') {
      yield put(push('/'));
    }    
  } catch (e) {
    yield put({ type: USER.SWITCHCASELOAD.ERROR });
    yield put(hideSpinner());
  }
  return null;
}


export default [
  loadCaseNoteTypesSubTypesWatcher,
  officerLoadWatch,
  bookingDetailsWatcher,
  bookingCaseNotesWatch,
  userCaseLoadsWatcher,
  userSwitchCaseLoadsWatcher,
  loadAppointmentsViewModalWatcher,
];
