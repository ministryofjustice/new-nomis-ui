import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactRouterPropTypes from 'react-router-prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List, Map } from 'immutable'
import { connect } from 'react-redux'
import { BREAKPOINTS } from '@govuk-react/constants'
import PreviousNextNavigation, { paginationType } from '../../../components/PreviousNextNavigation'
import BookingResultsTable from '../../../components/Bookings/BookingsResultsTable'
import BookingGrid from '../../../components/Bookings/Grid'
import NoSearchResultsReturnedMessage from '../../../components/NoSearchResultsReturnedMessage'
import ResultsViewToggle from '../../../components/ResultsViewToggle'
import searchModel from '../../../helpers/dataMappers/search'
import { getQueryParams } from '../../../helpers'
import SearchAgainForm from './SearchForm'

import './index.scss'

import {
  viewDetails as vD,
  setPagination as sP,
  toggleSort,
  setResultsView,
  loadLocations,
  changeSort,
  changePerPage,
} from '../actions'

import { NEW_SEARCH, DETAILS_TABS } from '../constants'
import Page from '../../../components/Page'
import PerPageDropdown from './elements/PerPageDropdown'

const SortContainer = styled.div`
  display: none;

  @media screen and (min-width: ${BREAKPOINTS.DESKTOP}) {
    display: flex;
    padding: 15px 0;
  }
`

const ResultsViewBuilder = ({
  viewName,
  results,
  onViewDetails,
  sortOrderChange,
  sortOrder,
  showAlertTabForOffenderNo,
}) =>
  viewName === 'List' ? (
    <BookingResultsTable
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

ResultsViewBuilder.propTypes = {
  viewName: PropTypes.string.isRequired,
  results: ImmutablePropTypes.list.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  sortOrderChange: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  showAlertTabForOffenderNo: PropTypes.func.isRequired,
}

class SearchResults extends Component {
  componentDidMount() {
    const { boundLoadLocations } = this.props
    this.focusPoint.scrollIntoView()
    boundLoadLocations()
    this.loadSearch()
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props
    if (prevProps.location.search !== location.search) {
      this.loadSearch()
    }
  }

  loadSearch() {
    const { getSearchResults, location, pagination } = this.props
    const queryParams = getQueryParams(location.search)
    const { locationPrefix, keywords, alerts, perPage, pageNumber, sortOrder, sortFields } = queryParams
    const paginationParam = perPage && pageNumber ? { perPage, pageNumber } : pagination

    if (locationPrefix) {
      getSearchResults({
        locationPrefix,
        keywords,
        alerts: alerts || [],
        pagination: paginationParam,
        sortFields,
        sortOrder,
      })
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
      location: { search },
      setResultsViewDispatch,
      toggleSortOrder,
      changeSortDispatch,
      changePerPageDispatch,
    } = this.props
    const query = getQueryParams(search)

    const SortDropdown = ({ viewName }) => (
      <div>
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
      <Page title="Offender search results" showPrint>
        <div className="booking-search">
          <div className="row" ref={focusPoint}>
            <SearchAgainForm locations={locations} query={query} />
          </div>

          <div className="toggle-and-count-view">
            {totalResults > 0 ? (
              <Fragment>
                <span>
                  {Math.min(pP * pN + 1, totalResults)} - {Math.min(pP * (pN + 1), totalResults)} of {totalResults}{' '}
                  results
                </span>
                <ResultsViewToggle resultsView={resultsView} setResultsView={setResultsViewDispatch} />
              </Fragment>
            ) : null}
          </div>

          <SortContainer>
            <SortDropdown viewName={resultsView} />
            <PerPageDropdown handleChange={changePerPageDispatch} totalResults={totalResults} perPage={pP} />
          </SortContainer>

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
      </Page>
    )
  }
}

SearchResults.propTypes = {
  // mapStateToProps
  sortFields: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
  sortOrder: PropTypes.string.isRequired,
  shouldShowSpinner: PropTypes.number.isRequired,

  results: ImmutablePropTypes.list,
  totalResults: PropTypes.number,
  pagination: paginationType.isRequired,
  resultsView: PropTypes.string,
  locations: ImmutablePropTypes.list,

  // mapDispatchToProps
  viewDetails: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  setResultsViewDispatch: PropTypes.func.isRequired,
  boundLoadLocations: PropTypes.func.isRequired,
  toggleSortOrder: PropTypes.func.isRequired,
  changeSortDispatch: PropTypes.func.isRequired,
  changePerPageDispatch: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  showAlertTabForOffenderNo: PropTypes.func.isRequired,

  // special
  location: ReactRouterPropTypes.location.isRequired,
}

SearchResults.defaultProps = {
  results: List([]),
  totalResults: 0,
  resultsView: 'List',
  locations: List([]),
}

const mapDispatchToProps = (dispatch, props) => {
  const queryParams = getQueryParams(props.location.search)

  return {
    viewDetails: offenderNo => dispatch(vD(offenderNo, DETAILS_TABS.QUICK_LOOK)),
    setPage: pagination => dispatch(sP({ ...queryParams, ...pagination })),
    setResultsViewDispatch: pagination => dispatch(setResultsView(pagination)),
    boundLoadLocations: () => dispatch(loadLocations()),
    toggleSortOrder: currentDirection => dispatch(toggleSort(currentDirection, queryParams)),
    changeSortDispatch: value => dispatch(changeSort(value, queryParams)),
    changePerPageDispatch: value => dispatch(changePerPage(value, queryParams)),
    getSearchResults: query => dispatch({ type: NEW_SEARCH, payload: { query } }),
    showAlertTabForOffenderNo: offenderNo => dispatch(vD(offenderNo, DETAILS_TABS.ALERTS)),
  }
}

const mapStateToProps = (state, props) => {
  const queryParams = getQueryParams(props.location.search)
  const results = state.getIn(['search', 'results']) || searchModel.get('results')
  const { perPage, pageNumber, sortFields, sortOrder } = queryParams
  const totalResults = state.getIn(['search', 'totalResults']) || searchModel.get('totalResults')
  const resultsView = state.getIn(['search', 'resultsView']) || searchModel.get('resultsView')
  const locations = state.getIn(['search', 'details', 'locations']) || searchModel.getIn(['details', 'location'])
  const shouldShowSpinner = state.getIn(['app', 'shouldShowSpinner'])

  const pagination =
    perPage && pageNumber
      ? Map({ perPage: Number(perPage), pageNumber: Number(pageNumber) })
      : state.getIn(['search', 'pagination'])

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
