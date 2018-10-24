import { takeLatest, put, call, select } from 'redux-saga/effects'
import { users } from 'utils/eliteApi'
import { selectApi } from 'containers/ConfigLoader/selectors'
import { USER } from 'containers/EliteApiLoader/constants'
import { showSpinner, hideSpinner } from 'globalReducers/app'

import { USER_ME, RETRIEVE_USER_ME } from './constants'

export function* userMeWatcher() {
  yield takeLatest(RETRIEVE_USER_ME, updateUserDetails)
}

export function* updateUserDetails() {
  try {
    yield put(showSpinner())

    const apiUrl = yield select(selectApi())
    const user = yield call(users.me, apiUrl)
    yield put({ type: USER_ME, payload: { user } })
    yield put({ type: USER.CASELOADS.BASE })
    yield put({ type: USER.ROLES.BASE })

    yield put(hideSpinner())
  } catch (err) {
    yield put(hideSpinner())
  }
}

export default [userMeWatcher]
