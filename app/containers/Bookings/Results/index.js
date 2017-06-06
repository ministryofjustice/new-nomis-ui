import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { DW } from 'components/DesktopWrappers';
import Pagination from 'components/Pagination';
import MobileNextResultsPage from 'components/MobileNextResultsPage';
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
// const displaySearchResult = (inmate) => <div key={inmate.bookingId}>name: {inmate.firstName} {inmate.lastName}</div>;

class SearchResults extends PureComponent { // eslint-disable-line react/prefer-stateless-function

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

        {/* <div>{Array(Math.ceil(totalResults / pP)).fill(0).map((_, id) => <div onClick={() => { setPage({ perPage: pP, pageNumber: id }); }}>{id}</div>)}</div> */}

        {resultsView === 'List' ?
          <BookingList>
            {this.props.results ? this.props.results.map((data) => <BookingsListItem key={data.bookingId} data={data} action={viewDetails} />) : null}
          </BookingList> :
          <BookingGrid>
            {this.props.results ? this.props.results.map((data) => <BookingsGridItem key={data.bookingId} data={data} action={viewDetails} />) : null}
          </BookingGrid>
        }
        { deviceFormat === 'desktop' ?
          <Pagination pagination={pagination} totalRecords={totalResults} pageAction={(id) => { setPage({ perPage: pP, pageNumber: id }); }} /> :
          <MobileNextResultsPage pagination={pagination} totalRecords={totalResults} pageAction={(id) => { setPage({ perPage: pP, pageNumber: id }); }} />
        }
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
};

SearchResults.defaultProps = {
  deviceFormat: 'desktop',
  searchOptions: [],
  totalResults: 0,
  searchQuery: {},
  resultsView: 'List',
  setResultsView: () => {},
};

export function mapDispatchToProps(dispatch) {
  return {
    viewDetails: (bookingId) => dispatch(vD(bookingId, true)),
    setPage: (pagination) => dispatch(sP(pagination)),
    setResultsView: (pagination) => dispatch(setResultsView(pagination)),
    // onSubmitForm: createFormAction((payload) => ({ type: SEARCH, payload }), [SEARCH_SUCCESS, SEARCH_ERROR]), //onSubmitActions(SEARCH, SEARCH_SUCCESS, SEARCH_ERROR), // (x) => { console.log(x); }, //
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
