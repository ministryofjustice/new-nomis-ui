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
  VIEW_CASENOTE_DETAILS,
  VIEW_CASENOTE_LIST,
  SET_PAGINATION,
  SET_DETAILS_TAB,
  SET_RESULTS_VIEW,
  SET_ALERTS_PAGINATION,
  SET_CASENOTES_PAGINATION,
  SET_ADD_CASENOTE_MODAL,
  SET_AMEND_CASENOTE_MODAL,
  CASE_NOTE_FILTER,
} from './constants';

import results from './Results/resultsData';

const detailsState = fromJS({
  id: 20847,
  activeTabId: 0,
  tabs: [{ tabId: 0, title: 'Offender Details' }, { tabId: 1, title: 'Physical Attributes' }, { tabId: 2, title: 'Alerts' }, { tabId: 3, title: 'Case Notes' }],
  alertsPagination: { perPage: 7, pageNumber: 0 },
  caseNotes: {
    Pagination: { perPage: 5, pageNumber: 0 },
    Query: {},
    viewId: 0,
    viewOptions: ['LIST', 'DETAIL'],
    amendCaseNoteModal: false,
    caseNoteDetailId: null,
  },
  addCaseNoteModal: false,
});

const initialState = fromJS({
  loading: false,
  results, // for test purposes putting something in here...
  error: null,
  query: { firstName: '', lastName: '' }, // for test purposes putting something in here...
  sortOrder: 'TEST',
  pagination: { perPage: 7, pageNumber: 0 },
  details: detailsState,
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

    case SET_ALERTS_PAGINATION: {
      return state.setIn(['details', 'alertsPagination'], fromJS(action.payload));
    }

    case SET_CASENOTES_PAGINATION: {
      return state.setIn(['details', 'caseNotes', 'Pagination'], fromJS(action.payload));
    }

    case SET_DETAILS: {
      // reset view to beginning.
      return state.set('details', detailsState.set('id', action.payload.bookingId));
    }

    case VIEW_CASENOTE_DETAILS: {
      return state.setIn(['details', 'caseNotes', 'caseNoteDetailId'], action.payload.caseNoteId).setIn(['details', 'caseNotes', 'viewId'], 1);
    }

    case VIEW_CASENOTE_LIST: {
      return state.setIn(['details', 'caseNotes', 'caseNoteDetailId'], null).setIn(['details', 'caseNotes', 'viewId'], 0);
    }

    case SET_AMEND_CASENOTE_MODAL: {
      return state.setIn(['details', 'caseNotes', 'amendCaseNoteModal'], action.payload);
    }

    case SET_ADD_CASENOTE_MODAL: {
      return state.setIn(['details', 'addCaseNoteModal'], action.payload);
    }

    case SET_DETAILS_TAB: {
      return state.setIn(['details', 'activeTabId'], action.payload.activeTabId);
    }

    case SET_RESULTS_VIEW: {
      const cP = state.get('pagination').toJS();
      const currentFirstId = cP.pageNumber * cP.perPage;
      let newPerPage;
      if (action.payload === 'Grid') {
        newPerPage = 12;
      } else if (action.payload === 'List') {
        newPerPage = 7;
      }
      const newPageNumber = Math.floor(currentFirstId / newPerPage);
      const newPagination = { perPage: newPerPage, pageNumber: newPageNumber };
      return state.set('pagination', fromJS(newPagination)).set('resultsView', fromJS(action.payload));
    }

    case CASE_NOTE_FILTER.SUCCESS: {
      return state.setIn(['details', 'caseNotes', 'Query'], fromJS(action.payload.query));
    }

    default: {
      return state;
    }
  }
}

export default searchReducer;
