import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { viewDetails as vD } from 'containers/Bookings/actions'
import { DETAILS_TABS, offenderImageUrl } from 'containers/Bookings/constants'
import EliteImage from 'containers/EliteContainers/Image'
import Name from 'components/Name'
import { setSearchContext } from 'globalReducers/app'
import { Model as UserModel } from 'helpers/dataMappers/user'
import ThresholdIndicator from 'components/ThresholdIndicator'
import { FormattedDate } from 'components/intl'
import { setAssignmentsPagination, setAssignmentsView, loadAssignments } from './actions'

import './index.scss'

const ResultsView = ({ results, viewDetails }) => (
  <div className="offender-table">
    <div className="row add-gutter-bottom line-bottom table-headings">
      <div className="col-sm-3 col-xs-8 no-left-gutter">
        <b> Name </b>
      </div>

      <div className="col-sm-1 col-xs-3">
        <b> Prison no. </b>
      </div>

      <div className="col-sm-1 hidden-xs">
        <b> Location </b>
      </div>

      <div className="col-sm-1 hidden-xs">
        <b> IEP </b>
      </div>

      <div className="col-sm-2 hidden-xs">
        <b> CRD </b>
      </div>

      <div className="col-sm-2 hidden-xs">
        <b>
          {' '}
          Last key
          <br />
          worker activity{' '}
        </b>
      </div>
    </div>

    {results.map((row, index) => (
      <div
        className={`row no-bottom-padding add-gutter-margin-bottom offender ${index % 2 === 0 && 'grey-row'}`}
        key={row.get('bookingId')}
      >
        <div className="col-sm-3 col-xs-8 no-left-gutter">
          <div
            className="photo clickable inline-block add-gutter-margin-right"
            onClick={() => viewDetails(row.get('offenderNo'))}
          >
            <EliteImage src={offenderImageUrl(row.get('facialImageId'))} />
          </div>

          <div className="link clickable inline-block" onClick={() => viewDetails(row.get('offenderNo'))}>
            <span>
              <Name lastName={row.get('lastName')} firstName={row.get('firstName')} />
            </span>
          </div>
        </div>

        <div className="col-sm-1 col-xs-3 margin-top">
          <span>{row.get('offenderNo')} </span>
        </div>

        <div className="col-sm-1 hidden-xs margin-top">
          <span>{row.get('assignedLivingUnitDesc')} </span>
        </div>

        <div className="col-sm-1 hidden-xs margin-top">
          <span>{row.get('iepLevel')} </span>
        </div>

        <div className="col-sm-2 hidden-xs margin-top">
          {row.get('conditionalReleaseDate') && <FormattedDate value={row.get('conditionalReleaseDate')} />}
        </div>

        <div className="col-sm-2 hidden-xs margin-top">
          {row.get('lastKeyWorkerSessionDate') && <FormattedDate value={row.get('lastKeyWorkerSessionDate')} />}
        </div>
      </div>
    ))}
  </div>
)

class Assignments extends Component {
  componentDidMount() {
    const { user, setContext, loadAssignments, redirectToHome } = this.props

    if (user && user.isKeyWorker) {
      setContext('assignments')
      loadAssignments()
    } else {
      redirectToHome()
    }
  }

  render() {
    const { results, totalResults, capacity, error, viewDetails } = this.props

    return (
      <div className="my-allocations">
        <h1 className="heading-large no-top-margin add-gutter-padding-top">My key worker allocations</h1>

        <h2 className="heading-medium no-top-margin add-gutter-padding-top">
          <span className="add-gutter-margin-right"> Current allocations </span>{' '}
          <ThresholdIndicator maximum={capacity} value={totalResults} />
        </h2>

        {error && (
          <div className="error-summary">
            <div className="error-message"> {error} </div>
          </div>
        )}

        {results.size > 0 && <ResultsView results={results} viewDetails={viewDetails} />}
        {results.size === 0 && <h2 className="heading-small"> No prisoners allocated. </h2>}
      </div>
    )
  }
}

Assignments.propTypes = {
  setContext: PropTypes.func.isRequired,
}

export function mapDispatchToProps(dispatch, props) {
  return {
    viewDetails: offenderNo => dispatch(vD(offenderNo, DETAILS_TABS.QUICK_LOOK)),
    setPage: pagination => dispatch(setAssignmentsPagination({ ...props.location.query, ...pagination })),
    setResultsView: view => dispatch(setAssignmentsView(view)),
    setContext: context => dispatch(setSearchContext(context)),
    loadAssignments: () => dispatch(loadAssignments()),
    redirectToHome: () => dispatch(push('/')),
  }
}

const mapStateToProps = immutableState => {
  const assignments = immutableState.getIn(['assignments'])
  const results = assignments.get('allocations')
  const capacity = assignments.get('capacity')
  const totalResults = results.size
  const resultsView = assignments.get('view')
  const deviceFormat = immutableState.getIn(['app', 'deviceFormat'])
  const user = immutableState.getIn(['authentication', 'user']) || UserModel.toJS()
  const error = assignments.get('error')

  return {
    results,
    capacity,
    totalResults,
    deviceFormat,
    resultsView,
    user,
    error,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Assignments)
