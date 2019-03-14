import { LOAD_CASE_NOTE_TYPES_SUBTYPES, LOAD_ALERT_TYPES } from '../EliteApiLoader/constants'

import {
  VIEW_DETAILS,
  UPDATE_PAGINATION,
  UPDATE_RESULTS_VIEW,
  VIEW_CASENOTE_LIST,
  ADD_NEW_CASENOTE,
  SHOW_LARGE_PHOTO_BOOKING_DETAILS,
  HIDE_LARGE_PHOTO_BOOKING_DETAILS,
  LOAD_LOCATIONS,
  LOAD_KEY_DATES,
  LOAD_QUICK_LOOK,
  LOAD_SCHEDULED_EVENTS,
  NEW_SEARCH,
  EXTEND_SESSION,
  RESET_QUICK_LOOK,
} from './constants'

export function loadLocations(offset) {
  return {
    type: LOAD_LOCATIONS,
    payload: offset,
  }
}

export function showLargePhoto(imageId) {
  return {
    type: SHOW_LARGE_PHOTO_BOOKING_DETAILS,
    payload: { imageId },
  }
}

export function hideLargePhoto(imageId) {
  return {
    type: HIDE_LARGE_PHOTO_BOOKING_DETAILS,
    payload: { imageId },
  }
}

export function viewDetails(offenderNo, activeTabId, itemId) {
  const shouldUseItemId = activeTabId === 'case-notes'
  return {
    meta: { debounce: 'simple' },
    type: VIEW_DETAILS,
    payload: { offenderNo, activeTabId, itemId: shouldUseItemId ? itemId : null },
  }
}

export function setPagination(pagination) {
  return {
    type: UPDATE_PAGINATION,
    payload: pagination,
  }
}
export function toggleSort(currentDirection, pagination) {
  const sortOrder = currentDirection === 'ASC' ? 'DESC' : 'ASC'
  const sortFields = 'lastName,firstName'
  return {
    type: UPDATE_PAGINATION,
    payload: { ...pagination, sortFields, sortOrder },
  }
}

export function changeSort(value, pagination) {
  const arr = value.split(':')
  const sortFields = arr[0].split(',')
  const sortOrder = arr[1]
  return {
    type: UPDATE_PAGINATION,
    payload: { ...pagination, sortFields, sortOrder },
  }
}

export function changePerPage(perPage, pagination) {
  return {
    type: UPDATE_PAGINATION,
    payload: { ...pagination, perPage },
  }
}

export function addNewCaseNote({ offenderNo, type, subType, occurrenceDateTime }) {
  return {
    meta: { debounce: 'simple' },
    type: ADD_NEW_CASENOTE.BASE,
    payload: { offenderNo, type, subType, occurrenceDateTime },
  }
}

export function setResultsView(view) {
  return {
    type: UPDATE_RESULTS_VIEW,
    payload: view,
  }
}

export function setCaseNotesListView() {
  return {
    type: VIEW_CASENOTE_LIST,
  }
}

export function loadKeyDates(offenderNo) {
  return {
    type: LOAD_KEY_DATES,
    payload: offenderNo,
  }
}

export function resetQuickLook() {
  return {
    type: RESET_QUICK_LOOK,
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
  }
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

export function loadAlertTypes() {
  return {
    type: LOAD_ALERT_TYPES,
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
        sortFields: ['lastName', 'firstName'],
      },
    },
  }
}

export function extendActiveSession() {
  return {
    type: EXTEND_SESSION,
  }
}
