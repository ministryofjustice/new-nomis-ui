import { put, select, call, takeLatest, takeEvery } from 'redux-saga/effects';
import {
  bookings,
  locations,
  alertTypeData,
  alertTypeCodeData,
  imageMeta,
  imageData,
  bookingDetails,
  bookingAliases,
  bookingAlerts,
  bookingCaseNotes,
  loadCaseNoteTypes,
} from 'utils/eliteApi';
import { selectToken } from 'containers/Authentication/selectors';
import { selectApi } from 'containers/ConfigLoader/selectors';
import {
  selectBookingResultStatus,
  selectBookingResults,
  selectImageStatus,
  selectBookingDetails,
  selectAlertTypeStatus,
  selectAlertTypeCodeStatus,
  selectCaseNoteSourceStatus,
} from './selectors';

import { paginationHash, queryHash } from './helpers';

import {
  BOOKINGS,
  LOCATIONS,
  PRELOADDATA,
  ALERTTYPES,
  IMAGES,
  CASENOTETYPES,
} from './constants';

import {
  loadAlertTypeDetails,
} from './actions';

export function* alertTypeLoadWatcher() {
  yield takeEvery(ALERTTYPES.BASE, alertTypeLoadSaga);
}

export function* alertTypeLoadSaga(action) {
  const { alertType, alertCode } = action.payload;

  if (!alertType && !alertCode) {
    // nothing to load here...
    return null;
  }

  // First check to see if this alertType already been loaded.

  const token = yield select(selectToken());
  const apiServer = yield select(selectApi());

  if (!token || !apiServer) {
    return 'fail';
  }

  const currentTypeStatus = yield select(selectAlertTypeStatus(), { alertType });

  if (currentTypeStatus !== 'SUCCESS' && currentTypeStatus !== 'LOADING') {
    yield put({ type: ALERTTYPES.TYPE.LOADING, payload: { alertType } });
    try {
      const data = yield call(alertTypeData, token.token, apiServer, alertType);
      yield put({ type: ALERTTYPES.TYPE.SUCCESS, payload: { alertType, data } });
    } catch (err) {
      yield put({ type: ALERTTYPES.TYPE.ERROR, payload: { code: alertType, error: err } });
    }
  }

  const currentAlertTypeCodeStatus = yield select(selectAlertTypeCodeStatus(), { alertType, alertCode });

  if (currentAlertTypeCodeStatus !== 'SUCCESS' && currentAlertTypeCodeStatus !== 'LOADING') {
    yield put({ type: ALERTTYPES.CODE.LOADING, payload: { alertType, alertCode } });
    try {
      const data = yield call(alertTypeCodeData, token.token, apiServer, alertType, alertCode);
      yield put({ type: ALERTTYPES.CODE.SUCCESS, payload: { alertType, alertCode, data } });
    } catch (err) {
      yield put({ type: ALERTTYPES.CODE.ERROR, payload: { code: alertType, error: err } });
    }
  }

  return null;
}

export function* bookingDetailsWatcher() {
  yield takeEvery(BOOKINGS.DETAILS.BASE, bookingDetailsSaga);
}

export function* bookingDetailsSaga(action) {
  const { bookingId } = action.payload;

  const allDetails = yield select(selectBookingDetails());
  const currentStatus = allDetails.getIn([bookingId, 'Status', 'Type']);

  // If already loaded/loading get outta here.
  if (currentStatus === 'SUCCESS' || currentStatus === 'LOADING') {
    return { Type: currentStatus };
  }

  yield put({ type: BOOKINGS.DETAILS.LOADING, payload: { bookingId } });
  const token = yield select(selectToken());
  const apiServer = yield select(selectApi());

  try {
    const data = yield call(bookingDetails, token.token, apiServer, bookingId);
    const aliases = yield call(bookingAliases, token.token, apiServer, bookingId);
    yield put({ type: BOOKINGS.DETAILS.SUCCESS, payload: { ...data, aliases } });
    return { Type: 'SUCCESS' };
  } catch (err) {
    yield put({ type: BOOKINGS.DETAILS.ERROR, payload: { bookingId, error: err } });
    return { Type: 'ERROR', Error: err };
  }
}

export function* searchSaga({ query, pagination, sortOrder }) {
  // First Check to see if this has already been called.
  const currentStatus = yield select(selectBookingResultStatus({ query, pagination, sortOrder }));
  if (currentStatus.Type === 'SUCCESS') {
    return { inmatesSummaries: yield selectBookingResults({ query, pagination, sortOrder }) };
  }
  yield put({ type: BOOKINGS.SEARCH.LOADING, payload: { query, pagination, sortOrder } });
  const token = yield select(selectToken());
  const apiServer = yield select(selectApi());
  try {
    const res = yield call(bookings, token.token, query, pagination, apiServer);
    yield put({ type: BOOKINGS.SEARCH.SUCCESS, payload: { query, pagination, sortOrder, results: res.inmatesSummaries, meta: res.pageMetaData } });
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

  if (currentAlertsStatus === 'SUCCESS' || currentAlertsStatus === 'LOADING') {
    return { Type: currentAlertsStatus };
  }

  // Run the call
  yield put({ type: BOOKINGS.ALERTS.LOADING, payload: { bookingId, pagination } });
  const token = yield select(selectToken());
  const apiServer = yield select(selectApi());
  try {
    const data = yield call(bookingAlerts, token.token, apiServer, bookingId, pagination);
    yield put({ type: BOOKINGS.ALERTS.SUCCESS, payload: { bookingId, pagination, results: data.alerts, meta: data.pageMetaData } });
    // Load all the alert details in the background.
    yield data.alerts.map((alert) => put(loadAlertTypeDetails(alert.alertType, alert.alertCode)));
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

  if (currentCaseNotesStatus === 'SUCCESS' || currentCaseNotesStatus === 'LOADING') {
    return { Type: currentCaseNotesStatus };
  }

  // Run the call
  yield put({ type: BOOKINGS.CASENOTES.LOADING, payload: { bookingId, pagination, query } });
  const token = yield select(selectToken());
  const apiServer = yield select(selectApi());
  try {
    const data = yield call(bookingCaseNotes, token.token, apiServer, bookingId, pagination, query);
    yield put({ type: BOOKINGS.CASENOTES.SUCCESS, payload: { bookingId, pagination, query, results: data.caseNotes, meta: data.pageMetaData } });
    // Load CaseNote Details now if necessary
    yield data.caseNotes.map((caseNote) => call(preloadCaseNoteType, caseNote.source, token, apiServer));

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
  const token = yield select(selectToken());
  const apiServer = yield select(selectApi());

  try {
    const metaRes = yield call(imageMeta, token.token, apiServer, imageId);
    const dataURL = yield call(imageData, token.token, apiServer, imageId);

    yield put({ type: IMAGES.SUCCESS, payload: { imageId, meta: metaRes, dataURL } });
    return null;
  } catch (err) {
    yield put({ type: IMAGES.ERROR, payload: { imageId, error: err } });
    return null;
  }
}

export function* preloadDataWatcher() {
  yield takeLatest(PRELOADDATA.BASE, preloadData);
}

export function* preloadData() {
  const token = yield select(selectToken());
  const apiServer = yield select(selectApi());
  yield call(locationsSaga, token, apiServer);
  yield call(preloadCaseNoteTypes, token, apiServer);
}

export function* locationsSaga(token, apiServer) {
  yield put({ type: LOCATIONS.LOADING });
  try {
    const res = yield call(locations, token.token, apiServer);

    const locObject = res.reduce((acc, item) => {
      acc[item.locationId] = { description: 'CCC-UNIT A',
        locationId: 5471,
        locationType: 'WING' };
      return Object.assign(acc, { [item.locationId]: { description: item.description,
        locationId: item.locationId,
        locationType: item.locationType } });
    }, {});

    yield put({ type: LOCATIONS.SUCCESS, payload: { locations: locObject } });
    return { locObject };
  } catch (err) {
    yield put({ type: LOCATIONS.ERROR, payload: { error: err } });
    return { error: err };
  }
}


export function* preloadCaseNoteTypes(token, apiServer) {
  const caseNoteSources = ['INST', 'COMM'];
  yield caseNoteSources.map((caseNoteSource) => call(preloadCaseNoteType, caseNoteSource, token, apiServer));
}

export function* preloadCaseNoteType(caseNoteSource, token, apiServer) {
  const status = yield select(selectCaseNoteSourceStatus, { source: caseNoteSource });
  if (status === 'SUCCESS' || status === 'LOADING') return null;

  yield put({ type: CASENOTETYPES.PRELOAD.LOADING, payload: caseNoteSource });

  try {
    // caseNoteTypes actually loads all + their subtypes.
    const caseNoteTypes = yield call(loadCaseNoteTypes, token.token, apiServer, caseNoteSource);
    yield put({ type: CASENOTETYPES.PRELOAD.SUCCESS, payload: { caseNoteTypes, caseNoteSource } });
    return null;
  } catch (err) {
    yield put({ type: CASENOTETYPES.PRELOAD.ERROR, payload: { error: err } });
    return { error: err };
  }
}

export function* caseNoteTypeWatch() {
  yield takeEvery(CASENOTETYPES.BASE, caseNoteTypeLoadSaga);
}

export function* caseNoteTypeLoadSaga(action) {
  const { source } = action.payload;
  if (!source) {
    // nothing to load here...
    return null;
  }

  const token = yield select(selectToken());
  const apiServer = yield select(selectApi());

  if (!token || !apiServer) {
    return 'fail';
  }
  yield call(preloadCaseNoteType, source, token, apiServer);
  return null;
}

// export function* officerNameSaga() {
//
// }

export default [
  preloadDataWatcher,
  imageLoadWatch,
  bookingDetailsWatcher,
  bookingAlertsWatch,
  bookingCaseNotesWatch,
  alertTypeLoadWatcher,
  caseNoteTypeWatch,
];
