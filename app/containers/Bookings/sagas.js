import { takeLatest, put, select, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form/immutable';
import { searchSaga as searchSagaElite, bookingDetailsSaga as bookingDetailsElite } from 'containers/EliteApiLoader/sagas';
import { loadBookingAlerts, loadBookingCaseNotes } from 'containers/EliteApiLoader/actions';
import { selectSearchResultsPagination, selectSearchResultsSortOrder, selectSearchQuery } from './selectors';

import {
  SEARCH,
  SEARCH_SUCCESS,
  SEARCH_ERROR,
  VIEW_DETAILS,
  SET_DETAILS,
  DETAILS_ERROR,
  UPDATE_PAGINATION,
  SET_PAGINATION,
  UPDATE_ALERTS_PAGINATION,
  SET_ALERTS_PAGINATION,
  SET_CASENOTES_PAGINATION,
  UPDATE_CASENOTES_PAGINATION,
  UPDATE_RESULTS_VIEW,
  SET_RESULTS_VIEW,
} from './constants';

export function* searchWatcher() {
  yield takeLatest(SEARCH, searchSaga);
}

export function* searchSaga(action) {
  const { query, resetPagination } = action.payload;

  // const pagination = Object.assign(yield select(selectSearchResultsPagination()), { pageNumber: 0 });
  const pagination = yield select(selectSearchResultsPagination());

  const sortOrder = yield select(selectSearchResultsSortOrder());
  // console.log(pagination);
  try {
    if (resetPagination) {
      const resetPag = Object.assign(pagination, { pageNumber: 0 });
      yield put({ type: SET_PAGINATION, payload: resetPag });
    }
    const res = yield call(searchSagaElite, { query: query.toJS ? query.toJS() : query, pagination, sortOrder });

    yield put({ type: SEARCH_SUCCESS,
      payload: {
        searchResults: res.inmatesSummaries,
        meta: res.pageMetaData,
        searchQuery: query,
      } });
    yield put(push('/search/results'));
  } catch (err) {
    console.error(err); // eslint-disable-line
    yield put({ type: SEARCH_ERROR, payload: new SubmissionError({ _error: err.message }) });
  }
}

export function* detailsWatcher() {
  yield takeLatest(VIEW_DETAILS, viewDetails);
}

export function* viewDetails(action) {
  yield put({ type: SET_DETAILS,
    payload: action.payload });

  try {
    const res = yield call(bookingDetailsElite, action); //eslint-disable-line
    // FIXME if res is an error we should deal with it more gracefully...
    yield put(push('/bookings/details'));
  } catch (err) {
    yield put({ type: DETAILS_ERROR, payload: new SubmissionError({ _error: err.message }) });
  }
}

export function* searchResultPaginationWatcher() {
  yield takeLatest(UPDATE_PAGINATION, updateSearchResultPagination);
}

export function* updateSearchResultPagination(action) {
  yield put({ type: SET_PAGINATION, payload: action.payload });
  const currentQuery = yield select(selectSearchQuery());
  yield put({ type: SEARCH, payload: { query: currentQuery } });
}

export function* searchResultViewWatcher() {
  yield takeLatest(UPDATE_RESULTS_VIEW, updateSearchResultView);
}

export function* updateSearchResultView(action) {
  yield put({ type: SET_RESULTS_VIEW, payload: action.payload });
  const currentQuery = yield select(selectSearchQuery());
  yield put({ type: SEARCH, payload: { query: currentQuery } });
}


export function* detailAlertsPaginationWatcher() {
  yield takeLatest(UPDATE_ALERTS_PAGINATION, detailAlertsPagination);
}

export function* detailAlertsPagination(action) {
  // Load new data first, then switch in view.
  yield put(loadBookingAlerts(action.payload.bookingId, action.payload.pagination));
  yield put({ type: SET_ALERTS_PAGINATION, payload: action.payload.pagination });
}

export function* detailCaseNotesPaginationWatcher() {
  yield takeLatest(UPDATE_CASENOTES_PAGINATION, detailCaseNotesPagination);
}

export function* detailCaseNotesPagination(action) {
  // Load new data first, then switch in view.
  yield put(loadBookingCaseNotes(action.payload.bookingId, action.payload.pagination, action.payload.query));
  yield put({ type: SET_CASENOTES_PAGINATION, payload: action.payload.pagination });
}

export default [
  searchWatcher,
  detailsWatcher,
  searchResultPaginationWatcher,
  searchResultViewWatcher,
  detailAlertsPaginationWatcher,
  detailCaseNotesPaginationWatcher,
];
