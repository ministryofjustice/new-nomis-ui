/*
 *
 * Config reducer
 *
 */

/*
 * TODO:
 *   Add in translations/wording
 */

import { fromJS } from 'immutable';
import {
  CONFIG_SUCCESS,
  CONFIG_LOADING,
  CONFIG_ERROR,
} from './constants';
// import { push } from 'react-router-redux';

const initialState = fromJS({
  data: { apiServer: '' },
  updated: false,
  updating: false,
  error: '',
});

function authenticationReducer(state = initialState, action) {
  switch (action.type) {
    case CONFIG_SUCCESS: {
      return state
        .mergeDeep({ data: action.payload })
        .set('updated', true)
        .set('updating', false);
    }
    case CONFIG_LOADING: {
      return state.set('updating', true);
    }
    case CONFIG_ERROR: {
      return state
              .set('updating', false)
              .set('error', action.payload.error);
    }
    default: {
      return state;
    }
  }
}

export default authenticationReducer;
