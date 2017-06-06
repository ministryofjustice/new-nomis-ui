/*
 *
 * EliteApiLoader
 *
 */

/*
 * TODO:
 *   Logout if not in use
 *   Complete proper authentication! use redux saga for log in messages...
 */

import { fromJS } from 'immutable';

import { queryHash, paginationHash, originalId } from './helpers';

import {
  BOOKINGS,
  LOCATIONS,
  ALERTTYPES,
  IMAGES,
} from './constants';

const SortedSearchQuery = fromJS({
  Paginations: {},
  SortedIds: {},
});

const SearchQueryDefault = fromJS({
  MetaData: {
    TotalRecords: undefined,
  },
  Sorted: {
    Descending: {
    },
    Ascending: {

    },
  },
});

const initialState = fromJS({
  Bookings: {
    Search: {},
    Summaries: {},
    Details: {},
  },
  Images: {

  },
  Locations: {
    Status: { Type: 'NOT SET' },
    MetaData: {
      TotalRecords: 0,
    },
    ids: {},
  },
  AlertTypes: {
    Status: { Type: 'NOT SET' },
    MetaData: {
      TotalRecords: 0,
    },
    ReferenceCodes: [],
  },
});

function EliteApiReducer(state = initialState, action) {
  switch (action.type) {
    case BOOKINGS.SEARCH.LOADING: {
      // Initialises a searchQuery &/or the sortorder/pagination object with status loading.
      const { query, pagination, sortOrder } = action.payload;
      let QueryState = state.getIn(['Bookings', 'Search', query]);
      if (!QueryState) {
        QueryState = SearchQueryDefault;
      }
      // Loading a specific combination of query, pagination & sortOrder --- set Status.Type to LOADING for this specific combination.
      const newQuery = QueryState.setIn(['Sorted', sortOrder], SortedSearchQuery.setIn(['Paginations', paginationHash(pagination), 'Status', 'Type'], 'LOADING'));

      return state.setIn(['Bookings', 'Search', queryHash(query)], newQuery);
    }

    case BOOKINGS.SEARCH.SUCCESS: {
      // Assuming that bookings search loading has already been called.
      const { query, pagination, sortOrder, results, meta } = action.payload;
      let newState;

      newState = state.updateIn(['Bookings', 'Search', queryHash(query), 'Sorted', sortOrder],
                              (sortPageState) => sortPageState.setIn(['Paginations', paginationHash(pagination), 'Status', 'Type'], 'SUCCESS')
                                                              .update('SortedIds', (SortedIds) => results.reduce((sIds, inmateSummary, id) => sIds.set(originalId(id, pagination), inmateSummary.bookingId), SortedIds)));

      newState = newState.setIn(['Bookings', 'Search', queryHash(query), 'MetaData', 'TotalRecords'], meta.totalRecords);
      newState = newState.updateIn(['Bookings', 'Summaries'], (summaryState) => results.reduce((tempState, inmateSummary) => tempState.set(inmateSummary.bookingId, inmateSummary), summaryState));

      return newState;
    }

    case BOOKINGS.SEARCH.ERROR: {
      // Assuming that bookings search loading has already been called.
      const { query, pagination, sortOrder, error } = action.payload;
      return state.updateIn(['Bookings', 'Search', queryHash(query), 'Sorted', sortOrder, pagination], (sortPageState) => sortPageState.set(['Status'], fromJS({ Type: 'ERROR', error })));
    }

    case BOOKINGS.DETAILS.LOADING: {
      return state.setIn(['Bookings', 'Details', action.payload.bookingId], fromJS({ Status: { Type: 'LOADING' }, Data: {} }));
    }

    case BOOKINGS.DETAILS.SUCCESS: {
      return state.updateIn(['Bookings', 'Details', action.payload.bookingId], (bookingDetails) => bookingDetails.setIn(['Status', 'Type'], 'SUCCESS').set('Data', fromJS(action.payload)));
    }

    case BOOKINGS.DETAILS.ERROR: {
      return state;
    }

    case LOCATIONS.LOADING: {
      return state.setIn(['Locations', 'Status', 'Type'], 'LOADING');
    }

    case LOCATIONS.SUCCESS: {
      return state.setIn(['Locations', 'ids'], fromJS(action.payload.locations)).setIn(['Locations', 'Status', 'Type'], 'SUCCESS');
    }

    case ALERTTYPES.LOADING: {
      return state.setIn(['AlertTypes', 'Status', 'Type'], 'LOADING');
    }

    case ALERTTYPES.SUCCESS: {
      return state.setIn(['AlertTypes', 'ReferenceCodes'], action.payload.alertTypes).setIn(['AlertTypes', 'Status', 'Type'], 'SUCCESS');
    }
    case IMAGES.LOADING: {
      return state.setIn(['Images', action.payload.imageId, 'Status', 'Type'], 'LOADING');
    }

    case IMAGES.SUCCESS: {
      return state.updateIn(['Images', action.payload.imageId], (im) => im.setIn(['Status', 'Type'], 'SUCCESS').set('dataURL', action.payload.dataURL).set('meta', action.payload.meta));
    }

    default: {
      return state;
    }
  }
}

export default EliteApiReducer;
