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
} from './constants';

export function loadImage(imageId) {
  return {
    type: IMAGES.BASE,
    payload: { imageId },
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
