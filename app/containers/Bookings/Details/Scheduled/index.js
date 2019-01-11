import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import moment from 'moment'
import { List } from 'immutable'
import uuid from 'uuid/v4'
import { FormattedDate } from '../../../../components/intl'

import { Model as offenderDetailsModel } from '../../../../helpers/dataMappers/offenderDetails'

import { loadScheduledEventsForThisWeek, loadScheduledEventsForNextWeek, viewDetails } from '../../actions'

import { DETAILS_TABS } from '../../constants'

import { properCase } from '../../../../utils/stringUtils'

import './index.scss'

export const Event = ({ startTime, endTime, type, shortComment, cancelled }) => (
  <div className="row add-gutter-margin-bottom">
    <div className="col-xl-5 col-lg-5 col-md-6 col-xs-6 no-right-gutter">
      <span className="whereabouts-startTime">{moment(startTime).format('HH:mm')}</span>

      {endTime && (
        <span>
          <span>-</span>
          <span className="whereabouts-endTime"> {moment(endTime).format('HH:mm')} </span>
        </span>
      )}
    </div>

    <div className="col-xl-7 col-lg-7 col-md-6 col-xs-6 no-left-gutter no-right-gutter">
      <span>
        <b> {type} </b>
        {shortComment && <b> - </b>}
      </span>

      <span>{shortComment}</span>

      {cancelled && <span className="cancelled"> (cancelled)</span>}
    </div>
  </div>
)

Event.propTypes = {
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  shortComment: PropTypes.string.isRequired,
  cancelled: PropTypes.string.isRequired,
}

export const DayAndDate = ({ value }) => (
  <h1 className="heading-medium whereabouts-day-header">{moment(value).format('dddd')}</h1>
)

DayAndDate.propTypes = {
  value: PropTypes.string.isRequired,
}

class ScheduledEvents extends Component {
  componentDidMount() {
    const { loadThisWeeksScheduledEvents, offenderNo, loadBookingDetails } = this.props
    loadBookingDetails(offenderNo)
    loadThisWeeksScheduledEvents(offenderNo)
  }

  render() {
    const { scheduledEvents } = this.props

    if (!scheduledEvents && !scheduledEvents) {
      return null
    }

    const {
      loadThisWeeksScheduledEvents,
      loadNextWeeksScheduledEvents,
      offenderNo,
      currentFilter,
      offenderDetails: { firstName, lastName },
    } = this.props

    const { thisWeek, nextWeek } = currentFilter.toJS()

    return (
      <div className="whereabouts">
        <h1 className="heading-large"> Schedule for {`${properCase(firstName)} ${properCase(lastName)}`} </h1>

        <div className="row filters">
          <div className="col-xs-6 col-lg-2 no-left-gutter">
            <div className="form-group">
              <div className="multiple-choice">
                <input
                  checked={thisWeek && 'checked'}
                  type="radio"
                  name="radio-inline-group"
                  id="thisWeek"
                  value="Yes"
                  onClick={() => loadThisWeeksScheduledEvents(offenderNo)}
                  onChange={event => event.preventDefault()}
                />
                <label htmlFor="thisWeek">This week</label>
              </div>
            </div>
          </div>
          <div className="col-xs-6 col-lg-2 no-left-gutter">
            <div className="multiple-choice">
              <input
                checked={nextWeek && 'checked'}
                type="radio"
                name="radio-inline-group"
                id="nextWeek"
                value="Yes"
                onClick={() => loadNextWeeksScheduledEvents(offenderNo)}
                onChange={event => event.preventDefault()}
              />
              <label htmlFor="nextWeek">Next week</label>
            </div>
          </div>
        </div>

        <div className="row hidden-lg-down">
          <div className="col-lg-1" />
          <div className="col-lg-3 add-gutter-margin-left">
            <h1 className="heading-medium">Morning (AM)</h1>
          </div>
          <div className="col-lg-3">
            <h1 className="heading-medium">Afternoon (PM)</h1>
          </div>
          <div className="col-lg-3">
            <h1 className="heading-medium">Evening (ED)</h1>
          </div>
        </div>
        {scheduledEvents.map(entry => (
          <div className="row appointment-row" key={uuid()}>
            <div className="appointments">
              <div className="col-lg-1 no-left-gutter add-gutter-margin-right">
                <DayAndDate className="whereabouts-day-header" value={entry.get('date')} />
                <FormattedDate
                  className="heading-medium whereabouts-date-header"
                  value={entry.get('date')}
                  month="long"
                  day="2-digit"
                />
              </div>

              <div className="visible-lg-down add-gutter-top">
                <div className="col-lg-12">
                  <b>Morning (AM)</b>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="appointment morning add-gutter-top add-gutter-bottom">
                  {entry.get('morningActivities').map(morning => (
                    <div key={uuid()}>
                      <Event
                        startTime={morning.get('startTime')}
                        endTime={morning.get('endTime')}
                        type={morning.get('type')}
                        shortComment={morning.get('shortComment')}
                        cancelled={morning.get('cancelled')}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="visible-lg-down add-gutter-top add-gutter-bottom">
                <div className="col-lg-12">
                  <b>Afternoon (PM)</b>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="appointment afternoon add-gutter-top">
                  {entry.get('afternoonActivities').map(afternoon => (
                    <div key={uuid()}>
                      <Event
                        startTime={afternoon.get('startTime')}
                        endTime={afternoon.get('endTime')}
                        type={afternoon.get('type')}
                        shortComment={afternoon.get('shortComment')}
                        cancelled={afternoon.get('cancelled')}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="visible-lg-down add-gutter-top add-gutter-bottom">
                <div className="col-lg-12">
                  <b>Evening Duty (ED)</b>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="appointment ed add-gutter-top">
                  {entry.get('eveningDuties').map(afternoon => (
                    <div key={uuid()}>
                      <Event
                        startTime={afternoon.get('startTime')}
                        endTime={afternoon.get('endTime')}
                        type={afternoon.get('type')}
                        shortComment={afternoon.get('shortComment')}
                        cancelled={afternoon.get('cancelled')}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

ScheduledEvents.propTypes = {
  // mapStateToProps
  offenderNo: PropTypes.string.isRequired,
  scheduledEvents: ImmutablePropTypes.list.isRequired,
  offenderDetails: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
  currentFilter: ImmutablePropTypes.map.isRequired,

  // mapDispatchToProps
  loadThisWeeksScheduledEvents: PropTypes.func.isRequired,
  loadNextWeeksScheduledEvents: PropTypes.func.isRequired,
  loadBookingDetails: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  loadThisWeeksScheduledEvents: offenderNo => dispatch(loadScheduledEventsForThisWeek(offenderNo)),
  loadNextWeeksScheduledEvents: offenderNo => dispatch(loadScheduledEventsForNextWeek(offenderNo)),
  loadBookingDetails: offenderNo => dispatch(viewDetails(offenderNo, DETAILS_TABS.SCHEDULED)),
})

const mapStateToProps = (immutableState, props) => {
  const { offenderNo } = props.match.params
  const scheduledEvents = immutableState.getIn(['search', 'details', 'scheduledEvents']) || List([])
  const offenderDetails =
    immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', offenderNo, 'Data']) || offenderDetailsModel
  const offenderName = { firstName: offenderDetails.get('firstName'), lastName: offenderDetails.get('lastName') }
  const currentFilter = immutableState.getIn(['search', 'details', 'currentFilter'])

  return {
    offenderNo,
    scheduledEvents,
    offenderDetails: offenderName,
    currentFilter,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduledEvents)
