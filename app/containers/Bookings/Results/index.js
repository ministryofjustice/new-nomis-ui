import React, {Component } from 'react';
import PropTypes from 'prop-types';


import { createStructuredSelector } from 'reselect';
import { DW } from 'components/DesktopWrappers';
import PreviousNextNavigation from 'components/PreviousNextNavigation';
import BookingTable from 'components/Bookings/Table';
import { selectBookingsSearch } from 'containers/ConfigLoader/selectors';

import { connect } from 'react-redux';

import SearchAgainForm from './SearchForm'
import { selectDeviceFormat } from 'selectors/app';

import {
  selectSearchResultsV2,
  selectSearchQuery,
  selectSearchResultsTotalRecords,
  selectSearchResultsPagination,
  selectResultsView,
  selectLocations,
  selectSearchResultsSortOrder
} from '../selectors';

import{
  viewDetails as vD,
  setPagination as sP,
  setResultsView,
  loadLocations,
  toggleSortOrder
} from '../actions';

import ResultsViewToggle from 'components/ResultsViewToggle';
import { setSearchContext } from 'globalReducers/app';
import EliteImage from 'containers/EliteContainers/Image';

import './index.scss';

const BookingGrid =  ({results,viewDetails,sortOrderChange,sortOrder}) => (
  <div className="booking-grid">

    <div className="row sortBySelect visible-md visible-lg">
       <span className="col-xs-1">Sort by:</span>
       <select className="form-control" value={sortOrder} onChange={(e) => {
         sortOrderChange(e.target.value)
       }}>
          <option value="asc">Names A to Z</option>
          <option value="desc">Names Z to A</option>
       </select>
    </div>

    {results.map(row => (
       <div className="col-xs-6 col-sm-3" key={row.bookingId}>

         <div className="personBlock">

             <div className="grid-photo" onClick={ () => viewDetails(row.bookingId)}>
                <EliteImage imageId={row.facialImageId} />
             </div>

             <div className="personDetails">
                 <div className="bold">
                   {row.lastName}, {row.firstName}
                 </div>

                 <div>
                   {row.offenderNo}
                 </div>

                <div>
                 {row.dateOfBirth}
                </div>

               <div>
                   {row.assignedLivingUnitDesc}
                 </div>
             </div>

          </div>
       </div>


    ))}
  </div>
)

const ResultsViewBuilder = ({viewName,results,onViewDetails,sortOrderChange,sortOrder}) => {
  return viewName === 'List' ?
    <BookingTable results={results} viewDetails={onViewDetails} sortOrderChange={sortOrderChange} sortOrder={sortOrder}/> :
    <BookingGrid results={results} viewDetails={onViewDetails} sortOrderChange={sortOrderChange} sortOrder={sortOrder}/>
}

class SearchResults extends Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.setSearchContext('search');
    this.props.loadLocations();
  }

  render() {
    const { deviceFormat, searchOptions, searchQuery, viewDetails, totalResults, pagination, setPage, resultsView, setResultsView } = this.props; //eslint-disable-line
    const { perPage: pP, pageNumber: pN } = pagination;

    return (
      <div className="booking-search">

        <div className="row">
          <h1 className="heading-xlarge"> Search results </h1>
          <SearchAgainForm locations={this.props.locations} />
        </div>

        <div className="row toggleAndCountView">
           {totalResults >0 ?
             <div>
               <ResultsViewToggle resultsView={resultsView} setResultsView={setResultsView} />
               <div>viewing {Math.min((pP * pN) + 1, totalResults)} - {Math.min(pP * (pN + 1), totalResults)} of {totalResults} results.</div>
             </div>
             : null}
        </div>

        <div className="row">
            {totalResults > 0 ?
              <ResultsViewBuilder
                viewName={this.props.resultsView}
                results={this.props.results}
                onViewDetails={viewDetails}
                sortOrderChange={this.props.toggleSortOrder}
                sortOrder={this.props.sortOrder}/> :

              <h1 className="bold-medium">Your search criteria returned no results.</h1>
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
  locations: PropTypes.array
};

SearchResults.defaultProps = {
  deviceFormat: 'desktop',
  searchOptions: [],
  totalResults: 0,
  searchQuery: {},
  resultsView: 'List',
  setResultsView: () => {},
  setSearchContext: () => {},
  locations: []
};

export function mapDispatchToProps(dispatch) {
  return {
    viewDetails: (bookingId) => dispatch(vD(bookingId, true)),
    setPage: (pagination) => dispatch(sP(pagination)),
    setResultsView: (pagination) => dispatch(setResultsView(pagination)),
    setSearchContext: (context) => dispatch(setSearchContext(context)),
    loadLocations: () => dispatch(loadLocations()),
    toggleSortOrder: () => dispatch(toggleSortOrder())
  }
};

const mapStateToProps = createStructuredSelector({
  deviceFormat: selectDeviceFormat(),
  results: selectSearchResultsV2(),
  searchOptions: selectBookingsSearch(),
  searchQuery: selectSearchQuery(),
  totalResults: selectSearchResultsTotalRecords(),
  pagination: selectSearchResultsPagination(),
  resultsView: selectResultsView(),
  locations: selectLocations(),
  sortOrder: selectSearchResultsSortOrder()
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
