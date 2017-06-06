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
} from './constants';

export function search(searchObj) {
  return {
    type: SEARCH,
    searchObj,
  };
}

export function viewDetails(bookingId) {
  return {
    type: VIEW_DETAILS,
    payload: { bookingId },
  };
}

export function setPagination(pagination) {
  return {
    type: UPDATE_PAGINATION,
    payload: pagination,
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
