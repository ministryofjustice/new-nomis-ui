import {
  LOAD_ASSIGNMENTS,
  UPDATE_ASSIGNMENTS_PAGINATION,
  UPDATE_ASSIGNMENTS_VIEW,
} from './constants';

export const loadAssignments = () => ({
  type: LOAD_ASSIGNMENTS,
});

export const setAssignmentsPagination = (pagination) => ({
  type: UPDATE_ASSIGNMENTS_PAGINATION,
  payload: { pagination },
});

export const setAssignmentsView = (view) => ({
  type: UPDATE_ASSIGNMENTS_VIEW,
  payload: { view },
});
