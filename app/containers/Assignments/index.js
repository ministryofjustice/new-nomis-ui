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

import BookingsListItem from 'containers/Bookings/Results/BookingsListItem';
import BookingsGridItem from 'containers/Bookings/Results/BookingsGridItem';
import { BookingList, BookingGrid } from 'containers/Bookings/Results/results.theme';

import AssignmentsHeader from 'components/AssignmentsHeader';
import AssignmentsHeaderMobile from 'components/AssignmentsHeader/mobile';
import { selectUser } from '../Authentication/selectors';

import { setAssignmentsPagination, setAssignmentsView } from './actions';
import { selectAssignmentResults, selectAssignmentTotal, selectAssignmentPagination, selectAssignmentsView } from './selectors';

import { setSearchContext } from 'globalReducers/app';

class Assignments extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.setSearchContext('assignments');
  }

  render() {
    const { deviceFormat, searchOptions, searchQuery, viewDetails, totalResults, pagination, setPage, resultsView, setResultsView, user } = this.props; //eslint-disable-line
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
          <BookingList>
            {this.props.results ? this.props.results.map((data) => <BookingsListItem key={data.bookingId} data={data} action={viewDetails} />) : null}
          </BookingList> :
          <BookingGrid>
            {this.props.results ? this.props.results.map((data) => <BookingsGridItem key={data.bookingId} data={data} action={viewDetails} />) : null}
          </BookingGrid>
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
  };
}

const mapStateToProps = createStructuredSelector({
  deviceFormat: selectDeviceFormat(),
  results: selectAssignmentResults(),
  totalResults: selectAssignmentTotal(),
  pagination: selectAssignmentPagination(),
  resultsView: selectAssignmentsView(),
  user: selectUser(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Assignments);
