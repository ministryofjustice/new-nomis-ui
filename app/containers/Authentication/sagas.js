import { takeLatest, put, call, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form/immutable';
import { login, users } from 'utils/eliteApi';
import { selectApi } from 'containers/ConfigLoader/selectors';
import { PRELOADDATA } from 'containers/EliteApiLoader/constants';

import {
  LOGIN,
  LOGIN_LOADING,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  LOGOUT_SUCCESS,
} from './constants';

export function* loginWatcher() {
  yield takeLatest(LOGIN, loginUser);
}

export function* loginUser(action) {
  const { username, password, redirect } = action.payload;
  yield put({ type: LOGIN_LOADING });
  try {
    const apiUrl = yield select(selectApi());
    const res = yield call(login, username, password, apiUrl);
    const user = yield call(users.me, res.token, apiUrl);

    yield put({ type: LOGIN_SUCCESS, payload: { user, loginData: res } });
    yield put({ type: PRELOADDATA.BASE });
    if (redirect) yield put(push(redirect));
  } catch (err) {
    yield put({ type: LOGIN_ERROR, payload: new SubmissionError({ _error: err.message }) });
  }
}

export function* logoutWatcher() {
  yield takeLatest(LOGOUT, logoutUser);
}

export function* logoutUser() {
  try {
    yield [
      put({ type: LOGOUT_SUCCESS }),
      put(push('/login')),
    ];
  } catch (err) {
    // yield put({ type: ERROR, payload: err });
  }
}

export default [
  loginWatcher,
  logoutWatcher,
];
