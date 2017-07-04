/*
 *
 * Elite API actions
 *
 */
//
import {
  BOOKINGS,
  IMAGES,
  ALERTTYPES,
  CASENOTETYPES,
  OFFICERS,
  USER,
} from './constants';

export function loadImage(imageId) {
  return {
    type: IMAGES.BASE,
    payload: { imageId },
  };
}

export function loadOfficer(staffId, username) {
  return {
    type: OFFICERS.BASE,
    payload: { staffId, username },
  };
}

export function loadBookingDetails(bookingId) {
  return {
    type: BOOKINGS.DETAILS.BASE,
    payload: { bookingId },
  };
}

export function loadBookingAlerts(bookingId, pagination) {
  return {
    type: BOOKINGS.ALERTS.BASE,
    payload: { bookingId, pagination },
  };
}

export function loadBookingCaseNotes(bookingId, pagination, query) {
  return {
    type: BOOKINGS.CASENOTES.BASE,
    payload: { bookingId, pagination, query },
  };
}

export function resetCaseNotes(bookingId) {
  return {
    type: BOOKINGS.CASENOTES.RESET,
    payload: { bookingId },
  };
}

export function loadAlertTypeDetails(alertType, alertCode) {
  return {
    type: ALERTTYPES.BASE,
    payload: { alertType, alertCode },
  };
}

export function loadCaseNoteTypes(source) {
  return {
    type: CASENOTETYPES.BASE,
    payload: { source },
  };
}

export function addCaseNote({ type, subtype, text, occurrenceDateTime }) {
  return {
    type: CASENOTETYPES.ADDNEW.BASE,
    payload: { type, subtype, text, occurrenceDateTime },
  };
}

export function loadUserCaseLoads() {
  return {
    type: USER.CASELOADS.BASE,
  };
}
export function switchCaseLoad(caseLoadId) {
  return {
    type: USER.SWITCHCASELOAD.BASE,
    payload: { caseLoadId },
  };
}
