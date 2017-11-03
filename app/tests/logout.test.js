
import {
  LOGOUT_SUCCESS,
} from 'containers/Authentication/constants';

import assignmentReducer, { initialState as initialAssignmentState } from 'containers/Assignments/reducer';
import authenticationReducer, { initialState as initialAuthenticationState } from 'containers/Authentication/reducer';
import bookingsReducer, { initialState as initialBookingsState } from 'containers/Bookings/reducers';
import eliteApiLoaderReducer, { initialState as initialEliteApiloaderState } from 'containers/EliteApiLoader/reducer';
import homePageReducer, { initialState as initialHomePage } from 'containers/HomePage/reducers';


describe('Ensure that the application state is reset on logout', () => {

  it('should reset assignments state', () => {
    const state = assignmentReducer({},{
      type: LOGOUT_SUCCESS,
    });

    expect(state.toJS()).toEqual(initialAssignmentState.toJS());
  });

  it('should reset authentication state', () => {
    const state = authenticationReducer({},{
      type: LOGOUT_SUCCESS,
    });

    expect(state.toJS()).toEqual(initialAuthenticationState.toJS());
  });

  it('should reset bookings state', () => {
    const state = bookingsReducer({},{
      type: LOGOUT_SUCCESS,
    });

    expect(state.toJS()).toEqual(initialBookingsState.toJS());
  });

  it('should reset eliteApiLoader state', () => {
    const state = eliteApiLoaderReducer({},{
      type: LOGOUT_SUCCESS,
    });

    expect(state.toJS()).toEqual(initialEliteApiloaderState.toJS());
  });

  it('should reset home page state', () => {
    const state = homePageReducer({},{
      type: LOGOUT_SUCCESS,
    });

    expect(state.toJS()).toEqual(initialHomePage.toJS());
  });

});