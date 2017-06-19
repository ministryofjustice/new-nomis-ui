import { createSelector } from 'reselect';
import { selectEliteApi } from 'containers/EliteApiLoader/selectors';
import { paginationHash, idsFromPagination } from 'containers/EliteApiLoader/helpers';

const selectAssignment = () => (state) => state.get('assignments');

const selectAssignmentPagination = () => createSelector(
  selectAssignment(),
  (assState) => assState.get('pagination').toJS()
);
const selectAssignmentsView = () => createSelector(
  selectAssignment(),
  (assState) => assState.get('view')
);
const selectAssignmentSortOrder = () => createSelector(
  selectAssignment(),
  (assState) => assState.get('sortOrder')
);

const selectBookings = () => createSelector(
  selectEliteApi(),
  (eliteApiState) => eliteApiState.get('Bookings')
);

const selectBookingSummaries = () => createSelector(
  selectBookings(),
  (bookingsState) => bookingsState.get('Summaries')
);

const selectBookingsSearch = () => createSelector(
  selectBookings(),
  (bookingsState) => bookingsState.get('Search')
);

const selectAssignmentsSearch = () => createSelector(
  selectBookingsSearch(),
  (bookingsSearchState) => bookingsSearchState.get('officerAssignments')
);

const selectAssignmentTotal = () => createSelector(
  selectAssignmentsSearch(),
  (assSearchState) => assSearchState ? assSearchState.getIn(['MetaData', 'TotalRecords']) : 0
);

const selectAssignmentSortResults = () => createSelector(
  selectAssignmentsSearch(),
  selectAssignmentSortOrder(),
  (assignmentsSearchState, sortOrder) => assignmentsSearchState.getIn(['Sorted', sortOrder])
);

const selectAssignmentsPaginationStatus = () => createSelector(
  selectAssignmentSortResults(),
  selectAssignmentPagination(),
  (assignmentsSortedState, pagination) => assignmentsSortedState.getIn(['Paginations', paginationHash(pagination), 'Status', 'Type'])
);

const selectAssignmentSortedIds = () => createSelector(
    selectAssignmentSortResults(),
    (sortState) => sortState.get('SortedIds')
);

const selectAssignmentResults = () => createSelector(
  selectAssignmentSortedIds(),
  selectAssignmentsPaginationStatus(),
  selectAssignmentPagination(),
  selectBookingSummaries(),
  (assignmentSortedIds, pageStatus, pagination, bookingSummariesStates) => {
    const results = idsFromPagination(pagination).map((sortId) => {
      try {
        return bookingSummariesStates.get(assignmentSortedIds.get(sortId));
      } catch (e) {
        return undefined;
      }
    });
    // Filter out any undefined results.
    return results.filter((x) => x);
  }
);


export {
  selectAssignmentPagination,
  selectAssignmentsView,
  selectAssignmentSortOrder,
  selectAssignmentTotal,
  selectAssignmentResults,
};
