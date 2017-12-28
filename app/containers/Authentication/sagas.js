import { takeLatest, put, call, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { SubmissionError } from 'redux-form/immutable';
import { login, users, loadAppointmentViewModel } from 'utils/eliteApi';
import { selectApi } from 'containers/ConfigLoader/selectors';
import { PRELOADDATA, USER } from 'containers/EliteApiLoader/constants';
import { LOAD_ASSIGNMENTS } from 'containers/Assignments/constants';

import {
  APPOINTMENT,
} from 'containers/Bookings/constants';

import {
  LOGIN,
  LOGIN_LOADING,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  LOGOUT_SUCCESS,
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
    const user = yield call(users.me, res, apiUrl);

    const viewModel = yield call(loadAppointmentViewModel, { agencyId: user.activeCaseLoadId });
    yield put({
      type: APPOINTMENT.SET_VIEW_MODEL,
      payload: viewModel,
    });

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
  return tokenData.token;
}


export default [
  loginWatcher,
  logoutWatcher,
];
