import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { DW } from 'components/DesktopWrappers';
import PreviousNextNavigation from 'components/PreviousNextNavigation';
import { selectBookingsSearch } from 'containers/ConfigLoader/selectors';

import { selectDeviceFormat } from 'selectors/app';
import { selectSearchResultsV2, selectSearchQuery, selectSearchResultsTotalRecords, selectSearchResultsPagination, selectResultsView } from '../selectors';

import { viewDetails as vD, setPagination as sP, setResultsView } from '../actions';

import ResultsViewToggle from 'components/ResultsViewToggle';
import { setSearchContext } from 'globalReducers/app';

import EliteImage from 'containers/EliteContainers/Image';

import './index.scss';

/* TODO
   - Disable link or image and show spinner when the user tries to view details
   - Show spinner when sorting / searching
   - Show spinner when navigating pages
   - Hook search up
   - Hook sorting up
   - Format location as per eddies design
 */

const BookingTable = ({results,viewDetails}) => (
  <table>
    <thead>
    <tr>
      <th></th>
      <th> <span> Name </span> </th>
      <th className="visible-md visible-lg"> Aliases</th>
      <th className="visible-md visible-lg"> Date of birth</th>
      <th> ID </th>
      <th> Location </th>
    </tr>
    </thead>
    <tbody>
    {(results || []).map(row =>
      <tr key={row.bookingId}>
        <td>
          <div className="photo"><EliteImage imageId={row.facialImageId} /></div>
        </td>
        <td>
          <span>
            <a href="#" onClick={
              (e) => {
                  e.preventDefault(e);
                  viewDetails(row.bookingId);
               }
              }> {row.lastName}, {row.firstName} </a>
          </span>
        </td>
        <td className="visible-md visible-lg">
          {row.aliases.map(name =>
             <div className="row">
               <span className="col" key={name}>
                 {name}
               </span>
             </div>)}
        </td>
        <td className="visible-md visible-lg">
          <span>{row.dateOfBirth}</span>
        </td>
        <td><span>{row.offenderNo}</span></td>
        <td><span>{row.assignedLivingUnitDesc}</span></td>
      </tr>
    )}
    </tbody>
  </table>
)

const BookingGrid =  ({results,viewDetails}) => (
  <div className="booking-grid">
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

const BookingSearchBox = () => (

  <div className="filterBox">

         <div className="row col-md-4">

          <label className="form-label visible-md visible-lg">
            Enter prisoner Name or ID
          </label>

          <input type="text" className="form-control" placeholder="Enter Name or ID"/>
        </div>

        <div className="row col-md-4">
          <label className="form-label visible-md visible-lg">
            Select location
          </label>

          <select className="form-control">
            <option> Leeds - all</option>
          </select>
        </div>

        <div className="row col-md-3">

          <label className="form-label visible-md visible-lg">
            &nbsp;
          </label>

          <div className="visible-md visible-lg">
              <input type="button" className="button" value="Search again"/>
          </div>

          <div className="visible-xs visible-sm">
            <div className="pull-right">
                <input type="button" className="button" value="Search again"/>
            </div>
          </div>

      </div>
  </div>
)

const ResultsViewBuilder = ({viewName,results,onViewDetails}) => {
  return viewName === 'List' ?
    <BookingTable results={results} viewDetails={onViewDetails}/> :
    <BookingGrid results={results} viewDetails={onViewDetails}/>
}

class SearchResults extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.setSearchContext('search');
  }

  render() {
    const { deviceFormat, searchOptions, searchQuery, viewDetails, totalResults, pagination, setPage, resultsView, setResultsView } = this.props; //eslint-disable-line
    const { perPage: pP, pageNumber: pN } = pagination;
    return (
      <div className="booking-search">
        <div className="row">
          <h1 className="heading-xlarge"> Search results </h1>
          <BookingSearchBox/>
        </div>

        <div className="row toggleAndCountView">
          <ResultsViewToggle resultsView={resultsView} setResultsView={setResultsView} />
          <div>viewing {Math.min((pP * pN) + 1, totalResults)} - {Math.min(pP * (pN + 1), totalResults)} of {totalResults} results.</div>
        </div>


        <div className="row">
           <ResultsViewBuilder viewName={this.props.resultsView} results={this.props.results} onViewDetails={viewDetails}/>
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
