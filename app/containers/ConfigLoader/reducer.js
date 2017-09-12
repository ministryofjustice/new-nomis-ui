import { fromJS } from 'immutable';

// Default to my version...
const initialState = fromJS({
  data: {
    apiServer: '/api/',
  },
});

function authenticationReducer(state = initialState) {
  return state;
}

export default authenticationReducer;
