import { takeLatest, put, call } from 'redux-saga/effects';
// Config file loader
import { loadConfig } from 'utils/configLoader';

import {
  UPDATE_CONFIG,
  CONFIG_SUCCESS,
  CONFIG_LOADING,
  // CONFIG_FAIL,
  CONFIG_ERROR,
} from './constants';

// loadConfig().then((x) => { console.log(x); });

export function* updateConfigWatcher() {
  yield takeLatest(UPDATE_CONFIG, updateConfig);
}

export function* updateConfig() {
  yield put({ type: CONFIG_LOADING });
  try {
    const res = yield call(loadConfig);
    yield put({ type: CONFIG_SUCCESS, payload: res });
  } catch (err) {
    console.error(err);
    yield put({ type: CONFIG_ERROR, payload: { error: err.message } });
  }
}

export default [
  updateConfigWatcher,
];
