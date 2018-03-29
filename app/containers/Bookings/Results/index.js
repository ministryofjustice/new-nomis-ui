import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { createStructuredSelector } from 'reselect';
import PreviousNextNavigation from 'components/PreviousNextNavigation';
import BookingTable from 'components/Bookings/Table';
import BookingGrid from 'components/Bookings/Grid';
import NoSearchResultsReturnedMessage from 'components/NoSearchResultsReturnedMessage';
import { List } from 'immutable';
import { connect } from 'react-redux';
import ResultsViewToggle from 'components/ResultsViewToggle';
import { setSearchContext } from 'globalReducers/app';
import { selectShouldShowSpinner } from 'selectors/app';
import SearchAgainForm from './SearchForm';
import './index.scss';

import {
  selectSearchResultsV2,
  selectSearchResultsTotalRecords,
  selectSearchResultsPagination,
  selectResultsView,
  selectLocations,
  selectSearchResultsSortOrder,
} from '../selectors';

import {
  selectLoadingBookingDetailsStatus,
} from '../../EliteApiLoader/selectors';

import {
  viewDetails as vD,
  setPagination as sP,
  setResultsView,
  loadLocations,
  toggleSortOrder,
} from '../actions';

import { NEW_SEARCH, DETAILS_TABS } from '../constants';

const ResultsViewBuilder = ({ viewName, results, onViewDetails, sortOrderChange, sortOrder, router }) => viewName === 'List' ?
  <BookingTable results={results} viewDetails={onViewDetails} sortOrderChange={sortOrderChange} sortOrder={sortOrder} /> :
  <BookingGrid results={results} viewDetails={onViewDetails} sortOrderChange={sortOrderChange} sortOrder={sortOrder} />;

class SearchResults extends Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.loadLocations();
  }

  componentDidMount() {
    this.refs.focuspoint.scrollIntoView();

    const { locationPrefix, keywords, perPage, pageNumber } = this.props.location.query;

    let pagination;

    if (perPage && pageNumber) {
      pagination = { perPage, pageNumber };
    }

    if (locationPrefix || keywords) {
      this.props.getSearchResults({ locationPrefix, keywords, pagination })
    }
  }

  render() {
    const {
      locations, sortOrder, toggleSortOrder, viewDetails, results, totalResults, pagination, setPage, resultsView, setResultsView, loadingStatus, shouldShowSpinner} = this.props; //eslint-disable-line
    const { perPage: pP, pageNumber: pN } = pagination;

    return (
      <div className="booking-search">

        <div className="row" ref="focuspoint">
          <h1 className="heading-xlarge add-gutter-top"> Search results </h1>
          {shouldShowSpinner === false && <SearchAgainForm locations={locations} /> }
        </div>

         <div className="row toggle-and-count-view">
            {totalResults > 0 ?
              <div>
                <ResultsViewToggle resultsView={resultsView} setResultsView={setResultsView} />
                <div>{Math.min((pP * pN) + 1, totalResults)} - {Math.min(pP * (pN + 1), totalResults)} of {totalResults} results</div>
              </div>
               : null}
          </div>

          <div className="row">

            <NoSearchResultsReturnedMessage resultCount={results.size} />

            {totalResults > 0 &&
              <ResultsViewBuilder
                viewName={resultsView}
                results={results}
                onViewDetails={viewDetails}
                sortOrderChange={toggleSortOrder}
                sortOrder={sortOrder}
              />
            }
          </div>

          <div className="row">
            <PreviousNextNavigation pagination={pagination} totalRecords={totalResults} pageAction={(id) => { setPage({ perPage: pP, pageNumber: id }); }} />
          </div>

      </div>
    );
  }
}

SearchResults.propTypes = {
  results: ImmutablePropTypes.list.isRequired,
  viewDetails: PropTypes.func.isRequired,
  totalResults: PropTypes.number,
  pagination: PropTypes.object.isRequired,
  setPage: PropTypes.func.isRequired,
  resultsView: PropTypes.string,
  setResultsView: PropTypes.func,
  locations: ImmutablePropTypes.list,
};

SearchResults.defaultProps = {
  results: List([]),
  totalResults: 0,
  resultsView: 'List',
  setResultsView: () => {},
  locations: List([]),
};

export function mapDispatchToProps(dispatch) {
  return {
    viewDetails: (offenderNo) => dispatch(vD(offenderNo, DETAILS_TABS.OFFENDER_DETAILS)),
    setPage: (pagination) => dispatch(sP(pagination)),
    setResultsView: (pagination) => dispatch(setResultsView(pagination)),
    loadLocations: () => dispatch(loadLocations()),
    toggleSortOrder: () => dispatch(toggleSortOrder()),
    getSearchResults: (query) => dispatch({ type: NEW_SEARCH, payload: { query, resetPagination: true } }),
  };
}

const mapStateToProps = createStructuredSelector({
  results: selectSearchResultsV2(),
  totalResults: selectSearchResultsTotalRecords(),
  pagination: selectSearchResultsPagination(),
  resultsView: selectResultsView(),
  locations: selectLocations(),
  sortOrder: selectSearchResultsSortOrder(),
  loadingStatus: selectLoadingBookingDetailsStatus(),
  shouldShowSpinner: selectShouldShowSpinner(),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
