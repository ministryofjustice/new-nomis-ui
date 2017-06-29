import { takeLatest, put, select, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form/immutable';
import { addCaseNote, amendCaseNote,
} from 'utils/eliteApi';
import { getToken } from 'containers/Authentication/sagas';

import { selectApi } from 'containers/ConfigLoader/selectors';
import { searchSaga as searchSagaElite, bookingDetailsSaga as bookingDetailsElite } from 'containers/EliteApiLoader/sagas';
import { loadBookingAlerts, loadBookingCaseNotes, resetCaseNotes } from 'containers/EliteApiLoader/actions';
import { BOOKINGS } from 'containers/EliteApiLoader/constants';

import { selectSearchResultsPagination, selectSearchResultsSortOrder, selectSearchQuery, selectBookingDetailsId, selectCaseNotesPagination,
selectCaseNotesQuery, selectCaseNotesDetailId } from './selectors';

import { closeAddCaseNoteModal, setDetailsTab, closeAmendCaseNoteModal } from './actions';

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
  ADD_NEW_CASENOTE,
  AMEND_CASENOTE,
  CASE_NOTE_FILTER,
} from './constants';

export function* searchWatcher() {
  yield takeLatest(SEARCH, searchSaga);
}

export function* searchSaga(action) {
  const { query, resetPagination } = action.payload;
  let pagination = yield select(selectSearchResultsPagination());

  const sortOrder = yield select(selectSearchResultsSortOrder());
  // console.log(pagination);
  try {
    if (resetPagination) {
      pagination = Object.assign(pagination, { pageNumber: 0 });
      yield put({ type: SET_PAGINATION, payload: pagination });
    }
    const res = yield call(searchSagaElite, { query: query.toJS ? query.toJS() : query, pagination, sortOrder });

    yield put({ type: SEARCH_SUCCESS,
      payload: {
        searchResults: res.inmatesSummaries,
        meta: res.pageMetaData,
        searchQuery: query,
      } });
    if (res.inmatesSummaries.length === 1) {
      const bookingId = res.inmatesSummaries[0].bookingId;
      yield put({ type: VIEW_DETAILS, payload: { bookingId } });
    } else {
      yield put(push('/search/results'));
    }
  } catch (err) {
    console.error(err); // eslint-disable-line
    yield put({ type: SEARCH_ERROR, payload: new SubmissionError({ _error: err.message }) });
  }
}

export function* addCasenoteWatcher() {
  yield takeLatest(ADD_NEW_CASENOTE.BASE, addCasenoteSaga);
}

export function* addCasenoteSaga(action) {
  const { typeAndSubType: { type, subType }, caseNoteText: text, occurrenceDateTime } = action.payload.query;
  const bookingId = yield select(selectBookingDetailsId());

  const token = yield getToken();
  const apiServer = yield select(selectApi());
  try {
    yield call(addCaseNote, token, apiServer, bookingId, type, subType, text, occurrenceDateTime);

    yield put({ type: ADD_NEW_CASENOTE.SUCCESS });
    yield put(closeAddCaseNoteModal());
    // Reset casenotes
    yield put(resetCaseNotes(bookingId));
    // load casenotes again...
    const pagination = yield select(selectCaseNotesPagination());
    const query = yield select(selectCaseNotesQuery());
    yield put(loadBookingCaseNotes(bookingId, pagination, query));

    // Go to casenotes tab...
    yield put(setDetailsTab(3));
    yield put(push('/bookings/details'));
  } catch (e) {
    yield put({ type: ADD_NEW_CASENOTE.ERROR, payload: new SubmissionError(e.message) });
  }
}

export function* amendCaseNoteWatcher() {
  yield takeLatest(AMEND_CASENOTE.BASE, amendCaseNoteSaga);
}

export function* amendCaseNoteSaga(action) {
  const { caseNoteAmendmentText: text } = action.payload.query;
  const bookingId = yield select(selectBookingDetailsId());
  const caseNoteId = yield select(selectCaseNotesDetailId());
  const token = yield getToken();
  const apiServer = yield select(selectApi());

  try {
    yield call(amendCaseNote, token, apiServer, bookingId, caseNoteId, text);
    yield put({ type: ADD_NEW_CASENOTE.SUCCESS });

    yield put(closeAmendCaseNoteModal());
    // Reset casenotes
    const pagination = yield select(selectCaseNotesPagination());
    const query = yield select(selectCaseNotesQuery());
    yield put(resetCaseNotes(bookingId, pagination, query));
    // load casenotes again...
    yield put(loadBookingCaseNotes(bookingId, pagination, query));
  } catch (e) {
    yield put({ type: ADD_NEW_CASENOTE.ERROR, payload: new SubmissionError(e.message) });
  }
  return 'done';
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

export function* setCaseNoteFilterWatcher() {
  yield takeLatest(CASE_NOTE_FILTER.BASE, setCaseNoteFilterSaga);
}

export function* setCaseNoteFilterSaga(action) {
  const { query, resetPagination, goToPage } = action.payload;
  // console.log(query);
  let pagination = yield select(selectSearchResultsPagination());
  const bookingId = yield select(selectBookingDetailsId());
  // console.log(query, pagination, bookingId);
  // const sortOrder = yield select(selectSearchResultsSortOrder());
  // console.log(pagination);
  try {
    if (resetPagination) {
      pagination = Object.assign(pagination, { pageNumber: 0 });
      yield put({ type: SET_CASENOTES_PAGINATION, payload: pagination });
    }
    yield put({ type: BOOKINGS.CASENOTES.BASE, payload: { bookingId, query, pagination } });
    yield put({ type: CASE_NOTE_FILTER.SUCCESS,
      payload: {
        query,
      } });
    // console.log(goToPage);
    if (goToPage) yield put(push(goToPage));
  } catch (err) {
    console.error(err); // eslint-disable-line
    yield put({ type: CASE_NOTE_FILTER.ERROR, payload: new SubmissionError({ _error: err.message }) });
  }
}

export default [
  searchWatcher,
  detailsWatcher,
  searchResultPaginationWatcher,
  searchResultViewWatcher,
  detailAlertsPaginationWatcher,
  detailCaseNotesPaginationWatcher,
  addCasenoteWatcher,
  amendCaseNoteWatcher,
  setCaseNoteFilterWatcher,
];
