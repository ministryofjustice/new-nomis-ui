import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List, Map } from 'immutable'
import { connect } from 'react-redux'
import PreviousNextNavigation from '../../../components/PreviousNextNavigation'
import BookingTable from '../../../components/Bookings/Table'
import BookingGrid from '../../../components/Bookings/Grid'
import NoSearchResultsReturnedMessage from '../../../components/NoSearchResultsReturnedMessage'
import ResultsViewToggle from '../../../components/ResultsViewToggle'
import searchModel from '../../../helpers/dataMappers/search'

import SearchAgainForm from './SearchForm'

import './index.scss'

import {
  viewDetails as vD,
  setPagination as sP,
  toggleSort,
  setResultsView,
  loadLocations,
  changeSort,
} from '../actions'

import { NEW_SEARCH, DETAILS_TABS } from '../constants'

const ResultsViewBuilder = ({
  viewName,
  results,
  onViewDetails,
  sortOrderChange,
  sortOrder,
  showAlertTabForOffenderNo,
}) =>
  viewName === 'List' ? (
    <BookingTable
      results={results}
      viewDetails={onViewDetails}
      sortOrderChange={sortOrderChange}
      sortOrder={sortOrder}
      onAlertFlagClick={showAlertTabForOffenderNo}
    />
  ) : (
    <BookingGrid
      results={results}
      viewDetails={onViewDetails}
      sortOrderChange={sortOrderChange}
      sortOrder={sortOrder}
    />
  )

class SearchResults extends Component {
  componentDidMount() {
    const { boundLoadLocations } = this.props
    this.focusPoint.scrollIntoView()
    boundLoadLocations()
    this.loadSearch()
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props
    if (JSON.stringify(prevProps.location.query) !== JSON.stringify(location.query)) {
      this.loadSearch()
    }
  }

  loadSearch() {
    const { getSearchResults, location, pagination } = this.props
    const { locationPrefix, keywords, alerts, perPage, pageNumber, sortOrder, sortFields } = location.query
    const paginationParam = perPage && pageNumber ? { perPage, pageNumber } : pagination

    if (locationPrefix) {
      getSearchResults({ locationPrefix, keywords, alerts, pagination: paginationParam, sortFields, sortOrder })
    }
  }

  render() {
    const {
      locations,
      sortFields,
      sortOrder,
      viewDetails,
      results,
      totalResults,
      pagination,
      pagination: { perPage: pP, pageNumber: pN },
      setPage,
      resultsView,
      shouldShowSpinner,
      showAlertTabForOffenderNo,
      location: { query },
      setResultsViewDispatch,
      toggleSortOrder,
      changeSortDispatch,
    } = this.props

    const SortDropdown = ({ viewName }) => (
      <div className="col-md-4 visible-md visible-lg add-gutter-margin-top">
        <label className="form-label" htmlFor="sorting">
          <b>Order results by</b>
        </label>
        <select
          id="sorting"
          className="form-control"
          name="sorting"
          onChange={event => changeSortDispatch(event.target.value)}
          defaultValue={sortFields && `${sortFields.join ? sortFields.join(',') : sortFields}:${sortOrder}`}
        >
          <option value="lastName,firstName:ASC">Surname, First name A-Z</option>
          <option value="lastName,firstName:DESC">Surname, First name Z-A</option>
          <option value="assignedLivingUnitDesc:ASC">Location (cell number 1 to X)</option>
          <option value="assignedLivingUnitDesc:DESC">Location (cell number X to 1)</option>
          {viewName === 'List' && <option value="dateOfBirth:DESC">Age (youngest to oldest)</option>}
          {viewName === 'List' && <option value="dateOfBirth:ASC">Age (oldest to youngest)</option>}
        </select>
      </div>
    )

    const focusPoint = el => {
      this.focusPoint = el
    }

    return (
      <div className="booking-search">
        <div className="row" ref={focusPoint}>
          <h1 className="heading-xlarge add-gutter-top"> Search results </h1>
          <SearchAgainForm locations={locations} query={query} />
        </div>

        <div className="row toggle-and-count-view">
          {totalResults > 0 ? (
            <div>
              <div className="col-xs-6 col-sm-4 col-md-3">
                {Math.min(pP * pN + 1, totalResults)} - {Math.min(pP * (pN + 1), totalResults)} of {totalResults}{' '}
                results
              </div>
              <ResultsViewToggle resultsView={resultsView} setResultsView={setResultsViewDispatch} />
            </div>
          ) : null}
        </div>

        <div className="row">
          <SortDropdown viewName={resultsView} />
        </div>

        <div className="row">
          {!shouldShowSpinner && <NoSearchResultsReturnedMessage resultCount={results.size} />}

          {totalResults > 0 && (
            <ResultsViewBuilder
              viewName={resultsView}
              results={results}
              onViewDetails={viewDetails}
              sortOrderChange={() => toggleSortOrder(sortOrder)}
              sortOrder={sortOrder}
              showAlertTabForOffenderNo={showAlertTabForOffenderNo}
            />
          )}
        </div>

        <div className="row">
          <PreviousNextNavigation
            pagination={pagination}
            totalRecords={totalResults}
            pageAction={id => {
              setPage({ perPage: pP, pageNumber: id })
            }}
          />
        </div>
      </div>
    )
  }
}

SearchResults.propTypes = {
  results: ImmutablePropTypes.list,
  viewDetails: PropTypes.func.isRequired,
  totalResults: PropTypes.number,
  pagination: PropTypes.object.isRequired,
  setPage: PropTypes.func.isRequired,
  resultsView: PropTypes.string,
  setResultsViewDispatch: PropTypes.func.isRequired,
  locations: ImmutablePropTypes.list,
}

SearchResults.defaultProps = {
  results: List([]),
  totalResults: 0,
  resultsView: 'List',
  locations: List([]),
}

export function mapDispatchToProps(dispatch, props) {
  return {
    viewDetails: offenderNo => dispatch(vD(offenderNo, DETAILS_TABS.QUICK_LOOK)),
    setPage: pagination => dispatch(sP({ ...props.location.query, ...pagination })),
    setResultsViewDispatch: pagination => dispatch(setResultsView(pagination)),
    boundLoadLocations: () => dispatch(loadLocations()),
    toggleSortOrder: currentDirection => dispatch(toggleSort(currentDirection, props.location.query)),
    changeSortDispatch: value => dispatch(changeSort(value, props.location.query)),
    getSearchResults: query => dispatch({ type: NEW_SEARCH, payload: { query } }),
    showAlertTabForOffenderNo: offenderNo => dispatch(vD(offenderNo, DETAILS_TABS.ALERTS)),
  }
}

const mapStateToProps = (state, props) => {
  const results = state.getIn(['search', 'results']) || searchModel.get('results')
  const { perPage, pageNumber, sortFields, sortOrder } = props.location.query
  const totalResults = state.getIn(['search', 'totalResults']) || searchModel.get('totalResults')
  const resultsView = state.getIn(['search', 'resultsView']) || searchModel.get('resultsView')
  const locations = state.getIn(['search', 'details', 'locations']) || searchModel.getIn(['details', 'location'])
  const shouldShowSpinner = state.getIn(['app', 'shouldShowSpinner'])

  let pagination = state.getIn(['search', 'pagination'])

  if (perPage && pageNumber) {
    pagination = Map({ perPage: Number(perPage), pageNumber: Number(pageNumber) })
  }

  return {
    results,
    totalResults,
    pagination: pagination.toJS(),
    resultsView,
    locations,
    sortFields,
    sortOrder,
    shouldShowSpinner,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResults)
