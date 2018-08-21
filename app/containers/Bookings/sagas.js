import { takeLatest, put, select, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form/immutable';
import { selectApi } from 'containers/ConfigLoader/selectors';
import { bookingDetailsSaga as bookingDetailsElite } from 'containers/EliteApiLoader/sagas';
import { loadBookingCaseNotes, resetCaseNotes } from 'containers/EliteApiLoader/actions';
import { BOOKINGS } from 'containers/EliteApiLoader/constants';
import { notify } from 'react-notify-toast';
import { showSpinner, hideSpinner } from 'globalReducers/app';
import { buildSearchQueryString, buildCaseNotQueryString } from 'utils/stringUtils';

import { setSearchContext } from 'globalReducers/app';


import {
  addCaseNote,
  amendCaseNote,
  loadMyLocations,
  searchOffenders,
  loadKeyDates,
  loadQuickLook,
  loadScheduledEventsForThisWeek,
  loadScheduledEventsForNextWeek,
  addAppointment,
  bookingAlerts,
  extendSessionRequest,
} from 'utils/eliteApi';

import {
  APPOINTMENT,
} from 'containers/EliteApiLoader/constants';

import {
  selectSearchResultsPagination,
  selectSearchResultsSortOrder,
  selectSearchQuery,
} from './selectors';

import {
  DETAILS_TABS,
  SEARCH_SUCCESS,
  SEARCH_ERROR,
  VIEW_DETAILS,
  DETAILS_ERROR,
  UPDATE_PAGINATION,
  UPDATE_RESULTS_VIEW,
  SET_RESULTS_VIEW,
  ADD_NEW_CASENOTE,
  AMEND_CASENOTE,
  CASE_NOTE_FILTER,
  SET_LARGE_PHOTO_VISIBILITY,
  SHOW_LARGE_PHOTO_BOOKING_DETAILS,
  HIDE_LARGE_PHOTO_BOOKING_DETAILS,
  LOAD_LOCATIONS,
  SET_LOCATIONS,
  NEW_SEARCH,
  TOGGLE_SORT_ORDER,
  LOAD_KEY_DATES,
  SET_KEYDATES,
  LOAD_QUICK_LOOK,
  SET_QUICK_LOOK,
  LOAD_SCHEDULED_EVENTS,
  SET_SCHEDULED_EVENTS,
  CASE_NOTE,
  EXTEND_SESSION,
} from './constants';
import { getCaseNote } from '../../utils/eliteApi';

export function* extendActiveSessionWatcher() {
  yield takeLatest(EXTEND_SESSION, function* () {
    yield call(extendSessionRequest)
  })
}
export function* bookingAlertsWatcher() {
  yield takeLatest(BOOKINGS.ALERTS.BASE, bookingAlertsSaga);
}

export function* bookingAlertsSaga(action) {
  const { offenderNo, pagination } = action.payload;

  const apiServer = yield select(selectApi());

  yield put(showSpinner());

  try {
    const data = yield call(bookingAlerts, apiServer, offenderNo, pagination);

    yield put({ type: BOOKINGS.ALERTS.SUCCESS, payload: { offenderNo, results: data.alerts, meta: { totalRecords: data.totalRecords } } });
    yield put(hideSpinner());
    return { Type: 'SUCCESS' };
  } catch (err) {
    yield put(hideSpinner());
    yield put({ type: BOOKINGS.ALERTS.ERROR, payload: { offenderNo, error: err } });
    return { Type: 'ERROR', Error: err };
  }
}

export function* addAppointmentWatcher() {
  yield takeLatest(APPOINTMENT.ADD, onAddAppointment);
}

export function* loadScheduledEventsWatcher() {
  yield takeLatest(LOAD_SCHEDULED_EVENTS, onLoadScheduledEvents);
}

export function* loadKeyDatesWatcher() {
  yield takeLatest(LOAD_KEY_DATES, onLoadKeyDates);
}

export function* newSearchWatcher() {
  yield takeLatest(NEW_SEARCH, newSearch);
}
export function* loadLocationsWatcher() {
  yield takeLatest(LOAD_LOCATIONS, setLocations);
}

export function* showPhotoWatcher() {
  yield takeLatest(SHOW_LARGE_PHOTO_BOOKING_DETAILS, showPhoto);
}

export function* hidePhotoWatcher() {
  yield takeLatest(HIDE_LARGE_PHOTO_BOOKING_DETAILS, hidePhoto);
}

export function* toggleSortOrderWatcher() {
  yield takeLatest(TOGGLE_SORT_ORDER, toggleSort);
}

export function* loadQuickLookWatcher() {
  yield takeLatest(LOAD_QUICK_LOOK, onLoadQuickLook);
}

export function* onAddAppointment(action) {
  try {
    const { appointmentType, location, startTime, endTime, comment, offenderNo } = action.payload;

    yield call(addAppointment, {
      appointmentType,
      locationId: location,
      comment,
      startTime,
      endTime,
      offenderNo,
    });

    yield put(push(`/offenders/${offenderNo}/${DETAILS_TABS.QUICK_LOOK}`));

    yield notify.show('Appointment has been created successfully.', 'success');
  } catch (err) {
    yield put({ type: APPOINTMENT.ERROR, payload: new SubmissionError({ _error: 'Unable to create a new appointment at this time.' }) });
  }
}

export function* addCasenoteWatcher() {
  yield takeLatest(ADD_NEW_CASENOTE.BASE, addCasenoteSaga);
}

export function* addCasenoteSaga(action) {
  const { typeAndSubType: { type, subType }, caseNoteText: text, startTime } = action.payload.query;
  const offenderNo = action.payload.offenderNo;
  const apiServer = yield select(selectApi());

  try {
    yield call(addCaseNote, apiServer, offenderNo, type, subType, text, startTime);

    yield put({ type: ADD_NEW_CASENOTE.SUCCESS });
    yield put(resetCaseNotes(offenderNo));

    yield put(loadBookingCaseNotes(offenderNo));

    yield put(push(`/offenders/${offenderNo}/${DETAILS_TABS.CASE_NOTES}`));

    yield notify.show('Case note has been created successfully.', 'success');
  } catch (e) {
    yield put({ type: ADD_NEW_CASENOTE.ERROR, payload: new SubmissionError(e.message) });
  }
}

export function* onLoadQuickLook(action) {
  try {
    yield put(showSpinner());
    const viewModel = yield call(loadQuickLook, action.payload);
    yield put({
      type: SET_QUICK_LOOK,
      payload: viewModel,
    });
    yield put(hideSpinner());
  } catch (err) {
    yield put(hideSpinner());
    yield put({ type: DETAILS_ERROR, payload: { error: err.userMessage } });
  }
}

export function* onLoadKeyDates(action) {
  try {
    yield put(showSpinner());
    const viewModel = yield call(loadKeyDates, action.payload);
    yield put({
      type: SET_KEYDATES,
      payload: viewModel,
    });
    yield put(hideSpinner());
  } catch (err) {
    yield put(hideSpinner());
    yield put({ type: DETAILS_ERROR, payload: { error: err.userMessage } });
  }
}

export function* onLoadScheduledEvents(action) {
  try {
    yield put(showSpinner());
    const fetchScheduledEvents = action.payload.nextWeek === true ? loadScheduledEventsForNextWeek : loadScheduledEventsForThisWeek;
    const data = yield call(fetchScheduledEvents, action.payload.offenderNo);

    yield put({
      type: SET_SCHEDULED_EVENTS,
      payload: {
        data,
        nextWeek: action.payload.nextWeek,
      },
    });
    yield put(hideSpinner());
  } catch (error) {
    yield put(hideSpinner());
  }
}

export function* setLocations(action) {
  const apiServer = yield select(selectApi());
  const locations = yield call(loadMyLocations, apiServer, action);

  yield put({
    type: SET_LOCATIONS,
    payload: {
      locations,
    },
  });
}

export function* showPhoto(action) {
  yield put({
    type: SET_LARGE_PHOTO_VISIBILITY,
    payload: {
      shouldShowLargePhoto: true,
      imageId: (action.payload || { imageId: null }).imageId,
    },
  });
}

export function* hidePhoto(action) {
  yield put({
    type: SET_LARGE_PHOTO_VISIBILITY,
    payload: {
      shouldShowLargePhoto: false,
      imageId: (action.payload || { imageId: null }).imageId,
    },
  });
}

export function* toggleSort(action) {
  const baseUrl = yield select(selectApi());
  const previousSortOrder = yield select(selectSearchResultsSortOrder());
  const pagination = yield select(selectSearchResultsPagination());
  const query = yield select(selectSearchQuery());

  const sortOrder = action.payload || (previousSortOrder === 'ASC' ? 'DESC' : 'ASC');

  yield put(showSpinner());
  const result = yield call(searchOffenders, {
    baseUrl,
    query,
    pagination: {
      limit: pagination.perPage,
      offset: pagination.perPage * pagination.pageNumber,
    },
    sort: {
      order: sortOrder,
    },
  });

  yield put({
    type: SEARCH_SUCCESS,
    payload: {
      searchResults: result.bookings,
      searchQuery: query,
      meta: { totalRecords: result.totalRecords, sortOrder },
    },
  });

  yield put(hideSpinner());
}

export function* newSearch(action) {
  try {
    const { query } = action.payload;

    const baseUrl = yield select(selectApi());
    const { pagination } = query;

    yield put(showSpinner());

    const result = yield call(searchOffenders, {
      baseUrl,
      query,
      pagination: {
        limit: pagination.perPage,
        offset: pagination.perPage * pagination.pageNumber,
      },
      sort: {
        order: query.sortOrder,
      },
    });

    yield put(setSearchContext('results'));

    yield put({
      type: SEARCH_SUCCESS,
      payload: {
        searchResults: result.bookings,
        searchQuery: query,
        meta: { totalRecords: result.totalRecords, sortOrder: query.sortOrder },
      },
    });

    const queryString = buildSearchQueryString({
      ...query,
      ...pagination,
    });

    yield put(push({
      pathname: '/results',
      search: `?${queryString}`,
    }));

    yield put(hideSpinner());
  } catch (err) {
    yield put(hideSpinner());
    yield put({ type: SEARCH_ERROR, payload: { error: err.message } });
  }
}

export function* amendCaseNoteWatcher() {
  yield takeLatest(AMEND_CASENOTE.BASE, onAmendCaseNote);
}

export function* onAmendCaseNote(action) {
  const { amendmentText, offenderNo, caseNoteId, itemId } = action.payload;

  const apiServer = yield select(selectApi());

  try {
    yield call(amendCaseNote, apiServer, offenderNo, caseNoteId, amendmentText);
    yield put(push(`/offenders/${offenderNo}/${DETAILS_TABS.CASE_NOTES}/${itemId || ''}`));

    yield notify.show('Case note has been amended successfully.', 'success');
  } catch (err) {
    yield put({
      type: AMEND_CASENOTE.ERROR,
      payload: new SubmissionError({ _error: err.response.data.message || 'Unable to amend case note at this time.' }),
    });
  }
}


export function* detailsWatcher() {
  yield takeLatest(VIEW_DETAILS, viewDetails);
}


export function* viewDetails(action) {
  yield put(showSpinner());

  const { Type } = yield call(bookingDetailsElite, action);
  if (Type !== 'ERROR') {
    const previousPath = yield select(state => state.getIn(['route', 'locationBeforeTransitions', 'pathname']));

    const nextPath = `/offenders/${action.payload.offenderNo}/${action.payload.activeTabId}/${action.payload.itemId || ''}`;

    if (previousPath !== nextPath && window.location.pathname !== nextPath) {
      yield put(push(nextPath));
    }
  }

  yield put(hideSpinner());
}

export function* searchResultPaginationWatcher() {
  yield takeLatest(UPDATE_PAGINATION, updateSearchResultPagination);
}

export function* updateSearchResultPagination(action) {
  const queryString = buildSearchQueryString({
    ...action.payload,
  });

  yield put(push({
    pathname: '/results',
    search: `?${queryString}`,
  }));
}

export function* searchResultViewWatcher() {
  yield takeLatest(UPDATE_RESULTS_VIEW, updateSearchResultView);
}

export function* updateSearchResultView(action) {
  yield put({ type: SET_RESULTS_VIEW, payload: action.payload });
}

export function* setCaseNoteFilterWatcher() {
  yield takeLatest(CASE_NOTE_FILTER.BASE, setCaseNoteFilterSaga);
}

export function* setCaseNoteFilterSaga(action) {
  const { query, offenderNo } = action.payload;

  try {
    yield put({
      type: CASE_NOTE_FILTER.SUCCESS,
      payload: {
        query,
      },
    });

    yield put(push(`/offenders/${offenderNo}/${DETAILS_TABS.CASE_NOTES}?${buildCaseNotQueryString(query)}`));
  } catch (err) {
    yield put({ type: CASE_NOTE_FILTER.ERROR, payload: new SubmissionError({ _error: err.message }) });
  }
}

export function* loadCaseNoteWatcher() {
  yield takeLatest(CASE_NOTE.LOAD,loadCaseNote);
}

export function* loadCaseNote(action) {
  try {
    yield put(showSpinner());

    const { offenderNo, caseNoteId } = action.payload;

    yield put({
      type: CASE_NOTE.CLEAR,
      payload: {
        offenderNo,
      },
    });

    const apiServer = yield select(selectApi());
  
    const caseNoteDetails = yield call(getCaseNote, apiServer, offenderNo, caseNoteId);
  
    yield put({
      type: CASE_NOTE.SET,
      payload: {
        offenderNo,
        caseNoteDetails,
      },
    });
    yield put(hideSpinner());
  } catch (error) {
    yield put({
      type: CASE_NOTE.ERROR,
      payload: {
        offenderNo: action.payload.offenderNo,
        error: 'Could not open the case note at this time, please try again later',
      },
    });
    yield put(hideSpinner());
  }
}

export default [
  detailsWatcher,
  searchResultPaginationWatcher,
  searchResultViewWatcher,
  addCasenoteWatcher,
  amendCaseNoteWatcher,
  setCaseNoteFilterWatcher,
  showPhotoWatcher,
  hidePhotoWatcher,
  loadLocationsWatcher,
  newSearchWatcher,
  toggleSortOrderWatcher,
  loadKeyDatesWatcher,
  loadQuickLookWatcher,
  loadScheduledEventsWatcher,
  addAppointmentWatcher,
  bookingAlertsWatcher, 
  loadCaseNoteWatcher,
  extendActiveSessionWatcher,
];
