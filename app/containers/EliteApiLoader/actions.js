import { BOOKINGS, CASENOTETYPES, OFFICERS, USER, APPOINTMENT } from './constants'

export function loadOfficer(staffId, username) {
  return {
    type: OFFICERS.BASE,
    payload: { staffId, username },
  }
}

export function loadBookingDetails(offenderNo) {
  return {
    type: BOOKINGS.DETAILS.BASE,
    payload: { offenderNo },
  }
}

export function loadBookingAlerts(offenderNo, pagination, filter, alertStatus) {
  return {
    type: BOOKINGS.ALERTS.BASE,
    payload: { offenderNo, pagination, filter, alertStatus },
  }
}

export function loadBookingCaseNotes(offenderNo, query) {
  return {
    type: BOOKINGS.CASENOTES.BASE,
    payload: { offenderNo, query },
  }
}

export function resetCaseNotes(offenderNo) {
  return {
    type: BOOKINGS.CASENOTES.RESET,
    payload: { offenderNo },
  }
}

export function loadCaseNoteTypes(source) {
  return {
    type: CASENOTETYPES.BASE,
    payload: { source },
  }
}

export function addCaseNote({ type, subtype, text, occurrenceDateTime }) {
  return {
    type: CASENOTETYPES.ADDNEW.BASE,
    payload: { type, subtype, text, occurrenceDateTime },
  }
}

export function loadUserCaseLoads() {
  return {
    type: USER.CASELOADS.BASE,
  }
}

export function loadAppointmentViewModel(agencyId) {
  return {
    type: APPOINTMENT.LOAD_VIEW_MODEL,
    payload: agencyId,
  }
}

export function loadExistingEvents(agencyId, date, offenderNo) {
  return {
    type: APPOINTMENT.LOAD_EXISTING_EVENTS,
    payload: { agencyId, date, offenderNo },
  }
}
