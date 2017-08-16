
import { fromJS } from 'immutable';

import {
  SET_LOCATIONS
} from '../Bookings/constants';

const initialState = fromJS({
  loading: false,
  error: null,
  locations: [],
  keywords:'',
  locationPrefix: '',
  assignments: []
});

function homeReducer (state = initialState, action) {

  switch (action.type) {

     case SET_LOCATIONS:{
      return state.set('locations', fromJS(action.payload.locations || []));
    }

    default: {
      return state;
    }
  }
}

export default homeReducer;

