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
import { DEFAULT_MOMENT_DATE_FORMAT_SPEC } from 'containers/App/constants';

import { transform as quickLookTransformer } from 'helpers/dataMappers/quickLook';
import { transform as keyDatesTransformer } from 'helpers/dataMappers/keydates';

import {
  SEARCH_LOADING,
  SEARCH_SUCCESS,
  SEARCH_ERROR,
  VIEW_CASENOTE_DETAILS,
  VIEW_CASENOTE_LIST,
  SET_PAGINATION,
  DETAILS_TABS,
  SET_RESULTS_VIEW,
  SET_ALERTS_PAGINATION,
  SET_CASENOTES_PAGINATION,
  CASE_NOTE_FILTER,
  SET_LARGE_PHOTO_VISIBILITY,
  SET_LOCATIONS,
  SET_KEYDATES,
  DETAILS_ERROR,
  SET_QUICK_LOOK,
  SET_SCHEDULED_EVENTS,
} from './constants';


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
  error: null,
  query: { firstName: '', lastName: '' }, // for test purposes putting something in here...
  sortOrder: 'ASC',
  pagination: { perPage: 10, pageNumber: 0 },
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

    case SET_RESULTS_VIEW: {
      return state.set('resultsView', fromJS(action.payload));
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
      return state.setIn(['details','keyDatesViewModel'], keyDatesTransformer(fromJS(action.payload)));
    }

    case SET_QUICK_LOOK: {
      return state.setIn(['details','quickLookViewModel'], quickLookTransformer(fromJS(action.payload)));
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
