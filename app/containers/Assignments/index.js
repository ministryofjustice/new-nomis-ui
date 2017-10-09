import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PreviousNextNavigation from 'components/PreviousNextNavigation';
import ResultsViewToggle from 'components/ResultsViewToggle';
import ResultsViewToggleMobile from 'components/ResultsViewToggle/mobile';
import NavLink from 'components/NavLink';
import { selectDeviceFormat } from 'selectors/app';
import { viewDetails as vD } from 'containers/Bookings/actions';
import AssignmentsHeader from 'components/AssignmentsHeader';
import AssignmentsHeaderMobile from 'components/AssignmentsHeader/mobile';
import { setSearchContext } from 'globalReducers/app';
import BookingTable from 'components/Bookings/Table';
import BookingGrid from 'components/Bookings/Grid';
import HandleBookingLoadingStatus from 'components/Bookings/HandleBookingLoadingStatus';


import { selectUser } from '../Authentication/selectors';

import {
  setAssignmentsPagination,
  setAssignmentsView,
  toggleAssignmentsSortOrder,
} from './actions';

import {
  selectAssignmentsResults,
  selectAssignmentsTotal,
  selectAssignmentsPagination,
  selectAssignmentsView,
  selectAssignmentsSortOrder,
} from './selectors';

import {
  selectLoadingBookingDetailsStatus,
} from '../EliteApiLoader/selectors';

const Results = ({ resultsView, results, viewDetails }) => resultsView === 'List' ?
    <BookingTable viewName={resultsView} results={results} viewDetails={viewDetails} />
    :
    <BookingGrid viewName={resultsView} results={results} viewDetails={viewDetails} />

class Assignments extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.setSearchContext('assignments');
  }

  render() {
    const { sortOrder,results,toggleSortOrder,deviceFormat, searchOptions, searchQuery, viewDetails, totalResults, pagination, setPage, resultsView, setResultsView, user,loadingStatus } = this.props; //eslint-disable-line
    const { perPage: pP } = pagination;

    return (
      <div>
        { deviceFormat === 'desktop' ?
          <AssignmentsHeader
            resultsViewToggle={<ResultsViewToggle resultsView={resultsView} setResultsView={setResultsView} />}
            user={user} options={{ assignments: totalResults }}
          />
          :
          <div>
            <NavLink route="/" key="Home" text="Home" />
            <AssignmentsHeaderMobile user={user} options={{ assignments: totalResults }} />
            <ResultsViewToggleMobile resultsView={resultsView} setResultsView={setResultsView} />
          </div>
        }

        <HandleBookingLoadingStatus {...this.props} >

          <Results {...this.props} />
          <PreviousNextNavigation pagination={pagination} totalRecords={totalResults} pageAction={(id) => { setPage({ perPage: pP, pageNumber: id }); }} />

        </HandleBookingLoadingStatus>
      </div>
    );
  }
}

Assignments.propTypes = {
  deviceFormat: PropTypes.string,
  results: PropTypes.array.isRequired,
  viewDetails: PropTypes.func.isRequired,
  searchQuery: PropTypes.object,
  totalResults: PropTypes.number,
  pagination: PropTypes.object.isRequired,
  setPage: PropTypes.func.isRequired,
  resultsView: PropTypes.string.isRequired,
  setResultsView: PropTypes.func.isRequired,
  setSearchContext: PropTypes.func,
};

Assignments.defaultProps = {
  deviceFormat: 'desktop',
  searchOptions: [],
  totalResults: 0,
  searchQuery: {},
  user: PropTypes.object.isRequired,
  setSearchContext: () => {},
};

export function mapDispatchToProps(dispatch) {
  return {
    viewDetails: (bookingId) => dispatch(vD(bookingId)),
    setPage: (pagination) => dispatch(setAssignmentsPagination(pagination)),
    setResultsView: (view) => dispatch(setAssignmentsView(view)),
    setSearchContext: (context) => dispatch(setSearchContext(context)),
    toggleSortOrder: () => dispatch(toggleAssignmentsSortOrder()),
  };
}

const mapStateToProps = createStructuredSelector({
  deviceFormat: selectDeviceFormat(),
  results: selectAssignmentsResults(),
  totalResults: selectAssignmentsTotal(),
  pagination: selectAssignmentsPagination(),
  resultsView: selectAssignmentsView(),
  user: selectUser(),
  sortOrder: selectAssignmentsSortOrder(),
  loadingStatus: selectLoadingBookingDetailsStatus(),

});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Assignments);
