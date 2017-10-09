import { put, select, call, takeLatest, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { loadAssignments } from 'containers/Assignments/actions';
import { getToken } from 'containers/Authentication/sagas';
import { selectApi } from 'containers/ConfigLoader/selectors';

import {
  searchOffenders,
  officerAssignments,
  imageMeta,
  imageData,
  officerDetails,
  bookingDetails,
  bookingAliases,
  bookingAlerts,
  bookingCaseNotes,
  users,
  loadAllCaseNoteFilterItems,
  loadAllUserCaseNoteTypes,
} from 'utils/eliteApi';

import {
  selectBookingResultStatus,
  selectBookingResults,
  selectImageStatus,
  selectOfficerStatus,
  selectBookingDetails,
} from './selectors';

import { paginationHash, queryHash } from './helpers';

import {
  BOOKINGS,
  PRELOADDATA,
  IMAGES,
  OFFICERS,
  CASENOTETYPES,
  USER,
  ALLCASENOTESOURCETYPESUBTYPEDATA,
} from './constants';

export function* bookingDetailsWatcher() {
  yield takeEvery(BOOKINGS.DETAILS.BASE, bookingDetailsSaga);
}

export function* bookingDetailsSaga(action) {
  const { bookingId } = action.payload;

  const allDetails = yield select(selectBookingDetails());
  const currentStatus = allDetails.getIn([bookingId, 'Status', 'Type']);

  if (currentStatus === 'SUCCESS' || currentStatus === 'LOADING') {
    return { Type: currentStatus };
  }

  yield put({ type: BOOKINGS.DETAILS.LOADING, payload: { bookingId } });
  const token = yield getToken();
  const apiServer = yield select(selectApi());

  try {
    const data = yield call(bookingDetails, token, apiServer, bookingId);
    const aliases = yield call(bookingAliases, token, apiServer, bookingId);
    yield put({ type: BOOKINGS.DETAILS.SUCCESS, payload: { ...data, aliases } });
    return { Type: 'SUCCESS' };
  } catch (err) {
    yield put({ type: BOOKINGS.DETAILS.ERROR, payload: { bookingId, error: 'Something went wrong.' } });
    return { Type: 'ERROR', Error: err };
  }
}

export function* searchSaga({ query, pagination, sortOrder }) {
  // First Check to see if this has already been called.
  const currentStatus = yield select(selectBookingResultStatus({ query, pagination, sortOrder }));
  if (currentStatus.Type === 'SUCCESS') {
    return { inmatesSummaries: yield select(selectBookingResults({ query, pagination, sortOrder })) };
  }
  yield put({ type: BOOKINGS.SEARCH.LOADING, payload: { query, pagination, sortOrder } });
  const token = yield getToken();
  const apiServer = yield select(selectApi());
  try {
    const isOffAss = query === 'officerAssignments';
    const bookingListFunction = isOffAss ? officerAssignments : searchOffenders;
    const res = yield call(bookingListFunction, token, query, pagination, apiServer);
    yield put({ type: BOOKINGS.SEARCH.SUCCESS, payload: { query, pagination, sortOrder, results: res.bookings, meta: { totalRecords: res.totalRecords } } });
    return { inmatesSummaries: res.inmatesSummaries };
  } catch (err) {
    yield put({ type: BOOKINGS.SEARCH.ERROR, payload: { query, pagination, sortOrder, error: err } });
    return { error: err };
  }
}

export function* bookingAlertsWatch() {
  yield takeEvery(BOOKINGS.ALERTS.BASE, bookingAlertsSaga);
}

export function* bookingAlertsSaga(action) {
  // Check if loaded or currently loading.
  const { bookingId, pagination } = action.payload;

  const allDetails = yield select(selectBookingDetails());
  const currentAlertsStatus = allDetails.getIn([bookingId, 'Alerts', 'Paginations', paginationHash(pagination), 'Status', 'Type']);

  // To enable alert details caching, swap commenting of following two lines (see EM-59)
  // if (currentAlertsStatus === 'SUCCESS' || currentAlertsStatus === 'LOADING') {
  if (currentAlertsStatus === 'LOADING') {
    return { Type: currentAlertsStatus };
  }

  // Run the call
  yield put({ type: BOOKINGS.ALERTS.LOADING, payload: { bookingId, pagination } });
  const token = yield getToken();
  const apiServer = yield select(selectApi());
  try {
    const data = yield call(bookingAlerts, token, apiServer, bookingId, pagination);
    yield put({ type: BOOKINGS.ALERTS.SUCCESS, payload: { bookingId, pagination, results: data.alerts, meta: { totalRecords: data.totalRecords } } });
    return { Type: 'SUCCESS' };
  } catch (err) {
    yield put({ type: BOOKINGS.ALERTS.ERROR, payload: { bookingId, error: err } });
    return { Type: 'ERROR', Error: err };
  }
}

export function* bookingCaseNotesWatch() {
  yield takeEvery(BOOKINGS.CASENOTES.BASE, bookingCaseNotesSaga);
}

export function* bookingCaseNotesSaga(action) {
  // Check if loaded or currently loading.
  const { bookingId, pagination, query } = action.payload;

  const allDetails = yield select(selectBookingDetails());
  const currentCaseNotesStatus = allDetails.getIn([bookingId, 'CaseNotes', 'Query', queryHash(query), 'Paginations', paginationHash(pagination), 'Status', 'Type']);

  // To enable case note caching, swap commenting of following two lines (see EM-59)
  // if (currentCaseNotesStatus === 'SUCCESS' || currentCaseNotesStatus === 'LOADING') {
  if (currentCaseNotesStatus === 'LOADING') {
    return { Type: currentCaseNotesStatus };
  }

  // Run the call
  yield put({ type: BOOKINGS.CASENOTES.LOADING, payload: { bookingId, pagination, query } });
  const token = yield getToken();
  const apiServer = yield select(selectApi());
  try {
    const response = yield call(bookingCaseNotes, token, apiServer, bookingId, pagination, query);
    yield put({ type: BOOKINGS.CASENOTES.SUCCESS, payload: { bookingId, pagination, query, results: response.data, meta: { totalRecords: response.totalRecords } } });

    return { Type: 'SUCCESS' };
  } catch (err) {
    yield put({ type: BOOKINGS.CASENOTES.ERROR, payload: { bookingId, pagination, query, error: err } });
    return { Type: 'ERROR', Error: err };
  }
}

export function* imageLoadWatch() {
  yield takeEvery(IMAGES.BASE, imageLoadSaga);
}

export function* imageLoadSaga(action) {
  const { imageId } = action.payload;

  if (!imageId) {
    // nothing to load here...
    return null;
  }

  // First check to see if this image already been loaded.
  const currentStatus = yield select(selectImageStatus(), { imageId });
  if (currentStatus.Type === 'SUCCESS' || currentStatus.Type === 'LOADING') {
    return null;
  }

  yield put({ type: IMAGES.LOADING, payload: { imageId } });
  const token = yield getToken();
  const apiServer = yield select(selectApi());

  try {
    const metaRes = yield call(imageMeta, token, apiServer, imageId);
    const dataURL = yield call(imageData, token, apiServer, imageId);

    yield put({ type: IMAGES.SUCCESS, payload: { imageId, meta: metaRes, dataURL } });
    return null;
  } catch (err) {
    yield put({ type: IMAGES.ERROR, payload: { imageId, error: err } });
    return null;
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
  const token = yield getToken();
  const apiServer = yield select(selectApi());

  try {
    const res = yield call(officerDetails, token, apiServer, staffId, username);

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


export function* preloadDataWatcher() {
  yield takeLatest(PRELOADDATA.BASE, preloadData);
}

export function* preloadData() {
  const token = yield getToken();
  const apiServer = yield select(selectApi());

  yield call(preloadAllCaseNoteSourcesTypesSubTypes, token, apiServer);
  yield call(preloadCaseNoteTypes, token, apiServer);
}

export function* preloadAllCaseNoteSourcesTypesSubTypes(token, apiServer) {
  const items = yield call(loadAllCaseNoteFilterItems, token, apiServer);
  yield put({ type: ALLCASENOTESOURCETYPESUBTYPEDATA, payload: items });
}

export function* preloadCaseNoteTypes(token, apiServer) {
  yield put({ type: CASENOTETYPES.PRELOAD.LOADING, payload: {} });

  try {
    const res = yield call(loadAllUserCaseNoteTypes, token, apiServer);
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
  const token = yield getToken();
  const apiServer = yield select(selectApi());

  try {
    const caseloads = yield call(users.caseLoads, token, apiServer);
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
  const token = yield getToken();
  const apiServer = yield select(selectApi());
  const { caseLoadId } = action.payload;

  try {
    yield call(users.switchCaseLoads, token, apiServer, caseLoadId);
    yield put({ type: USER.SWITCHCASELOAD.SUCCESS, payload: { caseLoadId } });
    yield put({ type: BOOKINGS.CLEAR });
    yield put(loadAssignments(true));
    const state = yield select();
    const currPath = state.getIn(['route', 'locationBeforeTransitions', 'pathname']);
    if (currPath !== '/' && currPath !== '/assignments') {
      yield put(push('/'));
    }
  } catch (e) {
    yield put({ type: USER.SWITCHCASELOAD.ERROR });
  }
  return null;
}

export default [
  preloadDataWatcher,
  imageLoadWatch,
  officerLoadWatch,
  bookingDetailsWatcher,
  bookingAlertsWatch,
  bookingCaseNotesWatch,
  userCaseLoadsWatcher,
  userSwitchCaseLoadsWatcher,
];
