import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PreviousNextNavigation from 'components/PreviousNextNavigation';
import BookingTable from 'components/Bookings/Table';
import BookingGrid from 'components/Bookings/Grid';
import NoSearchResultsReturnedMessage from 'components/NoSearchResultsReturnedMessage';
import { List, Map } from 'immutable';
import { connect } from 'react-redux';
import ResultsViewToggle from 'components/ResultsViewToggle';
import { Model as searchModel } from 'helpers/dataMappers/search';

import SearchAgainForm from './SearchForm';

import './index.scss';

import {
  viewDetails as vD,
  setPagination as sP,
  toggleSort,
  setResultsView,
  loadLocations,
} from '../actions';

import { NEW_SEARCH, DETAILS_TABS } from '../constants';

const ResultsViewBuilder = ({ viewName, results, onViewDetails, sortOrderChange, sortOrder }) => viewName === 'List' ?
  <BookingTable results={results} viewDetails={onViewDetails} sortOrderChange={sortOrderChange} sortOrder={sortOrder} /> :
  <BookingGrid results={results} viewDetails={onViewDetails} sortOrderChange={sortOrderChange} sortOrder={sortOrder} />;

class SearchResults extends Component {

  componentDidMount() {
    this.refs.focuspoint.scrollIntoView();
    this.props.loadLocations();
    this.loadSearch();
  }

  componentDidUpdate(prevProps) {
    if (!Map(prevProps.location.query).equals(Map(this.props.location.query))) {
      this.loadSearch();
    }
  }

  loadSearch() {
    const { locationPrefix, keywords, perPage, pageNumber, sortOrder } = this.props.location.query;
    const pagination = (perPage && pageNumber) ? { perPage, pageNumber } : this.props.pagination;

    if (locationPrefix) {
      this.props.getSearchResults({ locationPrefix, keywords, pagination, sortOrder });
    }
  }

  render() {
    const {
      locations,
      sortOrder,
      viewDetails,
      results,
      totalResults,
      pagination,
      setPage,
      resultsView,
      shouldShowSpinner,
    } = this.props;

    const { perPage: pP, pageNumber: pN } = pagination;
    const { query } = this.props.location;

    return (
      <div className="booking-search">

        <div className="row" ref="focuspoint">
          <h1 className="heading-xlarge add-gutter-top"> Search results </h1>
          <SearchAgainForm locations={locations} query={query} />
        </div>

        <div className="row toggle-and-count-view">
          {totalResults > 0 ?
            <div>
              <ResultsViewToggle resultsView={resultsView} setResultsView={this.props.setResultsView} />
              <div>{Math.min((pP * pN) + 1, totalResults)} - {Math.min(pP * (pN + 1), totalResults)} of {totalResults} results</div>
            </div>
            : null}
        </div>

        <div className="row">

          {!shouldShowSpinner && <NoSearchResultsReturnedMessage resultCount={results.size} /> }

          {totalResults > 0 &&
              <ResultsViewBuilder
                viewName={resultsView}
                results={results}
                onViewDetails={viewDetails}
                sortOrderChange={() => this.props.toggleSortOrder(sortOrder)}
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

export function mapDispatchToProps(dispatch, props) {
  return {
    viewDetails: (offenderNo) => dispatch(vD(offenderNo, DETAILS_TABS.OFFENDER_DETAILS)),
    setPage: (pagination) => dispatch(sP({ ...props.location.query, ...pagination })),
    setResultsView: (pagination) => dispatch(setResultsView(pagination)),
    loadLocations: () => dispatch(loadLocations()),
    toggleSortOrder: (currentDirection) => dispatch(toggleSort(currentDirection, props.location.query)),
    getSearchResults: (query) => dispatch({ type: NEW_SEARCH, payload: { query } }),
  };
}

const mapStateToProps = (state, props) => {
  const results = state.getIn(['search', 'results']) || searchModel.get('results');
  const { perPage, pageNumber, sortOrder } = props.location.query;
  const totalResults = state.getIn(['search', 'totalResults']) || searchModel.get('totalResults');
  const resultsView = state.getIn(['search', 'resultsView']) || searchModel.get('resultsView');
  const locations = state.getIn(['search', 'details', 'locations']) || searchModel.getIn(['details', 'location']);
  const shouldShowSpinner = state.getIn(['app', 'shouldShowSpinner']);

  let pagination = state.getIn(['search', 'pagination']);

  if (perPage && pageNumber) {
    pagination = Map({ perPage: Number(perPage), pageNumber: Number(pageNumber) });
  }

  return {
    results,
    totalResults,
    pagination: pagination.toJS(),
    resultsView,
    locations,
    sortOrder,
    shouldShowSpinner,
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
