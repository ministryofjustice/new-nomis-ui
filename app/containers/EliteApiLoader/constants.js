// User Data
export const USER = {
  CASELOADS: {
    BASE: 'app/eliteApiLoader/user/caseload',
    LOADING: 'app/eliteApiLoader/user/caseload/loading',
    SUCCESS: 'app/eliteApiLoader/user/caseload/success',
    ERROR: 'app/eliteApiLoader/user/caseload/error',
  },
  SWITCHCASELOAD: {
    BASE: 'app/eliteApiLoader/user/switchCaseload',
    LOADING: 'app/eliteApiLoader/user/switchCaseload/loading',
    SUCCESS: 'app/eliteApiLoader/user/switchCaseload/success',
    ERROR: 'app/eliteApiLoader/user/switchCaseload/error',
  },
  ASSIGNEDINMATES: {
    BASE: 'app/eliteApiLoader/user/assignments',
    LOADING: 'app/eliteApiLoader/user/assignments/loading',
    SUCCESS: 'app/eliteApiLoader/user/assignments/success',
    ERROR: 'app/eliteApiLoader/user/assignments/error',
  },
  ROLES: {
    BASE: 'app/eliteApiLoader/user/role',
    LOADING: 'app/eliteApiLoader/user/role/loading',
    SUCCESS: 'app/eliteApiLoader/user/role/success',
    ERROR: 'app/eliteApiLoader/user/role/error',
  },
}

export const LOAD_CASE_NOTE_TYPES_SUBTYPES = 'app/eliteApiLoader/loadCaseNotesTypesAndSubTypes'

export const LOAD_ALERT_TYPES = 'app/eliteApiLoader/loadAlertTypes'

// Bookings

// Bookings/Search
export const BOOKINGS = {
  CLEAR: 'app/eliteApiLoader/bookings/CLEAR',
  SEARCH: {
    BASE: 'app/eliteApiLoader/bookings/SEARCH',
    LOADING: 'app/eliteApiLoader/bookings/SEARCH/loading',
    SUCCESS: 'app/eliteApiLoader/bookings/SEARCH/success',
    ERROR: 'app/eliteApiLoader/bookings/SEARCH/error',
  },
  DETAILS: {
    BASE: 'app/eliteApiLoader/bookings/DETAILS',
    SUCCESS: 'app/eliteApiLoader/bookings/DETAILS/success',
    ERROR: 'app/eliteApiLoader/bookings/DETAILS/error',
  },
  ALERTS: {
    BASE: 'app/eliteApiLoader/bookings/ALERTS',
    LOADING: 'app/eliteApiLoader/bookings/ALERTS/loading',
    SUCCESS: 'app/eliteApiLoader/bookings/ALERTS/success',
    ERROR: 'app/eliteApiLoader/bookings/ALERTS/error',
  },
  CASENOTES: {
    BASE: 'app/eliteApiLoader/bookings/CASENOTES',
    RESET: 'app/eliteApiLoader/bookings/CASENOTES/reload',
    LOADING: 'app/eliteApiLoader/bookings/CASENOTES/loading',
    SUCCESS: 'app/eliteApiLoader/bookings/CASENOTES/success',
    ERROR: 'app/eliteApiLoader/bookings/CASENOTES/error',
    SET_PAGINATION: 'app/eliteApiLoader/bookings/CASENOTES/set-pagination',
    VIEW_DETAILS: 'app/eliteApiLoader/bookings/CASENOTES/view-details',
  },
}

// Add new Casenote
export const ELITE_ADD_CASENOTE = {
  BASE: 'app/eliteApiLoader/ADD_CASENOTE',
  LOADING: 'app/eliteApiLoader/ADD_CASENOTE/loading',
  SUCCESS: 'app/eliteApiLoader/ADD_CASENOTE/success',
  ERROR: 'app/eliteApiLoader/ADD_CASENOTE/error',
}

// Users/Officer Data
export const OFFICERS = {
  BASE: 'app/eliteApiLoader/OFFICERS',
  LOADING: 'app/eliteApiLoader/OFFICERS/loading',
  SUCCESS: 'app/eliteApiLoader/OFFICERS/success',
  ERROR: 'app/eliteApiLoader/OFFICERS/error',
}

// Locations
export const LOCATIONS = {
  BASE: 'app/eliteApiLoader/LOCATIONS',
  LOADING: 'app/eliteApiLoader/LOCATIONS/loading',
  SUCCESS: 'app/eliteApiLoader/LOCATIONS/success',
  ERROR: 'app/eliteApiLoader/LOCATIONS/error',
}
// CaseNoteTypes
export const CASENOTETYPES = {
  BASE: 'app/eliteApiLoader/CASENOTETYPES',
  PRELOAD: {
    LOADING: 'app/eliteApiLoader/CASENOTETYPES/loading',
    SUCCESS: 'app/eliteApiLoader/CASENOTETYPES/success',
    ERROR: 'app/eliteApiLoader/CASENOTETYPES/error',
  },
}

export const APPOINTMENT = {
  LOAD_VIEW_MODAL: 'app/bookings/details/loadViewModel',
  SET_VIEW_MODEL: 'app/bookings/details/setViewModel',
  ADD: 'app/bookings/details/addAppointment',
  SUCCESS: 'app/bookings/details/addAppointment/SUCCESS',
  ERROR: 'app/bookings/details/addAppointment/ERROR',
}

export const ALLCASENOTETYPESUBTYPEDATA = 'allCaseNoteTypeSubTypeData'
export const ALL_ALERT_TYPES_DATA = 'allAlertTypesData'
