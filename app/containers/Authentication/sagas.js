import { takeLatest, put, call, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form/immutable';
import { login, users, refreshAuthToken } from 'utils/eliteApi';
import { selectApi } from 'containers/ConfigLoader/selectors';
import { PRELOADDATA, USER } from 'containers/EliteApiLoader/constants';
import { LOAD_ASSIGNMENTS } from 'containers/Assignments/constants';

import {
  LOGIN,
  LOGIN_LOADING,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  LOGOUT_SUCCESS,
  TOKEN_UPDATE,
} from './constants';


import { selectToken } from './selectors';

import messages from './messages';

export function* loginWatcher() {
  yield takeLatest(LOGIN, loginUser);
}

export function* loginUser(action) {
  let bla = action.payload;
  if (action.payload.toJS) {
    bla = action.payload.toJS();
  }

  const { username, password, redirect } = bla;
  yield put({ type: LOGIN_LOADING });
  try {
    const apiUrl = yield select(selectApi());
    const res = yield call(login, username, password, apiUrl);
    const user = yield call(users.me, res.token, apiUrl);

    yield put({ type: LOGIN_SUCCESS, payload: { user, loginData: res } });
    yield put({ type: PRELOADDATA.BASE });
    yield put({ type: USER.CASELOADS.BASE });
    yield put({ type: LOAD_ASSIGNMENTS, payload: {} });
    if (redirect) yield put(push(redirect));
  } catch (err) {
    yield put({ type: LOGIN_ERROR, payload: new SubmissionError({ _error: messages.authFailed }) });
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

export function* getToken() {
  const tokenData = yield select(selectToken());
  if (!tokenData) {
    yield put(push('/logout'));
    return false;
  }
  const now = Date.now();
  const tokenExpired = tokenData.expiration < now;
  // FIXME: Display an error if this fails...
  const refreshExpired = tokenData.refreshExpiration < now;

  if (refreshExpired) {
    // If the refresh is expired log user out.
    yield put(push('/logout'));
    return false;
  } else if (tokenExpired) {
    const newData = yield refreshAuth();
    if (newData) {
      yield put({ type: TOKEN_UPDATE, payload: newData });
      return newData.token;
    }
    // If the refresh fails log user out also.
    yield put(push('/logout'));
    return false;
  }
  return tokenData.token;
}

export function* refreshAuth() {
  const tokenData = yield select(selectToken());
  if (!tokenData) {
    return false;
  }
  try {
    const apiUrl = yield select(selectApi());
    const res = yield call(refreshAuthToken, apiUrl, tokenData.refreshToken);

    return res;
  } catch (e) {
    console.log('trouble refreshing token', e); //eslint-disable-line
    return false;
  }
}

export default [
  loginWatcher,
  logoutWatcher,
];
