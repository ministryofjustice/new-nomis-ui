import { takeLatest, put, select } from 'redux-saga/effects';

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
  assignmentsViewWatcher,
  assignmentsSortOrderWatcher,
];
