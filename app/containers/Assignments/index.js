import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PreviousNextNavigation from 'components/PreviousNextNavigation';
import ResultsViewToggle from 'components/ResultsViewToggle';
import ResultsViewToggleMobile from 'components/ResultsViewToggle/mobile';
import { selectDeviceFormat } from 'selectors/app';
import { viewDetails as vD } from 'containers/Bookings/actions';
import AssignmentsHeader from 'components/AssignmentsHeader';
import AssignmentsHeaderMobile from 'components/AssignmentsHeader/mobile';
import { setSearchContext } from 'globalReducers/app';
import BookingTable from 'components/Bookings/Table';
import BookingGrid from 'components/Bookings/Grid';

import {
  setAssignmentsPagination,
  setAssignmentsView,
  toggleAssignmentsSortOrder,
} from './actions';

const Results = ({ resultsView, results, viewDetails }) => resultsView === 'List' ?
    <BookingTable viewName={resultsView} results={results} viewDetails={viewDetails} />
    :
    <BookingGrid viewName={resultsView} results={results} viewDetails={viewDetails} />

class Assignments extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.setContext('assignments');
  }

  render() {
    const {
      deviceFormat,
      totalResults, 
      pagination, 
      setPage, 
      resultsView, 
      setResultsView, 
      user,
      error,
    } = this.props;

    const { perPage } = pagination;

    return (
      <div>
        { deviceFormat === 'desktop' ?
          <AssignmentsHeader
            resultsViewToggle={<ResultsViewToggle resultsView={resultsView} setResultsView={setResultsView} />}
            user={user} options={{ assignments: totalResults }}
          />
          :
          <div>
            <AssignmentsHeaderMobile user={user} options={{ assignments: totalResults }} />
            <ResultsViewToggleMobile resultsView={resultsView} setResultsView={setResultsView} />
          </div>
        }

        {error && 
        <div className="error-summary">
            <div className="error-message"> {error} </div>
        </div>}

        <Results {...this.props} />
        <PreviousNextNavigation pagination={pagination} totalRecords={totalResults} pageAction={(id) => { setPage({ perPage, pageNumber: id }); }} />

      </div>
    );
  }
}

Assignments.propTypes = {
  deviceFormat: PropTypes.string,
  pagination: PropTypes.object.isRequired,
  setPage: PropTypes.func.isRequired,
  resultsView: PropTypes.string.isRequired,
  setResultsView: PropTypes.func.isRequired,
  setContext: PropTypes.func,
};

Assignments.defaultProps = {
  deviceFormat: 'desktop',
  searchOptions: [],
  totalResults: 0,
  searchQuery: {},
  user: PropTypes.object.isRequired,
  setContext: () => {},
};

export function mapDispatchToProps(dispatch) {
  return {
    viewDetails: (bookingId) => dispatch(vD(bookingId)),
    setPage: (pagination) => dispatch(setAssignmentsPagination(pagination)),
    setResultsView: (view) => dispatch(setAssignmentsView(view)),
    setContext: (context) => dispatch(setSearchContext(context)),
    toggleSortOrder: () => dispatch(toggleAssignmentsSortOrder()),
  };
}

const mapStateToProps = (imustate) => {
  const state = imustate.toJS();
  const officerAssignments = state.eliteApiLoader.Bookings.Search.officerAssignments;

  const assignments = officerAssignments && {
    results: officerAssignments.results,
    totalResults: officerAssignments.meta && officerAssignments.meta.totalRecords,
    pagination: officerAssignments.pagination,
    error: officerAssignments.error,
  };

  const props = {
    ...assignments,
    deviceFormat: state.app.deviceFormat,
    resultsView: state.assignments.view,
    user: state.authentication.user,
    sortOrder: state.assignments.sortOrder,
  };

  return props;
};

export default connect(mapStateToProps, mapDispatchToProps)(Assignments);
