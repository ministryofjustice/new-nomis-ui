import { fromJS, Map, List } from 'immutable';

import {
  SET_ASSIGNMENTS,
  SET_ASSIGNMENTS_VIEW,
  SET_ASSIGNMENTS_ERROR,
} from './constants';


export const initialState = Map({
  totalRecords: 0,
  results: List([]),
  view: 'List',
  error: '',
});

function searchReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ASSIGNMENTS: {
      return state
        .set('results', fromJS(action.payload.data))
        .set('totalRecords', action.payload.totalRecords)
        .set('error', '')
    }

    case SET_ASSIGNMENTS_VIEW: {
      const { view } = action.payload;
      return state.set('view', view);
    }

    case SET_ASSIGNMENTS_ERROR: {
      return state.set('error', action.payload);
    }

    default: {
      return state;
    }
  }
}

export default searchReducer;
