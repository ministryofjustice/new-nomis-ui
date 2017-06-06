import { put, select, call, takeLatest, takeEvery } from 'redux-saga/effects';
import { bookings, locations, alertTypes, imageMeta, imageData, bookingDetails, bookingAliases } from 'utils/eliteApi';
import { selectToken } from 'containers/Authentication/selectors';
import { selectApi } from 'containers/ConfigLoader/selectors';
import { selectBookingResultStatus, selectBookingResults, selectImageStatus, selectBookingDetails } from './selectors';

import {
  BOOKINGS,
  LOCATIONS,
  PRELOADDATA,
  ALERTTYPES,
  IMAGES,
} from './constants';

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
  // yield call(imageLoadSaga, { imageId: '9393' });
  yield call(locationsSaga);
  yield call(alertTypesSaga);
}

export function* locationsSaga() {
  const token = yield select(selectToken());
  const apiServer = yield select(selectApi());
  yield put({ type: LOCATIONS.LOADING });
  try {
    const res = yield call(locations, token.token, apiServer);
    // FIXME Add in while loop here just in case there are more locations that can be called in a single trip.

    const locObject = res.locations.reduce((acc, item) => {
      acc[item.locationId] = { description: 'CCC-UNIT A',
        locationId: 5471,
        locationType: 'WING' };
      return Object.assign(acc, { [item.locationId]: { description: item.description,
        locationId: item.locationId,
        locationType: item.locationType } });
    }, {});

    yield put({ type: LOCATIONS.SUCCESS, payload: { locations: locObject, meta: res.pageMetaData } });
    return { inmatesSummaries: res.inmatesSummaries };
  } catch (err) {
    yield put({ type: LOCATIONS.ERROR, payload: { error: err } });
    return { error: err };
  }
}

export function* alertTypesSaga() {
  const token = yield select(selectToken());
  const apiServer = yield select(selectApi());
  yield put({ type: ALERTTYPES.LOADING });
  try {
    const res = yield call(alertTypes, token.token, apiServer);
    // FIXME Add in while loop here just in case there are more locations that can be called in a single trip.

    yield put({ type: ALERTTYPES.SUCCESS, payload: { alertTypes: res.ReferenceCodes, meta: res.pageMetaData } });
    return { inmatesSummaries: res.inmatesSummaries };
  } catch (err) {
    yield put({ type: ALERTTYPES.ERROR, payload: { error: err } });
    return { error: err };
  }
}

// export function* officerNameSaga() {
//
// }

export default [
  preloadDataWatcher,
  imageLoadWatch,
  bookingDetailsWatcher,
];
