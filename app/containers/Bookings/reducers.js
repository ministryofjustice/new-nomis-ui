import { fromJS } from 'immutable'
import { LOCATION_CHANGE } from 'react-router-redux'
import { transform as quickLookTransformer } from '../../helpers/dataMappers/quickLook'
import { transform as keyDatesTransformer } from '../../helpers/dataMappers/keydates'

import {
  SEARCH_SUCCESS,
  DETAILS_TABS,
  SET_RESULTS_VIEW,
  SET_LARGE_PHOTO_VISIBILITY,
  SET_LOCATIONS,
  SET_KEYDATES,
  DETAILS_ERROR,
  SET_QUICK_LOOK,
  SET_SCHEDULED_EVENTS,
} from './constants'

const objectIsNotEmpty = obj => Object.keys(obj).length !== 0
const isSearchResultRoute = route => route === '/results'

const detailsState = fromJS({
  id: 0,
  activeTabId: DETAILS_TABS.QUICK_LOOK,
  tabs: [
    { tabId: DETAILS_TABS.OFFENDER_DETAILS, title: 'Offender Details' },
    { tabId: DETAILS_TABS.QUICK_LOOK, title: 'Quick look' },
    { tabId: DETAILS_TABS.PHYSICAL_ATTR, title: 'Physical Attributes' },
    { tabId: DETAILS_TABS.ALERTS, title: 'Alerts' },
    { tabId: DETAILS_TABS.CASE_NOTES, title: 'Case Notes' },
  ],
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
  lastSearchResultQuery: null,
})

export const initialState = fromJS({
  error: null,
  query: { firstName: '', lastName: '' }, // for test purposes putting something in here...
  sortOrder: 'ASC',
  pagination: { perPage: 10, pageNumber: 0 },
  details: detailsState,
  resultsView: 'List', // List or Grid
})

function searchReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_SUCCESS: {
      return state
        .set('error', null)
        .set('query', fromJS(action.payload.searchQuery))
        .set('results', fromJS(action.payload.searchResults))
        .set('totalResults', fromJS(action.payload.meta.totalRecords))
        .set('sortOrder', fromJS(action.payload.meta.sortOrder))
    }

    case LOCATION_CHANGE:
      return state.set(
        'lastSearchResultQuery',
        isSearchResultRoute(action.payload.pathname) && objectIsNotEmpty(action.payload.query)
          ? action.payload.query
          : state.get('lastSearchResultQuery')
      )

    case SET_RESULTS_VIEW: {
      return state.set('resultsView', fromJS(action.payload))
    }

    case SET_LARGE_PHOTO_VISIBILITY: {
      return state
        .setIn(['details', 'shouldShowLargePhoto'], fromJS(action.payload.shouldShowLargePhoto))
        .setIn(['details', 'imageId'], fromJS(action.payload.imageId))
    }

    case SET_LOCATIONS: {
      return state.setIn(['details', 'locations'], fromJS(action.payload.locations || []))
    }

    case SET_KEYDATES: {
      return state.setIn(['details', 'keyDatesViewModel'], keyDatesTransformer(fromJS(action.payload)))
    }

    case SET_QUICK_LOOK: {
      return state.setIn(['details', 'quickLookViewModel'], quickLookTransformer(fromJS(action.payload)))
    }

    case SET_SCHEDULED_EVENTS: {
      return state.setIn(['details', 'scheduledEvents'], fromJS(action.payload.data)).setIn(
        ['details', 'currentFilter'],
        fromJS({
          thisWeek: !action.payload.nextWeek,
          nextWeek: action.payload.nextWeek,
        })
      )
    }

    case DETAILS_ERROR: {
      return state.setIn(['details', 'error'], fromJS(action.payload.error))
    }

    default: {
      return state
    }
  }
}

export default searchReducer
