import {
  LOAD_ASSIGNMENTS,
  UPDATE_ASSIGNMENTS_PAGINATION,
  UPDATE_ASSIGNMENTS_VIEW,
  TOGGLE_ASSIGNMENTS_SORT_ORDER,
} from './constants';

export const loadAssignments = (resetPagination) => ({
  type: LOAD_ASSIGNMENTS,
  payload: { resetPagination },
});

export const setAssignmentsPagination = (pagination) => ({
  type: UPDATE_ASSIGNMENTS_PAGINATION,
  payload: { pagination },
});

export const setAssignmentsView = (view) => ({
  type: UPDATE_ASSIGNMENTS_VIEW,
  payload: { view },
});

export const toggleAssignmentsSortOrder = (sortOrder) => ({
  type: TOGGLE_ASSIGNMENTS_SORT_ORDER,
  payload: sortOrder,
});
