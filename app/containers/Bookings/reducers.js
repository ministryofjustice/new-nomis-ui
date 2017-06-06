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
  SET_PAGINATION,
  SET_DETAILS_TAB,
  SET_RESULTS_VIEW,
} from './constants';

import results from './Results/resultsData';

// import { push } from 'react-router-redux';
// import { details } from './defaults';

const initialState = fromJS({
  loading: false,
  results, // for test purposes putting something in here...
  error: null,
  // details, // for test purposes putting something in here...
  query: { firstName: 'DAV', lastName: 'S' }, // for test purposes putting something in here...
  sortOrder: 'TEST',
  pagination: { perPage: 7, pageNumber: 0 },
  details: {
    id: 20847,
    activeTabId: 0,
    tabs: [{ tabId: 0, title: 'Offender Details' }, { tabId: 1, title: 'Physical Attributes' }, { tabId: 2, title: 'Alerts' }, { tabId: 3, title: 'Case Notes' }],
  },
  resultsView: 'List', // List or Grid
});

function searchReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_LOADING: {
      return state.set('loading', true);
    }
    case SEARCH_SUCCESS: {
      return state
        .set('loading', false)
        .set('error', null)
        .set('query', fromJS(action.payload.searchQuery))
        .set('results', fromJS(action.payload.searchResults));
    }
    case SEARCH_ERROR: {
      return state.set('loading', false);
    }

    case SET_PAGINATION: {
      return state.set('pagination', fromJS(action.payload));
    }

    case SET_DETAILS: {
      return state.setIn(['details', 'id'], action.payload.bookingId);
    }

    case SET_DETAILS_TAB: {
      return state.setIn(['details', 'activeTabId'], action.payload.activeTabId);
    }

    case SET_RESULTS_VIEW: {
      const cP = state.get('pagination').toJS();
      const currentFirstId = cP.pageNumber * cP.perPage;
      let newPerPage = 7;
      if (action.payload === 'Grid') {
        newPerPage = 12;
      } else if (action.payload === 'List') {
        newPerPage = 7;
      }
      const newPageNumber = Math.floor(currentFirstId / newPerPage);
      const newPagination = { perPage: newPerPage, pageNumber: newPageNumber };
      console.log(newPageNumber);
      return state.set('pagination', fromJS(newPagination)).set('resultsView', fromJS(action.payload));
    }

    default: {
      return state;
    }
  }
}

export default searchReducer;
