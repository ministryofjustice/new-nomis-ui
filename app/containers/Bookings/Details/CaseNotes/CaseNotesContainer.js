import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ReactRouterPropTypes from 'react-router-prop-types'
import { Map } from 'immutable'
import { connect } from 'react-redux'

import { DETAILS_TABS } from '../../constants'
import { loadBookingCaseNotes } from '../../../EliteApiLoader/actions'
import { loadCaseNoteTypesAndSubTypes, updateCaseNoteResultsPerPage } from '../../actions'
import { Model as caseNoteModel } from '../../../../helpers/dataMappers/caseNotes'
import { buildCaseNotQueryString } from '../../../../utils/stringUtils'

import CaseNoteList from './CaseNoteList'
import { caseNoteQueryType, userType } from '../../../../types'
import { getQueryParams } from '../../../../helpers'
import history from '../../../../history'

class CaseNotes extends Component {
  componentDidMount() {
    if (window) {
      window.scrollTo(0, 0)
    }

    const { loadCaseNotes, loadTypesSubTypes, offenderNo, query } = this.props

    loadTypesSubTypes()
    loadCaseNotes(offenderNo, query)
  }

  componentWillReceiveProps(props) {
    const { caseNotes } = this.props
    if (this.props && caseNotes !== props.caseNotes) {
      window.scrollTo(0, 0)
    }
  }

  componentDidUpdate(prevProps) {
    const { query, loadCaseNotes, offenderNo } = this.props
    if (!Map(prevProps.query).equals(Map(query))) {
      loadCaseNotes(offenderNo, query)
    }
  }

  render() {
    const {
      offenderNo,
      setCaseNoteView,
      caseNotes,
      totalResults,
      setPagination,
      query,
      location,
      user,
      updateResultsPerPage,
    } = this.props

    const pagination = {
      perPage: query.perPage,
      pageNumber: query.pageNumber,
    }

    return (
      <CaseNoteList
        location={location}
        offenderNo={offenderNo}
        caseNotes={caseNotes}
        pagination={pagination}
        caseNotesQuery={query}
        setPagination={setPagination}
        totalResults={totalResults}
        setCaseNoteView={setCaseNoteView}
        user={user}
        handlePerPageChange={updateResultsPerPage}
      />
    )
  }
}

CaseNotes.propTypes = {
  // mapStateToProps
  offenderNo: PropTypes.string.isRequired,
  caseNotes: ImmutablePropTypes.list.isRequired,
  query: caseNoteQueryType.isRequired,
  totalResults: PropTypes.number,
  user: userType.isRequired,

  // mapDispatchToProps
  loadCaseNotes: PropTypes.func.isRequired,
  setPagination: PropTypes.func.isRequired,
  setCaseNoteView: PropTypes.func.isRequired,
  loadTypesSubTypes: PropTypes.func.isRequired,
  updateResultsPerPage: PropTypes.func.isRequired,

  // special
  location: ReactRouterPropTypes.location.isRequired,
}

CaseNotes.defaultProps = {
  totalResults: 0,
}

const mapDispatchToProps = (dispatch, props) => {
  const queryParams = getQueryParams(props.location.search)

  return {
    loadCaseNotes: (id, query) => dispatch(loadBookingCaseNotes(id, query)),

    setPagination: (id, pagination) =>
      history.push(`/offenders/${id}/case-notes?${buildCaseNotQueryString({ ...queryParams, ...pagination })}`),
    setCaseNoteView: id => history.push(`/offenders/${props.offenderNo}/${DETAILS_TABS.CASE_NOTES}/${id}`),
    loadTypesSubTypes: () => dispatch(loadCaseNoteTypesAndSubTypes()),
    updateResultsPerPage: perPage => dispatch(updateCaseNoteResultsPerPage(props.offenderNo, perPage, queryParams)),
  }
}

const mapStateToProps = (immutableState, props) => {
  const queryParams = getQueryParams(props.location.search)
  const { offenderNo } = props
  const caseNotes =
    immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', offenderNo, 'CaseNotes']) || caseNoteModel
  const results = caseNotes.get('results')
  const totalResults = caseNotes.getIn(['meta', 'totalRecords'])

  const query = {
    ...queryParams,
    perPage: parseInt(queryParams.perPage, 10) || 20,
    pageNumber: parseInt(queryParams.pageNumber, 10) || 0,
  }

  const deviceFormat = immutableState.getIn(['app', 'deviceFormat'])
  const user = immutableState.getIn(['authentication', 'user'])

  return {
    caseNotes: results,
    offenderNo,
    deviceFormat,
    totalResults,
    query,
    user,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CaseNotes)
