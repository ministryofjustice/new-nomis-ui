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
//import BookingsListItem from './BookingsListItem';
import BookingsGridItem from './BookingsGridItem';
import { BookingList, BookingGrid } from './results.theme';

import { setSearchContext } from 'globalReducers/app';

import EliteImage from 'containers/EliteContainers/Image';

import "./index.scss";

const BookingTable = ({results}) => (
  <table>
    <thead>
    <tr>
      <th></th>
      <th> Name</th>
      <th className="visible-md visible-lg"> Aliases</th>
      <th className="visible-md visible-lg"> Date of birth</th>
      <th> Id </th>
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
          <span><a href="#"> {row.lastName}, {row.firstName} </a></span>
        </td>
        <td className="visible-md visible-lg">
          {row.aliases.map(name =>
             <div className="row">
               <span className="col">
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

const BookingSearchBox = () => (

  <div className="booking-search filterBox container">

  <div className="row col-md-4 col-xs-12">

    <label className="form-label visible-md visible-lg">
      Enter prisoner Name or Id
    </label>

    <input type="text" className="form-control" placeholder="Enter Name or Id"/>
  </div>

  <div className="row col-md-4 col-xs-12">
    <label className="form-label visible-md visible-lg">
      Select location
    </label>

    <select className="form-control">
      <option> Leeds - all</option>
    </select>
  </div>

  <div className="row col-md-3 col-xs-12">

    <label className="form-label visible-md visible-lg">
      &nbsp;
    </label>

    <input type="button" className="button" value="Search again"/>

  </div>

</div>
)

class SearchResults extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.setSearchContext('search');
  }

  render() {
    const { deviceFormat, searchOptions, searchQuery, viewDetails, totalResults, pagination, setPage, resultsView, setResultsView } = this.props; //eslint-disable-line
    const { perPage: pP, pageNumber: pN } = pagination;
    return (
      <div>

        <BookingSearchBox/>

        {resultsView === 'List' ?
          <BookingTable results={this.props.results}/>  :

          <BookingGrid>
            {this.props.results ? this.props.results.map((data) => <BookingsGridItem key={data.bookingId} data={data} action={viewDetails} />) : null}
          </BookingGrid>
        }

        <PreviousNextNavigation pagination={pagination} totalRecords={totalResults} pageAction={(id) => { setPage({ perPage: pP, pageNumber: id }); }} />
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
