import { takeLatest, put, select, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form/immutable';
import { selectToken } from 'containers/Authentication/selectors';
import { bookings, bookingDetails } from 'utils/eliteApi';
import { selectApi } from 'containers/ConfigLoader/selectors';

import {
  SEARCH,
  SEARCH_SUCCESS,
  SEARCH_ERROR,
  VIEW_DETAILS,
  SET_DETAILS,
  DETAILS_ERROR,
} from './constants';

export function* searchWatcher() {
  yield takeLatest(SEARCH, searchSaga);
}

export function* searchSaga(action) {
  const token = yield select(selectToken());
  const apiServer = yield select(selectApi());

  try {
    const res = yield call(bookings, token.token, action.payload, apiServer);
    yield put({ type: SEARCH_SUCCESS,
      payload: {
        searchResults: res.inmatesSummaries,
        meta: res.pageMetaData,
        searchQuery: action.payload,
      } });

    yield put(push('/search/results'));
  } catch (err) {
    console.error(err);
    yield put({ type: SEARCH_ERROR, payload: new SubmissionError({ _error: err.message }) });
  }
}

export function* detailsWatcher() {
  yield takeLatest(VIEW_DETAILS, viewDetails);
}

export function* viewDetails(action) {
  const user = yield select(selectToken());
  const apiServer = yield select(selectApi());

  try {
    const res = yield call(bookingDetails, user.token, action.payload.bookingId, apiServer);
    yield put({ type: SET_DETAILS,
      payload: {
        details: res,
      } });

    yield put(push('/bookings/details'));
  } catch (err) {
    yield put({ type: DETAILS_ERROR, payload: new SubmissionError({ _error: err.message }) });
  }
}

export default [
  searchWatcher,
];
