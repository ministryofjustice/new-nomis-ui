import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { viewDetails as vD } from '../Bookings/actions'
import { DETAILS_TABS, offenderImageUrl } from '../Bookings/constants'
import EliteImage from '../EliteContainers/Image'
import Name from '../../components/Name'
import { setSearchContext } from '../../globalReducers/app'
import UserModel from '../../helpers/dataMappers/user'
import ThresholdIndicator from '../../components/ThresholdIndicator'
import { FormattedDate } from '../../components/intl'
import { loadAssignments } from './actions'
import { linkOnClick } from '../../helpers'
import './index.scss'
import userType from '../types'
import history from '../../history'
import Page from '../../components/Page'

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
            className="photo clickable assignments1 inline-block add-gutter-margin-right"
            {...linkOnClick(() => viewDetails(row.get('offenderNo')))}
          >
            <EliteImage src={offenderImageUrl(row.get('facialImageId'))} />
          </div>

          <div
            className="link clickable assignments2 inline-block"
            {...linkOnClick(() => viewDetails(row.get('offenderNo')))}
          >
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

ResultsView.propTypes = {
  results: ImmutablePropTypes.list.isRequired,
  viewDetails: PropTypes.func.isRequired,
}

class Assignments extends Component {
  componentDidMount() {
    const { user, setContext, boundLoadAssignments, redirectToHome } = this.props

    if (user && user.isKeyWorker) {
      setContext('assignments')
      boundLoadAssignments()
    } else {
      redirectToHome()
    }
  }

  render() {
    const { results, totalResults, capacity, error, viewDetails } = this.props

    return (
      <Page title="My key worker allocations">
        <div className="my-allocations">
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
      </Page>
    )
  }
}

Assignments.propTypes = {
  totalResults: PropTypes.number.isRequired,
  error: PropTypes.string,
  capacity: PropTypes.number.isRequired,
  results: ImmutablePropTypes.listOf(ImmutablePropTypes.map).isRequired,
  user: userType.isRequired,

  // mapDispatchToProps
  viewDetails: PropTypes.func.isRequired,
  setContext: PropTypes.func.isRequired,
  boundLoadAssignments: PropTypes.func.isRequired,
  redirectToHome: PropTypes.func.isRequired,
}

Assignments.defaultProps = {
  error: '',
}

const mapDispatchToProps = dispatch => ({
  viewDetails: offenderNo => dispatch(vD(offenderNo, DETAILS_TABS.QUICK_LOOK)),
  setContext: context => dispatch(setSearchContext(context)),
  boundLoadAssignments: () => dispatch(loadAssignments()),
  redirectToHome: () => history.push('/'),
})

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
