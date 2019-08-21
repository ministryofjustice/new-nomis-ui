export const SEARCH_SUCCESS = 'app/search/SEARCH/success'
export const SEARCH_ERROR = 'app/search/SEARCH/error'
export const NEW_SEARCH = 'app/search/SEARCH/NEW_SEARCH'

export const SET_RESULTS_VIEW = 'app/bookings/search/results/viewFormat'
export const UPDATE_RESULTS_VIEW = 'app/bookings/search/results/viewFormat/update'

export const UPDATE_PAGINATION = 'app/bookings/search/results/pagination/update'

export const VIEW_DETAILS = 'app/bookings/details/view'
export const LOAD_KEY_DATES = 'app/bookings/details/tab/load/keydates'
export const SET_KEYDATES = 'app/bookings/details/tab/set/keydates'
export const CALC_READ_ONLY_VIEW = 'app/bookings/details/readOnlyCalc'

export const SET_SCHEDULED_EVENTS = 'app/bookings/details/scheduled-events/set'
export const LOAD_SCHEDULED_EVENTS = 'app/bookings/details/scheduled-events/load'

export const offenderImageUrl = imageId => {
  if (imageId) {
    return `/app/images/${imageId}/data`
  }
  return '/app/images/placeholder/data'
}

export const offenderFullSizeImageUrl = imageId => {
  if (imageId) {
    return `/app/full-size-image/${imageId}/data`
  }
  return '/app/full-size-image/placeholder/data'
}

export const DETAILS_TABS = {
  OFFENDER_DETAILS: 'personal',
  PHYSICAL_ATTR: 'physical-attributes',
  ALERTS: 'alerts',
  CASE_NOTES: 'case-notes',
  KEY_DATES: 'key-dates',
  QUICK_LOOK: 'quick-look',
  SCHEDULED: 'schedule',
  ADD_APPOINTMENT: 'add-appointment',
  ADD_CASE_NOTE: 'add-case-note',
}

export const DETAILS_ERROR = 'app/bookings/details/error'
export const LOAD_QUICK_LOOK = 'app/bookings/details/quicklook'
export const SET_QUICK_LOOK = 'app/bookings/details/quicklook/set'
export const RESET_QUICK_LOOK = 'RESET_QUICK_LOOK'

export const VIEW_CASENOTE_LIST = 'app/bookings/details/casenotes/view/list'

export const SHOW_LARGE_PHOTO_BOOKING_DETAILS = 'SHOW_LARGE_PHOTO_BOOKING_DETAILS'
export const HIDE_LARGE_PHOTO_BOOKING_DETAILS = 'HIDE_LARGE_PHOTO_BOOKING_DETAILS'
export const SET_LARGE_PHOTO_VISIBILITY = 'SET_PHOTO_VISIBILITY'

export const LOAD_LOCATIONS = 'LOAD_LOCATIONS'
export const SET_LOCATIONS = 'SET_LOCATIONS'

export const ADD_NEW_CASENOTE = {
  BASE: 'app/bookings/details/addNewCaseNote',
  LOADING: 'app/bookings/details/addNewCaseNote/LOADING',
  SUCCESS: 'app/bookings/details/addNewCaseNote/SUCCESS',
  ERROR: 'app/bookings/details/addNewCaseNote/ERROR',
}

export const LOAD_CASE_NOTE = 'app/bookings/details/casenote/load'

export const CASE_NOTE = {
  LOAD: 'LOAD_CASE_NOTE',
  SET: 'SET_CASE_NOTE',
  CLEAR: 'CLEAR_CASE_NOTE',
  ERROR: 'LOAD_CASE_NOTE_ERROR',
}

export const CASE_NOTE_FILTER = {
  BASE: 'app/bookings/details/setCaseNotesQuery',
  LOADING: 'app/bookings/details/setCaseNotesQuery/LOADING',
  SUCCESS: 'app/bookings/details/setCaseNotesQuery/SUCCESS',
  ERROR: 'app/bookings/details/setCaseNotesQuery/ERROR',
}

export const AMEND_CASENOTE = {
  BASE: 'app/bookings/details/amendCaseNote',
  LOADING: 'app/bookings/details/amendCaseNote/LOADING',
  SUCCESS: 'app/bookings/details/amendCaseNote/SUCCESS',
  ERROR: 'app/bookings/details/amendCaseNote/ERROR',
}

export const EXTEND_SESSION = 'EXTEND_SESSION'
