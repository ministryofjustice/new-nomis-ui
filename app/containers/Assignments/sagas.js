import { takeLatest, put, select, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { selectApi } from 'containers/ConfigLoader/selectors';
import { buildPaginationQueryString } from 'utils/stringUtils';
import { officerAssignments } from 'utils/eliteApi';

import {
  SET_ASSIGNMENTS,
  SET_ASSIGNMENTS_ERROR,
  LOAD_ASSIGNMENTS,
  UPDATE_ASSIGNMENTS_PAGINATION,
  SET_ASSIGNMENTS_VIEW,
  UPDATE_ASSIGNMENTS_VIEW,
} from './constants';

export function* assignmentLoadWatcher() {
  yield takeLatest(LOAD_ASSIGNMENTS, assignmentLoadSaga);
}

export function* assignmentLoadSaga(action) {
  const { perPage, pageNumber } = action.payload;
  const pagination = {
    perPage: perPage || 10,
    pageNumber: pageNumber || 0,
  };

  try {
    const apiServer = yield select(selectApi());
    const response = yield call(officerAssignments, pagination, apiServer);

    yield put({ type: SET_ASSIGNMENTS, payload: response });
  } catch (error) {
    yield put({ type: SET_ASSIGNMENTS_ERROR, payload: 'Something went wrong please try again later' });
  }
}

export function* assignmentsPaginationWatcher() {
  yield takeLatest(UPDATE_ASSIGNMENTS_PAGINATION, assignmentsPagination);
}

export function* assignmentsPagination(action) {
  yield put(push(`/assignments?${buildPaginationQueryString(action.payload.pagination)}`));
}

export function* assignmentsViewWatcher() {
  yield takeLatest(UPDATE_ASSIGNMENTS_VIEW, updateAssignmentsView);
}

export function* updateAssignmentsView(action) {
  yield put({ type: SET_ASSIGNMENTS_VIEW, payload: action.payload });
}

export default [
  assignmentLoadWatcher,
  assignmentsPaginationWatcher,
  assignmentsViewWatcher,
];
