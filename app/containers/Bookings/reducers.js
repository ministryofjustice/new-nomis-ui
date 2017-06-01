/*
 *
 * Authentication reducer
 *
 */

/*
 * TODO:
 *   Logout if not in use
 *   Complete proper authentication! use redux saga for log in messages...
 */

import { fromJS } from 'immutable';
import {
  SEARCH_LOADING,
  SEARCH_SUCCESS,
  SEARCH_ERROR,
  SET_DETAILS,
} from './constants';
// import { push } from 'react-router-redux';

const initialState = fromJS({
  loading: false,
  results: [],
  error: null,
  details: null,
});

function searchReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_LOADING: {
      // const username = state.get('usernameInput');
      return state.set('loading', true);
    }
    case SEARCH_SUCCESS: {
      return state
        .set('loading', false)
        .set('error', null)
        .set('results', fromJS(action.payload.searchResults));
    }
    case SEARCH_ERROR: {
      return state.set('loading', false);
    }
    case SET_DETAILS: {
      return state.set('details', action.payload.details);
    }
    default: {
      return state;
    }
  }
}

export default searchReducer;
