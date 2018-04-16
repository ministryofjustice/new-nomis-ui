
import { LOAD_CASE_NOTE_TYPES_SUBTYPES } from 'containers/EliteApiLoader/constants';

import {
  VIEW_DETAILS,
  UPDATE_PAGINATION,
  UPDATE_RESULTS_VIEW,
  UPDATE_ALERTS_PAGINATION,
  UPDATE_CASENOTES_PAGINATION,
  VIEW_CASENOTE_LIST,
  ADD_NEW_CASENOTE,
  SHOW_LARGE_PHOTO_BOOKING_DETAILS,
  HIDE_LARGE_PHOTO_BOOKING_DETAILS,
  LOAD_LOCATIONS,
  TOGGLE_SORT_ORDER,
  LOAD_KEY_DATES,
  LOAD_QUICK_LOOK,
  LOAD_SCHEDULED_EVENTS,
  NEW_SEARCH,
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

export function viewDetails(offenderNo, activeTabId) {
  return {
    meta: { debounce: 'simple' },
    type: VIEW_DETAILS,
    payload: { offenderNo, activeTabId },
  };
}

export function setPagination(pagination) {
  return {
    type: UPDATE_PAGINATION,
    payload: pagination,
  };
}

export function setAlertPagination(offenderNo, pagination) {
  return {
    type: UPDATE_ALERTS_PAGINATION,
    payload: { offenderNo, pagination },
  };
}

export function setCaseNotesPagination(offenderNo, pagination, query) {
  return {
    type: UPDATE_CASENOTES_PAGINATION,
    payload: { offenderNo, pagination, query },
  };
}

export function addNewCaseNote({ offenderNo, type, subType, occurrenceDateTime }) {
  return {
    meta: { debounce: 'simple' },
    type: ADD_NEW_CASENOTE.BASE,
    payload: { offenderNo, type, subType, occurrenceDateTime },
  };
}

export function setResultsView(view) {
  return {
    type: UPDATE_RESULTS_VIEW,
    payload: view,
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

export function loadKeyDates(offenderNo) {
  return {
    type: LOAD_KEY_DATES,
    payload: offenderNo,
  }
}

export function loadQuickLook(offenderNo) {
  return {
    type: LOAD_QUICK_LOOK,
    payload: offenderNo,
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

export function loadScheduledEventsForThisWeek(offenderNo) {
  return {
    type: LOAD_SCHEDULED_EVENTS,
    payload: {
      offenderNo,
    },
  }
}

export function loadScheduledEventsForNextWeek(offenderNo) {
  return {
    type: LOAD_SCHEDULED_EVENTS,
    payload: {
      offenderNo,
      nextWeek: true,
    },
  }
}

export function loadCaseNoteTypesAndSubTypes() {
  return {
    type: LOAD_CASE_NOTE_TYPES_SUBTYPES,
  }
}

export function bookingSearch(formData) {
  return {
    type: NEW_SEARCH,
    payload: {
      query: {
        ...formData,
        locationPrefix: formData.locationPrefix,
        pagination: {
          perPage: 10,
          pageNumber: 0,
        },
        sortOrder: 'ASC',
      },
    },
  }
}
