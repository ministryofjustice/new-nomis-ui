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

import { fromJS, Map, Set, List } from 'immutable';

import { queryHash, paginationHash, originalId } from './helpers';

import {
  BOOKINGS,
  LOCATIONS,
  ALERTTYPES,
  IMAGES,
  CASENOTETYPES,
  OFFICERS,
  USER,
  ALLCASENOTETYPESUBTYPEDATA,
  APPOINTMENT,
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

const BookingDetailsAlertsDefault = fromJS({
  MetaData: {
    TotalRecords: undefined,
  },
  Paginations: {},
});

const CaseNoteQueryDefault = fromJS({
  MetaData: {
    TotalRecords: undefined,
  },
  Paginations: {},
});

const CaseNotesDefault = fromJS({
  Query: {},
});

export const initialState = fromJS({
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
    SelectList: List([{ value: 'Loading Locations...' }]),
  },
  AlertTypes: {
  },
  CaseNoteTypes: {
  },
  CaseNoteTypesSelect: { Types: Set([]), TypeList: List([]) },
  AllCaseNoteFilters: {
    Types: [],
    SubTypes: [],
  },
  Officers: {
  },
  User: {
    CaseLoads: List([]),
    CaseNoteTypes: List([]),
    CaseNoteSubTypes: List([]),
  },
});

function EliteApiReducer(state = initialState, action) {
  switch (action.type) {
    case BOOKINGS.CLEAR: {
      return state.set('Bookings', Map({
        Search: Map({}),
        Summaries: Map({}),
        Details: Map({}),
      }));
    }

    case BOOKINGS.SEARCH.LOADING: {
      const { query, pagination, sortOrder } = action.payload;

      const resultResultModel = {
        pagination: pagination || { pageNumber: 0, perPage: 10 },
        sortOrder: sortOrder || 'ASC',
      };

      return state.setIn(['Bookings', 'Search', queryHash(query)], fromJS(resultResultModel));
    }

    case BOOKINGS.SEARCH.ERROR:
    case BOOKINGS.SEARCH.SUCCESS: {
      const { query, pagination, sortOrder, results, meta, error } = action.payload;

      const resultResultModel = {
        pagination,
        sortOrder,
        results,
        meta,
        error,
      };
             
      return state.setIn(['Bookings', 'Search', queryHash(query)], fromJS(resultResultModel));
    }

    case BOOKINGS.DETAILS.LOADING: {
      return state
        .setIn(['Bookings', 'Details', action.payload.bookingId], fromJS({ Status: { Type: 'LOADING' }, Data: {}, Alerts: {} }))
        .setIn(['Bookings', 'Details','LoadingStatus'], { Type: 'LOADING' });
    }

    case BOOKINGS.DETAILS.SUCCESS: {
      const key = ['Bookings', 'Details', action.payload.bookingId];

      return state.updateIn(key, (bookingDetails) =>
        bookingDetails.setIn(['Status', 'Type'], 'SUCCESS')
        .set('Data', fromJS(action.payload)))
        .setIn(['Bookings', 'Details','LoadingStatus'], { Type: null });
    }

    case BOOKINGS.DETAILS.ERROR: {
      const { error } = action.payload;

      const key = ['Bookings', 'Details', action.payload.bookingId];

      return state
        .deleteIn(key)
        .setIn(['Bookings','Details','LoadingStatus'], { Type: 'ERROR', error });
    }

    case BOOKINGS.ALERTS.LOADING: {
      const { bookingId, pagination } = action.payload;
      let AlertsState = state.getIn(['Bookings', 'Details', bookingId, 'Alerts']);
      if (!AlertsState) {
        AlertsState = BookingDetailsAlertsDefault;
      }
      const newAlerts = AlertsState.setIn(['Paginations', paginationHash(pagination)], fromJS({ Status: { Type: 'LOADING' }, items: [] }));

      return state.setIn(['Bookings', 'Details', bookingId, 'Alerts'], newAlerts);
    }

    case BOOKINGS.ALERTS.SUCCESS: {
      const { pagination, bookingId, results, meta } = action.payload;
      // Simplifying...
      return state
        .setIn(['Bookings', 'Details', bookingId, 'Alerts', 'MetaData', 'TotalRecords'], meta.totalRecords)
        .updateIn(['Bookings', 'Details', bookingId, 'Alerts', 'Paginations', paginationHash(pagination)],
          (pag) => pag.setIn(['Status', 'Type'], 'SUCCESS')
                      .set('items', results));
    }

    case BOOKINGS.CASENOTES.RESET: {
      const { bookingId, pagination, query } = action.payload;
      // If pagination and query exist only reset that specific set of casenotes.
      if (pagination && query) {
        let CaseNotes = state.getIn(['Bookings', 'Details', bookingId, 'CaseNotes']);

        if (!CaseNotes) {
          CaseNotes = CaseNotesDefault;
        }

        let QueryState = CaseNotes.getIn(['Query', queryHash(query)]);

        if (!QueryState) {
          QueryState = CaseNoteQueryDefault;
        }

        const newQueryState = QueryState.setIn(['Paginations', paginationHash(pagination)], fromJS({ Status: { Type: 'RESET' }, items: [] }));
        return state.setIn(['Bookings', 'Details', bookingId, 'CaseNotes'], CaseNotes.setIn(['Query', queryHash(query)], newQueryState));
      }
      return state.setIn(['Bookings', 'Details', bookingId, 'CaseNotes'], CaseNotesDefault);
    }

    case BOOKINGS.CASENOTES.LOADING: {
      // Init Casenotes query/pagination obj.
      const { bookingId, pagination, query } = action.payload;
      let CaseNotes = state.getIn(['Bookings', 'Details', bookingId, 'CaseNotes']);

      if (!CaseNotes) {
        CaseNotes = CaseNotesDefault;
      }

      let QueryState = CaseNotes.getIn(['Query', queryHash(query)]);

      if (!QueryState) {
        QueryState = CaseNoteQueryDefault;
      }

      const newQueryState = QueryState.setIn(['Paginations', paginationHash(pagination)], fromJS({ Status: { Type: 'LOADING' }, items: [] }));

      return state.setIn(['Bookings', 'Details', bookingId, 'CaseNotes'], CaseNotes.setIn(['Query', queryHash(query)], newQueryState));
    }

    case BOOKINGS.CASENOTES.SUCCESS: {
      const { pagination, bookingId, query, results, meta } = action.payload;
      // Simplifying... had a plan to store the items differently... lets hope this is fine!

      return state
        .setIn(['Bookings', 'Details', bookingId, 'CaseNotes', 'Query', queryHash(query), 'MetaData', 'TotalRecords'], meta.totalRecords)
        .updateIn(['Bookings', 'Details', bookingId, 'CaseNotes', 'Query', queryHash(query), 'Paginations', paginationHash(pagination)],
          (pag) => pag.setIn(['Status', 'Type'], 'SUCCESS')
                      .set('items', fromJS(results.map((caseNote) => ({ ...caseNote })))));
    }

    case LOCATIONS.LOADING: {
      return state.setIn(['Locations', 'Status', 'Type'], 'LOADING');
    }

    case LOCATIONS.SUCCESS: {
      const locs = action.payload.locations;
      const SelectList = Object.keys(locs).map((locId) => ({ value: locId, label: locs[locId].description }));

      return state.setIn(['Locations', 'ids'], fromJS(action.payload.locations)).setIn(['Locations', 'Status', 'Type'], 'SUCCESS').setIn(['Locations', 'SelectList'], List(SelectList));
    }

    case ALERTTYPES.TYPE.LOADING: {
      const { alertType } = action.payload;
      return state.setIn(['AlertTypes', alertType, 'Status', 'Type'], 'LOADING');
    }

    case ALERTTYPES.TYPE.ERROR: {
      const { alertType, error } = action.payload;
      return state.setIn(['AlertTypes', alertType, 'Status'], fromJS({ Type: 'ERROR', Error: error }));
    }

    case ALERTTYPES.TYPE.SUCCESS: {
      const { alertType, data } = action.payload;
      return state.setIn(['AlertTypes', alertType, 'Status', 'Type'], 'SUCCESS').setIn(['AlertTypes', alertType, 'Data'], fromJS(data)); }

    case ALERTTYPES.CODE.LOADING: {
      const { alertType, alertCode } = action.payload;
      return state.setIn(['AlertTypes', alertType, 'Codes', alertCode, 'Status', 'Type'], 'LOADING');
    }

    case ALERTTYPES.CODE.SUCCESS: {
      const { alertType, alertCode, data } = action.payload;
      return state.setIn(['AlertTypes', alertType, 'Codes', alertCode, 'Status', 'Type'], 'SUCCESS').setIn(['AlertTypes', alertType, 'Codes', alertCode, 'Data'], fromJS(data));
    }

    case ALERTTYPES.CODE.ERROR: {
      const { alertType, alertCode, error } = action.payload;
      return state.setIn(['AlertTypes', alertType, 'Codes', alertCode, 'Status'], fromJS({ Type: 'ERROR', Error: error }));
    }

    case IMAGES.LOADING: {
      return state.setIn(['Images', action.payload.imageId, 'Status', 'Type'], 'LOADING');
    }

    case IMAGES.SUCCESS: {
      return state.updateIn(['Images', action.payload.imageId], (im) => im.setIn(['Status', 'Type'], 'SUCCESS').set('dataURL', action.payload.dataURL).set('meta', action.payload.meta));
    }

    case OFFICERS.LOADING: {
      return state.setIn(['Officers', action.payload.officerKey, 'Status', 'Type'], 'LOADING');
    }

    case OFFICERS.SUCCESS: {
      return state.updateIn(['Officers', action.payload.officerKey], (user) => user.setIn(['Status', 'Type'], 'SUCCESS').set('Data', action.payload.data));
    }

    case OFFICERS.ERROR: {
      return state.setIn(['Officers', action.payload.officerKey, 'Status'], fromJS({ Type: 'ERROR', Error: action.payload.error }));
    }

    case CASENOTETYPES.PRELOAD.LOADING: {
      return state;
    }

    case CASENOTETYPES.PRELOAD.SUCCESS: {
      const { types, subTypes } = action.payload;
      const Types = types.map((x) => ({ label: x.description, value: x.code }));
      const SubTypes = subTypes.map((x) => ({ label: x.description, value: x.code, parent: x.parentCode }));

      return state.setIn(['User', 'CaseNoteTypes'], Types).setIn(['User', 'CaseNoteSubTypes'], SubTypes);
    }

    case USER.CASELOADS.LOADING: {
      return state.setIn(['User', 'CaseLoads'], fromJS({ Status: { Type: 'LOADING' } }));
    }

    case USER.CASELOADS.SUCCESS: {
      return state.setIn(['User', 'CaseLoads'], fromJS({ Status: { Type: 'SUCCESS' }, Data: action.payload.caseloads }));
    }

    case USER.CASELOADS.ERROR: {
      return state.setIn(['User', 'CaseLoads'], fromJS({ Status: { Type: 'ERROR', Error: action.payload.error } }));
    }

    case ALLCASENOTETYPESUBTYPEDATA: {
      const { types, subTypes } = action.payload;
      const TypeMap = {};
      const SubTypeMap = {};
      const Types = types.map((x) => { TypeMap[x.code] = x.description; return ({ label: x.description, value: x.code }); });
      const SubTypes = subTypes.reduce((arr, sT) => arr.concat(sT.map((x) => ({ label: x.description, value: x.code, parent: x.parentCode }))), []);
      SubTypes.forEach((x) => {
        if (SubTypeMap[x.value]) {
          console.log('multiple subtypes same name...', SubTypeMap[x.value], x.label); // eslint-disable-line
        }
        SubTypeMap[x.value] = x.label;
      });

      return state
        .set('AllCaseNoteFilters', Map({ Types, SubTypes }))
        .set('CaseNoteTypes', Map({ Types: TypeMap, SubTypes: SubTypeMap }));
    }

    case APPOINTMENT.SET_VIEW_MODEL: {
      return state.set('AppointmentTypesAndLocations',fromJS(action.payload));
    }


    default: {
      return state;
    }
  }
}

export default EliteApiReducer;
