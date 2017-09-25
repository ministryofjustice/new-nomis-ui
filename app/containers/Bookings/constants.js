/*
 *
 * Booking constants
 *
 */

export const SEARCH = 'app/search/SEARCH';
export const SEARCH_LOADING = 'app/search/SEARCH/loading';
export const SEARCH_SUCCESS = 'app/search/SEARCH/success';
export const SEARCH_ERROR = 'app/search/SEARCH/error';
export const NEW_SEARCH = 'app/search/SEARCH/NEW_SEARCH';

export const SET_RESULTS_VIEW = 'app/bookings/search/results/viewFormat';
export const UPDATE_RESULTS_VIEW = 'app/bookings/search/results/viewFormat/update';
export const TOGGLE_SORT_ORDER = 'app/bookings/search/results/sortOrder';

export const SET_PAGINATION = 'app/bookings/search/results/pagination/set';
export const UPDATE_PAGINATION = 'app/bookings/search/results/pagination/update';


export const VIEW_DETAILS = 'app/bookings/details/view';
export const SET_DETAILS = 'app/bookings/details/set';
export const SET_DETAILS_TAB = 'app/bookings/details/tab/set';
export const LOAD_KEY_DATES = 'app/bookings/details/tab/load/keydates';
export const SET_KEYDATES = 'app/bookings/details/tab/set/keydates';

export const DETAILS_TABS = {
  OFFENDER_DETAILS: 0,
  PHYSICAL_ATTR: 1,
  ALERTS: 2,
  CASE_NOTES: 3,
};

export const DETAILS_ERROR = 'app/bookings/details/error';

export const SET_ALERTS_PAGINATION = 'app/bookings/details/alerts/pagination/set';
export const UPDATE_ALERTS_PAGINATION = 'app/bookings/details/alerts/pagination/update';

export const SET_CASENOTES_PAGINATION = 'app/bookings/details/casenotes/pagination/set';
export const UPDATE_CASENOTES_PAGINATION = 'app/bookings/details/casenotes/pagination/update';

export const VIEW_CASENOTE_LIST = 'app/bookings/details/casenotes/view/list';
export const VIEW_CASENOTE_DETAILS = 'app/bookings/details/casenotes/view/details';
export const SET_CASENOTE_DETAILS = 'app/bookings/details/casenotes/details/set';

export const SET_ADD_CASENOTE_MODAL = 'app/bookings/details/addCaseNotesModal';
export const SET_AMEND_CASENOTE_MODAL = 'app/bookings/details/casenotes/amendCaseNotesModal';

export const SHOW_LARGE_PHOTO_BOOKING_DETAILS = 'SHOW_LARGE_PHOTO_BOOKING_DETAILS';
export const HIDE_LARGE_PHOTO_BOOKING_DETAILS = 'HIDE_LARGE_PHOTO_BOOKING_DETAILS';
export const SET_LARGE_PHOTO_VISIBILITY = 'SET_PHOTO_VISIBILITY';

export const LOAD_LOCATIONS = 'LOAD_LOCATIONS';
export const SET_LOCATIONS = 'SET_LOCATIONS';

export const ADD_NEW_CASENOTE = {
  BASE: 'app/bookings/details/addNewCaseNote',
  LOADING: 'app/bookings/details/addNewCaseNote/LOADING',
  SUCCESS: 'app/bookings/details/addNewCaseNote/SUCCESS',
  ERROR: 'app/bookings/details/addNewCaseNote/ERROR',
};

export const CASE_NOTE_FILTER = {
  BASE: 'app/bookings/details/setCaseNotesQuery',
  LOADING: 'app/bookings/details/setCaseNotesQuery/LOADING',
  SUCCESS: 'app/bookings/details/setCaseNotesQuery/SUCCESS',
  ERROR: 'app/bookings/details/setCaseNotesQuery/ERROR',
};


export const AMEND_CASENOTE = {
  BASE: 'app/bookings/details/amendCaseNote',
  LOADING: 'app/bookings/details/amendCaseNote/LOADING',
  SUCCESS: 'app/bookings/details/amendCaseNote/SUCCESS',
  ERROR: 'app/bookings/details/amendCaseNote/ERROR',
};

/*
{
  type: 'app/bookings/search/results/pagination/update',
  payload: {perPage:15, pageNumber: 1}
}
*/
