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
import moment from 'moment';
import { DEFAULT_MOMENT_DATE_FORMAT_SPEC } from 'containers/App/constants';

import {
  LOGOUT_SUCCESS,
} from 'containers/Authentication/constants';


import {
  SEARCH_LOADING,
  SEARCH_SUCCESS,
  SEARCH_ERROR,
  SET_DETAILS,
  VIEW_CASENOTE_DETAILS,
  VIEW_CASENOTE_LIST,
  SET_PAGINATION,
  SET_DETAILS_TAB,
  DETAILS_TABS,
  SET_RESULTS_VIEW,
  SET_ALERTS_PAGINATION,
  SET_CASENOTES_PAGINATION,
  SET_ADD_CASENOTE_MODAL,
  SET_AMEND_CASENOTE,
  CASE_NOTE_FILTER,
  SET_LARGE_PHOTO_VISIBILITY,
  SET_LOCATIONS,
  SET_KEYDATES,
  DETAILS_ERROR,
  SET_QUICK_LOOK,
  SET_SCHEDULED_EVENTS,
} from './constants';


import results from './Results/resultsData';

const detailsState = fromJS({
  id: 20847,
  activeTabId: DETAILS_TABS.OFFENDER_DETAILS,
  tabs: [{ tabId: DETAILS_TABS.OFFENDER_DETAILS, title: 'Offender Details' },
         { tabId: DETAILS_TABS.PHYSICAL_ATTR, title: 'Physical Attributes' },
         { tabId: DETAILS_TABS.ALERTS, title: 'Alerts' },
         { tabId: DETAILS_TABS.CASE_NOTES, title: 'Case Notes' }],
  alertsPagination: { perPage: 10, pageNumber: 0 },
  shouldShowLargePhoto: false,
  imageId: 0,
  locations: [],
  totalResults: 0,
  caseNotes: {
    Pagination: { perPage: 10, pageNumber: 0 },
    Query: { source: [], typeSubType: { type: [], subType: [] }, dateRange: { startDate: null, endDate: null } },
    viewId: 0,
    viewOptions: ['LIST', 'DETAIL'],
    amendCaseNoteModal: false,
    caseNoteDetailId: null,
  },
  addCaseNoteModal: false,
  currentFilter: {
    thisWeek: true,
    nextWeek: false,
  },
});

export const initialState = fromJS({
  loading: false,
  results, // for test purposes putting something in here...
  error: null,
  query: { firstName: '', lastName: '' }, // for test purposes putting something in here...
  sortOrder: 'ASC',
  pagination: { perPage: 10, pageNumber: 0 },
  details: detailsState,
  resultsView: 'List', // List or Grid
});

const dateRangeValidation = (startDate, endDate) => {
  if (!startDate && !endDate) { return true; }

  if (startDate === endDate) { return true; }

  if (startDate && endDate) {
    const startDateValue = moment(startDate, DEFAULT_MOMENT_DATE_FORMAT_SPEC);
    const endDateValue = moment(endDate, DEFAULT_MOMENT_DATE_FORMAT_SPEC);

    return startDateValue && endDateValue && startDateValue.isBefore(endDateValue);
  }

  return true;
};

function searchReducer(state = initialState, action) {
  switch (action.type) {

    case '@@redux-form/CHANGE': {
      const { meta } = action;
      const { form, field } = meta;
      const formId = 'caseNoteFilter';
      const newValue = {};
      const location = ['details', 'caseNotes'];

      if (form === formId && (field === 'startDate' || field === 'endDate')) {
        newValue[field] = action.payload;

        const startDate = newValue.startDate || state.getIn([...location, 'startDate']);
        const endDate = newValue.endDate || state.getIn([...location, 'endDate']);

        return state
           .setIn([...location, 'dateRangeValid'], fromJS(dateRangeValidation(startDate, endDate)))
           .setIn([...location, field], fromJS(action.payload));
      }

      return state;
    }

    case LOGOUT_SUCCESS: {
      return initialState;
    }


    case SEARCH_LOADING: {
      return state.set('loading', true);
    }

    case SEARCH_SUCCESS: {
      return state
        .set('loading', false)
        .set('error', null)
        .set('query', fromJS(action.payload.searchQuery))
        .set('results', fromJS(action.payload.searchResults))
        .set('totalResults', fromJS(action.payload.meta.totalRecords))
        .set('sortOrder', fromJS(action.payload.meta.sortOrder));
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

    case SET_AMEND_CASENOTE: {
      return state.setIn(['details', 'caseNotes', 'amendCaseNoteModal'], action.payload);
    }

    case SET_ADD_CASENOTE_MODAL: {
      return state.setIn(['details', 'addCaseNoteModal'], action.payload);
    }

    case SET_DETAILS_TAB: {
      const newState = state.setIn(['details', 'activeTabId'], action.payload.activeTabId);
      if (action.payload.activeTabId === DETAILS_TABS.CASE_NOTES) {
        return newState.setIn(['details', 'caseNotes', 'viewId'], 0);
      }
      return newState;
    }

    case SET_RESULTS_VIEW: {
      const cP = state.get('pagination').toJS();
      const currentFirstId = cP.pageNumber * cP.perPage;
      let newPerPage;
      if (action.payload === 'Grid') {
        newPerPage = 10;
      } else if (action.payload === 'List') {
        newPerPage = 10;
      }
      const newPageNumber = Math.floor(currentFirstId / newPerPage);
      const newPagination = { perPage: newPerPage, pageNumber: newPageNumber };
      return state.set('pagination', fromJS(newPagination)).set('resultsView', fromJS(action.payload));
    }

    case CASE_NOTE_FILTER.SUCCESS: {
      return state.setIn(['details', 'caseNotes', 'Query'], fromJS(action.payload.query));
    }

    case SET_LARGE_PHOTO_VISIBILITY: {
      return state
         .setIn(['details', 'shouldShowLargePhoto'], fromJS(action.payload.shouldShowLargePhoto))
         .setIn(['details', 'imageId'], fromJS(action.payload.imageId));
    }

    case SET_LOCATIONS: {
      return state.setIn(['details', 'locations'], fromJS(action.payload.locations || []));
    }

    case SET_KEYDATES: {
      return state.setIn(['details','keyDatesViewModel'], fromJS(action.payload));
    }

    case SET_QUICK_LOOK: {
      return state.setIn(['details','quickLookViewModel'],fromJS(action.payload));
    }

    case SET_SCHEDULED_EVENTS: {
      return state
        .setIn(['details','scheduledEvents'],fromJS(action.payload.data))
        .setIn(['details', 'currentFilter'], fromJS({
          thisWeek: !action.payload.nextWeek,
          nextWeek: action.payload.nextWeek,
        }));
    }

    case DETAILS_ERROR: {
      return state.setIn(['details','error'], fromJS(action.payload.error));
    }

    default: {
      return state;
    }
  }
}

export default searchReducer;
