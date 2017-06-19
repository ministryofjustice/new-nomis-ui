import { takeLatest, put, select, call } from 'redux-saga/effects';
import { searchSaga as searchSagaElite } from 'containers/EliteApiLoader/sagas';

import {
  selectAssignmentPagination,
  selectAssignmentSortOrder,
} from './selectors';

import {
  LOAD_ASSIGNMENTS,
  UPDATE_ASSIGNMENTS_PAGINATION,
  SET_ASSIGNMENTS_PAGINATION,
  SET_ASSIGNMENTS_VIEW,
  UPDATE_ASSIGNMENTS_VIEW,
} from './constants';

export function* assignmentLoadWatcher() {
  yield takeLatest(LOAD_ASSIGNMENTS, assignmentLoadSaga);
}

export function* assignmentLoadSaga(action) {
  const { resetPagination } = action.payload;

  let pagination = yield select(selectAssignmentPagination());
  const sortOrder = yield select(selectAssignmentSortOrder());

  try {
    if (resetPagination) {
      pagination = Object.assign(pagination, { pageNumber: 0 });
      yield put({ type: SET_ASSIGNMENTS_PAGINATION, payload: pagination });
    }
    yield call(searchSagaElite, { query: 'officerAssignments', pagination, sortOrder });
  } catch (err) {
    console.error('error loading assignment data', err); // eslint-disable-line
    // yield put({ type: SEARCH_ERROR, payload: new SubmissionError({ _error: err.message }) });
  }
}

export function* assignmentsPaginationWatcher() {
  yield takeLatest(UPDATE_ASSIGNMENTS_PAGINATION, assignmentsPagination);
}

export function* assignmentsPagination(action) {
  yield put({ type: SET_ASSIGNMENTS_PAGINATION, payload: action.payload.pagination });
  yield put({ type: LOAD_ASSIGNMENTS, payload: { } });
}

export function* assignmentsViewWatcher() {
  yield takeLatest(UPDATE_ASSIGNMENTS_VIEW, updateAssignmentsView);
}

export function* updateAssignmentsView(action) {
  yield put({ type: SET_ASSIGNMENTS_VIEW, payload: action.payload });
  yield put({ type: LOAD_ASSIGNMENTS, payload: {} });
}


export default [
  assignmentsPaginationWatcher,
  assignmentLoadWatcher,
  assignmentsViewWatcher,
];
