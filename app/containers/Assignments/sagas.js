import { takeLatest, put, select, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import { selectApi } from 'containers/ConfigLoader/selectors'
import { buildPaginationQueryString } from 'utils/stringUtils'
import { officerAssignments } from 'utils/eliteApi'
import { showSpinner, hideSpinner } from 'globalReducers/app'

import {
  SET_ASSIGNMENTS,
  SET_ASSIGNMENTS_ERROR,
  LOAD_ASSIGNMENTS,
  UPDATE_ASSIGNMENTS_PAGINATION,
  SET_ASSIGNMENTS_VIEW,
  UPDATE_ASSIGNMENTS_VIEW,
} from './constants'

export function* assignmentLoadSaga() {
  try {
    yield put(showSpinner())
    const apiServer = yield select(selectApi())
    const response = yield call(officerAssignments, apiServer)

    yield put({ type: SET_ASSIGNMENTS, payload: response })
    yield put(hideSpinner())
  } catch (error) {
    yield put(hideSpinner())
    yield put({ type: SET_ASSIGNMENTS_ERROR, payload: 'Something went wrong please try again later' })
  }
}

export function* assignmentLoadWatcher() {
  yield takeLatest(LOAD_ASSIGNMENTS, assignmentLoadSaga)
}

export function* assignmentsPagination(action) {
  yield put(push(`/assignments?${buildPaginationQueryString(action.payload.pagination)}`))
}

export function* assignmentsPaginationWatcher() {
  yield takeLatest(UPDATE_ASSIGNMENTS_PAGINATION, assignmentsPagination)
}

export function* updateAssignmentsView(action) {
  yield put({ type: SET_ASSIGNMENTS_VIEW, payload: action.payload })
}

export function* assignmentsViewWatcher() {
  yield takeLatest(UPDATE_ASSIGNMENTS_VIEW, updateAssignmentsView)
}

export default [assignmentLoadWatcher, assignmentsPaginationWatcher, assignmentsViewWatcher]
