import { createSelector } from 'reselect';
import { selectEliteApi } from 'containers/EliteApiLoader/selectors';
import { paginationHash, idsFromPagination } from 'containers/EliteApiLoader/helpers';

const selectAssignments = () => (state) => state.get('assignments');

const selectAssignmentsPagination = () => createSelector(
  selectAssignments(),
  (assState) => assState.get('pagination').toJS()
);

const selectAssignmentsView = () => createSelector(
  selectAssignments(),
  (assState) => assState.get('view')
);

const selectAssignmentsSortOrder = () => createSelector(
  selectAssignments(),
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

const selectAssignmentsTotal = () => createSelector(
  selectAssignmentsSearch(),
  (assSearchState) => assSearchState ? assSearchState.getIn(['MetaData', 'TotalRecords']) : 0
);

const selectAssignmentSortResults = () => createSelector(
  selectAssignmentsSearch(),
  selectAssignmentsSortOrder(),
  (assignmentsSearchState, sortOrder) => assignmentsSearchState.getIn(['Sorted', sortOrder])
);

const selectAssignmentsPaginationStatus = () => createSelector(
  selectAssignmentSortResults(),
  selectAssignmentsPagination(),
  (assignmentsSortedState, pagination) =>
      assignmentsSortedState && assignmentsSortedState.getIn(['Paginations', paginationHash(pagination), 'Status', 'Type'])
);

const selectAssignmentSortedIds = () => createSelector(
    selectAssignmentSortResults(),
    (sortState) => sortState && sortState.get('SortedIds')
);

const selectAssignmentsResults = () => createSelector(
  selectAssignmentSortedIds(),
  selectAssignmentsPaginationStatus(),
  selectAssignmentsPagination(),
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
  selectAssignmentsPagination,
  selectAssignmentsView,
  selectAssignmentsSortOrder,
  selectAssignmentsTotal,
  selectAssignmentsResults,
};
