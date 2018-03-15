import { takeLatest, put, call, select } from 'redux-saga/effects';
import { userMe, users } from 'utils/eliteApi';
import { selectApi } from 'containers/ConfigLoader/selectors';
import { PRELOADDATA, USER } from 'containers/EliteApiLoader/constants';
import { LOAD_ASSIGNMENTS } from 'containers/Assignments/constants';
import { showSpinner, hideSpinner } from 'globalReducers/app';

import {
  APPOINTMENT,
} from 'containers/EliteApiLoader/constants';

import {
  USER_ME,
  RETRIEVE_USER_ME,
} from './constants';

export function* userMeWatcher() {
  yield takeLatest(RETRIEVE_USER_ME, updateUserDetails);
}

export function* updateUserDetails(action) {
  try {
    yield put(showSpinner());

    const apiUrl = yield select(selectApi());
    const user = yield call(users.me, apiUrl);

    yield put({ type: USER_ME, payload: { user } });
    yield put({ type: PRELOADDATA.BASE });
    yield put({ type: USER.CASELOADS.BASE });
    yield put({ type: LOAD_ASSIGNMENTS, payload: {} });
  } catch (err) {
    yield put(hideSpinner());
  }
}

export default [
  userMeWatcher,
];
