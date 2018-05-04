
import { fromJS } from 'immutable';

import {
  SET_LOCATIONS,
  SEARCH_ERROR,
  SEARCH_SUCCESS,
} from '../Bookings/constants';
import {SET_OMIC_URL} from "../Authentication/constants";

export const initialState = fromJS({
  loading: false,
  error: null,
  locations: [],
  keywords: '',
  locationPrefix: '',
  assignments: [],
  searchError: null,
});

function homeReducer(state = initialState, action) {
  switch (action.type) {

    case SET_LOCATIONS: {
      return state.set('locations', fromJS(action.payload.locations || []));
    }

    case SEARCH_ERROR: {
      return state.set('searchError', fromJS(action.payload));
    }

    case SEARCH_SUCCESS: {
      return state.set('searchError', null);
    }

    case SET_OMIC_URL: {
      return state.set('omicUrl', action.url);
    }

    default: {
      return state;
    }
  }
}

export default homeReducer;

