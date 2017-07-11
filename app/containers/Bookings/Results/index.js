import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { DW } from 'components/DesktopWrappers';
import PreviousNextNavigation from 'components/PreviousNextNavigation';
import { selectBookingsSearch } from 'containers/ConfigLoader/selectors';
import ResultsViewToggle from 'components/ResultsViewToggle';
import ResultsViewToggleMobile from 'components/ResultsViewToggle/mobile';

import { selectDeviceFormat } from 'selectors/app';
import { selectSearchResultsV2, selectSearchQuery, selectSearchResultsTotalRecords, selectSearchResultsPagination, selectResultsView } from '../selectors';

import { viewDetails as vD, setPagination as sP, setResultsView } from '../actions';

import QueryModifier from './QueryModifier';
import BookingsListItem from './BookingsListItem';
import BookingsGridItem from './BookingsGridItem';
import { BookingList, BookingGrid } from './results.theme';

import { setSearchContext } from 'globalReducers/app';

class SearchResults extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.setSearchContext('search');
  }

  render() {
    const { deviceFormat, searchOptions, searchQuery, viewDetails, totalResults, pagination, setPage, resultsView, setResultsView } = this.props; //eslint-disable-line
    const { perPage: pP, pageNumber: pN } = pagination;
    return (
      <DW>
        { deviceFormat === 'desktop' ?
          <div>
            <QueryModifier searchOptions={searchOptions} searchQuery={searchQuery} />
            <div>viewing {Math.min((pP * pN) + 1, totalResults)} - {Math.min(pP * (pN + 1), totalResults)} of {totalResults} results.</div>
            <ResultsViewToggle resultsView={resultsView} setResultsView={setResultsView} />
          </div>
          : <ResultsViewToggleMobile resultsView={resultsView} setResultsView={setResultsView} />
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
      </DW>
    );
  }
}

SearchResults.propTypes = {
  deviceFormat: PropTypes.string,
  results: PropTypes.array.isRequired,
  viewDetails: PropTypes.func.isRequired,
  searchOptions: PropTypes.array,
  searchQuery: PropTypes.object,
  totalResults: PropTypes.number,
  pagination: PropTypes.object.isRequired,
  setPage: PropTypes.func.isRequired,
  resultsView: PropTypes.string,
  setResultsView: PropTypes.func,
  setSearchContext: PropTypes.func,
};

SearchResults.defaultProps = {
  deviceFormat: 'desktop',
  searchOptions: [],
  totalResults: 0,
  searchQuery: {},
  resultsView: 'List',
  setResultsView: () => {},
  setSearchContext: () => {},
};

export function mapDispatchToProps(dispatch) {
  return {
    viewDetails: (bookingId) => dispatch(vD(bookingId, true)),
    setPage: (pagination) => dispatch(sP(pagination)),
    setResultsView: (pagination) => dispatch(setResultsView(pagination)),
    setSearchContext: (context) => dispatch(setSearchContext(context)),
  };
}

const mapStateToProps = createStructuredSelector({
  deviceFormat: selectDeviceFormat(),
  results: selectSearchResultsV2(),
  searchOptions: selectBookingsSearch(),
  searchQuery: selectSearchQuery(),
  totalResults: selectSearchResultsTotalRecords(),
  pagination: selectSearchResultsPagination(),
  resultsView: selectResultsView(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
