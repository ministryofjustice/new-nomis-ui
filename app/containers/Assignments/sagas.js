import { takeLatest, put, select, call } from 'redux-saga/effects';
import { SubmissionError } from 'redux-form';

import { searchSaga as searchSagaElite } from 'containers/EliteApiLoader/sagas';
import { hideSpinner, showSpinner } from 'globalReducers/app';

import {
  selectAssignmentsSortOrder,
} from './selectors';

import {
  LOAD_ASSIGNMENTS,
  UPDATE_ASSIGNMENTS_PAGINATION,
  SET_ASSIGNMENTS_PAGINATION,
  SET_ASSIGNMENTS_VIEW,
  UPDATE_ASSIGNMENTS_VIEW,
  SET_ASSIGNMENTS_SORT_ORDER,
  TOGGLE_ASSIGNMENTS_SORT_ORDER,
} from './constants';

import {
  SEARCH_ERROR,
} from '../Bookings/constants';

export function* assignmentLoadWatcher() {
  yield takeLatest(LOAD_ASSIGNMENTS, assignmentLoadSaga);
}

export function* assignmentLoadSaga(action) {
  const { resetPagination } = action.payload;

  const pagination = yield select((state) => state.toJS().assignments && state.toJS().assignments.pagination);
  const sortOrder = yield select((state) => state.toJS().assignments && state.toJS().assignments.sortOrder);

  try {
    yield put(showSpinner());
    if (resetPagination) {
      yield put({ type: SET_ASSIGNMENTS_PAGINATION, payload: { ...pagination, pageNumber: 0 } });
    }
    yield call(searchSagaElite, { query: 'officerAssignments', pagination, sortOrder });
    yield put(hideSpinner());
  } catch (err) {
    yield put(hideSpinner());
    yield put({ type: SEARCH_ERROR, payload: new SubmissionError({ _error: 'Something went wrong, please try again later.' }) });
  }
}

export function* assignmentsPaginationWatcher() {
  yield takeLatest(UPDATE_ASSIGNMENTS_PAGINATION, assignmentsPagination);
}

export function* assignmentsPagination(action) {
  yield put({ type: SET_ASSIGNMENTS_PAGINATION, payload: action.payload.pagination });
  yield put({ type: LOAD_ASSIGNMENTS, payload: {} });
}

export function* assignmentsViewWatcher() {
  yield takeLatest(UPDATE_ASSIGNMENTS_VIEW, updateAssignmentsView);
}

export function* updateAssignmentsView(action) {
  yield put({ type: SET_ASSIGNMENTS_VIEW, payload: action.payload });
  yield put({ type: LOAD_ASSIGNMENTS, payload: {} });
}

export function* assignmentsSortOrderWatcher() {
  yield takeLatest(TOGGLE_ASSIGNMENTS_SORT_ORDER, assignmentsSortOrder);
}

export function* assignmentsSortOrder(action) {
  const previousSortOrder = yield select(selectAssignmentsSortOrder());
  const sortOrder = action.payload || (previousSortOrder === 'ASC' ? 'DESC' : 'ASC');

  yield put({ type: SET_ASSIGNMENTS_SORT_ORDER, payload: { sortOrder } });
  yield put({ type: LOAD_ASSIGNMENTS, payload: {} });
}

export default [
  assignmentsPaginationWatcher,
  assignmentLoadWatcher,
  assignmentsViewWatcher,
  assignmentsSortOrderWatcher,
];
