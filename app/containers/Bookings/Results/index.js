import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PreviousNextNavigation from 'components/PreviousNextNavigation'
import BookingTable from 'components/Bookings/Table'
import BookingGrid from 'components/Bookings/Grid'
import NoSearchResultsReturnedMessage from 'components/NoSearchResultsReturnedMessage'
import { List, Map } from 'immutable'
import { connect } from 'react-redux'
import ResultsViewToggle from 'components/ResultsViewToggle'
import { Model as searchModel } from 'helpers/dataMappers/search'

import SearchAgainForm from './SearchForm'

import './index.scss'

import { viewDetails as vD, setPagination as sP, toggleSort, setResultsView, loadLocations } from '../actions'

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
    this.refs.focuspoint.scrollIntoView()
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
    const { locationPrefix, keywords, alerts, perPage, pageNumber, sortOrder } = location.query
    const paginationParam = perPage && pageNumber ? { perPage, pageNumber } : pagination

    if (locationPrefix) {
      getSearchResults({ locationPrefix, keywords, alerts, pagination: paginationParam, sortOrder })
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
      pagination: { perPage: pP, pageNumber: pN },
      setPage,
      resultsView,
      shouldShowSpinner,
      showAlertTabForOffenderNo,
      location: { query },
      setResultsViewDispatch,
      toggleSortOrder,
    } = this.props

    return (
      <div className="booking-search">
        <div className="row" ref="focuspoint">
          <h1 className="heading-xlarge add-gutter-top"> Search results </h1>
          <SearchAgainForm locations={locations} query={query} />
        </div>

        <div className="row toggle-and-count-view">
          {totalResults > 0 ? (
            <div>
              <ResultsViewToggle resultsView={resultsView} setResultsView={setResultsViewDispatch} />
              <div>
                {Math.min(pP * pN + 1, totalResults)} - {Math.min(pP * (pN + 1), totalResults)} of {totalResults}{' '}
                results
              </div>
            </div>
          ) : null}
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
    getSearchResults: query => dispatch({ type: NEW_SEARCH, payload: { query } }),
    showAlertTabForOffenderNo: offenderNo => dispatch(vD(offenderNo, DETAILS_TABS.ALERTS)),
  }
}

const mapStateToProps = (state, props) => {
  const results = state.getIn(['search', 'results']) || searchModel.get('results')
  const { perPage, pageNumber, sortOrder } = props.location.query
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
    sortOrder,
    shouldShowSpinner,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchResults)
