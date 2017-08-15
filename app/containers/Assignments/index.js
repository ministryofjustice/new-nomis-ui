import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ContentWrapper } from 'components/DesktopWrappers';
import PreviousNextNavigation from 'components/PreviousNextNavigation';
import ResultsViewToggle from 'components/ResultsViewToggle';
import ResultsViewToggleMobile from 'components/ResultsViewToggle/mobile';

import { selectDeviceFormat } from 'selectors/app';
import { viewDetails as vD } from 'containers/Bookings/actions';

import AssignmentsHeader from 'components/AssignmentsHeader';
import AssignmentsHeaderMobile from 'components/AssignmentsHeader/mobile';
import { selectUser } from '../Authentication/selectors';

import { setAssignmentsPagination, setAssignmentsView } from './actions';
import {toggleSortOrder} from '../Bookings/actions';
import {selectSearchResultsSortOrder} from '../Bookings/selectors';

import { selectAssignmentResults, selectAssignmentTotal, selectAssignmentPagination, selectAssignmentsView } from './selectors';

import { setSearchContext } from 'globalReducers/app';

import BookingTable from 'components/Bookings/Table';
import BookingGrid from 'components/Bookings/Grid';

class Assignments extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.setSearchContext('assignments');
  }

  render() {
    const { sortOrder,results,toggleSortOrder,deviceFormat, searchOptions, searchQuery, viewDetails, totalResults, pagination, setPage, resultsView, setResultsView, user } = this.props; //eslint-disable-line
    const { perPage: pP } = pagination;

    return (
      <ContentWrapper>
        { deviceFormat === 'desktop' ?
          <AssignmentsHeader
            resultsViewToggle={<ResultsViewToggle resultsView={resultsView} setResultsView={setResultsView} />}
            user={user} options={{assignments: totalResults}} />
          :
          <div>
            <AssignmentsHeaderMobile user={user} options={{assignments: totalResults}} />
            <ResultsViewToggleMobile resultsView={resultsView} setResultsView={setResultsView} />
          </div>
        }

        {resultsView === 'List' ?
          <BookingTable viewName={resultsView}
                        results={results}
                        viewDetails={viewDetails}
                        sortOrderChange={toggleSortOrder}
                        sortOrder={sortOrder}/> :

          <BookingGrid viewName={resultsView}
                       results={results}
                       viewDetails={viewDetails}
                       sortOrderChange={toggleSortOrder}
                       sortOrder={sortOrder}/>
        }

        <PreviousNextNavigation pagination={pagination} totalRecords={totalResults} pageAction={(id) => { setPage({ perPage: pP, pageNumber: id }); }} />
      </ContentWrapper>
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
    viewDetails: (bookingId) => dispatch(vD(bookingId, true)),
    setPage: (pagination) => dispatch(setAssignmentsPagination(pagination)),
    setResultsView: (view) => dispatch(setAssignmentsView(view)),
    setSearchContext: (context) => dispatch(setSearchContext(context)),
    toggleSortOrder: () => dispatch(toggleSortOrder())
  };
}

const mapStateToProps = createStructuredSelector({
  deviceFormat: selectDeviceFormat(),
  results: selectAssignmentResults(),
  totalResults: selectAssignmentTotal(),
  pagination: selectAssignmentPagination(),
  resultsView: selectAssignmentsView(),
  user: selectUser(),
  sortOrder: selectSearchResultsSortOrder()
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Assignments);
