/*
 *
 * Authentication actions
 *
 */

import {
  SEARCH,
  VIEW_DETAILS,
  SET_DETAILS_TAB,
  UPDATE_PAGINATION,
  UPDATE_RESULTS_VIEW,
  UPDATE_ALERTS_PAGINATION,
  UPDATE_CASENOTES_PAGINATION,
  VIEW_CASENOTE_DETAILS,
  VIEW_CASENOTE_LIST,
  SET_ADD_CASENOTE_MODAL,
  ADD_NEW_CASENOTE,
  SET_AMEND_CASENOTE_MODAL,
  SHOW_LARGE_PHOTO_BOOKING_DETAILS,
  HIDE_LARGE_PHOTO_BOOKING_DETAILS,
  LOAD_LOCATIONS,
  TOGGLE_SORT_ORDER,
  LOAD_KEY_DATES,
  LOAD_QUICK_LOOK,
  LOAD_SCHEDULED_ACTIVITIES,
} from './constants';


export function loadLocations(offset) {
  return {
    type: LOAD_LOCATIONS,
    payload: offset,
  };
}

export function showLargePhoto(imageId) {
  return {
    type: SHOW_LARGE_PHOTO_BOOKING_DETAILS,
    payload: { imageId },
  };
}

export function hideLargePhoto(imageId) {
  return {
    type: HIDE_LARGE_PHOTO_BOOKING_DETAILS,
    payload: { imageId },
  };
}

export function search(searchObj) {
  return {
    type: SEARCH,
    searchObj,
  };
}

export function viewDetails(bookingId, activeTabId) {
  return {
    meta: { debounce: 'simple' },
    type: VIEW_DETAILS,
    payload: { bookingId, activeTabId },
  };
}

export function setPagination(pagination) {
  return {
    type: UPDATE_PAGINATION,
    payload: pagination,
  };
}

export function setAlertPagination(bookingId, pagination) {
  return {
    type: UPDATE_ALERTS_PAGINATION,
    payload: { bookingId, pagination },
  };
}

export function setCaseNotesPagination(bookingId, pagination, query) {
  return {
    type: UPDATE_CASENOTES_PAGINATION,
    payload: { bookingId, pagination, query },
  };
}

export function openAddCaseNoteModal() {
  return {
    type: SET_ADD_CASENOTE_MODAL,
    payload: true,
  };
}
export function closeAddCaseNoteModal() {
  return {
    type: SET_ADD_CASENOTE_MODAL,
    payload: false,
  };
}
export function openAmendCaseNoteModal() {
  return {
    type: SET_AMEND_CASENOTE_MODAL,
    payload: true,
  };
}
export function closeAmendCaseNoteModal() {
  return {
    type: SET_AMEND_CASENOTE_MODAL,
    payload: false,
  };
}
export function addNewCaseNote({ bookingId, type, subType, occurrenceDateTime }) {
  return {
    meta: { debounce: 'simple' },
    type: ADD_NEW_CASENOTE.BASE,
    payload: { bookingId, type, subType, occurrenceDateTime },
  };
}

export function setDetailsTab(activeTabId) {
  return {
    type: SET_DETAILS_TAB,
    payload: { activeTabId },
  };
}

export function setResultsView(view) {
  return {
    type: UPDATE_RESULTS_VIEW,
    payload: view,
  };
}

export function setCaseNotesDetailView(caseNoteId) {
  return {
    type: VIEW_CASENOTE_DETAILS,
    payload: { caseNoteId },
  };
}
export function setCaseNotesListView() {
  return {
    type: VIEW_CASENOTE_LIST,
  };
}
export function toggleSortOrder(sortOrder) {
  return {
    type: TOGGLE_SORT_ORDER,
    payload: sortOrder,
  };
}

export function loadKeyDates(bookingId) {
  return {
    type: LOAD_KEY_DATES,
    payload: bookingId,
  }
}

export function loadQuickLook(bookingId) {
  return {
    type: LOAD_QUICK_LOOK,
    payload: bookingId,
  }
}

export function resetCaseNoteFilterFormField(field) {
  return {
    type: '@@redux-form/CHANGE',
    meta: {
      form: 'caseNoteFilter',
      touched: false,
      persistentSubmitErrors: false,
      field,
    },
    payload: null,
  };
}

export function loadScheduledActivitiesForThisWeek(bookingId) {
  return {
    type: LOAD_SCHEDULED_ACTIVITIES,
    payload: {
      bookingId,
    },
  }
}

export function loadScheduledActivitiesForNextWeek(bookingId) {
  return {
    type: LOAD_SCHEDULED_ACTIVITIES,
    payload: {
      bookingId,
      nextWeek: true,
    },
  }
}
