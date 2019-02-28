import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { List } from 'immutable'
import Radio from '@govuk-react/radio'
import Header from '@govuk-react/header'
import uuid from 'uuid/v4'

import { FormattedDate } from '../../../../components/intl'
import { Model as offenderDetailsModel } from '../../../../helpers/dataMappers/offenderDetails'
import { loadScheduledEventsForThisWeek, loadScheduledEventsForNextWeek, viewDetails } from '../../actions'
import { DETAILS_TABS } from '../../constants'
import { properCase } from '../../../../utils/stringUtils'
import Page from '../../../../components/Page'
import Event from './elements/Event'
import DayWithDate from './elements/DayWithDate'
import {
  DayContainer,
  TimePeriodsContainer,
  TimePeriod,
  EventsContainer,
  ScheduleFilters,
} from './ScheduledEvents.styles'

export class ScheduledEvents extends Component {
  componentDidMount() {
    const { loadThisWeeksScheduledEvents, offenderNo, loadBookingDetails } = this.props
    loadBookingDetails(offenderNo)
    loadThisWeeksScheduledEvents(offenderNo)
  }

  renderEvent = eventPeriods => {
    if (!eventPeriods || eventPeriods.size === 0) return 'No activities or appointments.'

    return eventPeriods.map(period => (
      <Event
        key={uuid()}
        startTime={period.get('startTime')}
        endTime={period.get('endTime')}
        type={period.get('type')}
        shortComment={period.get('shortComment')}
        cancelled={period.get('cancelled')}
      />
    ))
  }

  render() {
    const { scheduledEvents } = this.props

    const {
      loadThisWeeksScheduledEvents,
      loadNextWeeksScheduledEvents,
      offenderNo,
      currentFilter,
      offenderDetails: { firstName, lastName },
    } = this.props

    const { thisWeek, nextWeek } = currentFilter.toJS()

    return (
      <Page title={`Schedule for ${properCase(firstName)} ${properCase(lastName)}`}>
        <ScheduleFilters>
          <Radio
            checked={thisWeek && 'checked'}
            name="radio-inline-group"
            id="thisWeek"
            value="Yes"
            onClick={() => loadThisWeeksScheduledEvents(offenderNo)}
            onChange={event => event.preventDefault()}
            inline
          >
            This week
          </Radio>
          <Radio
            checked={nextWeek && 'checked'}
            name="radio-inline-group"
            id="nextWeek"
            value="Yes"
            onClick={() => loadNextWeeksScheduledEvents(offenderNo)}
            onChange={event => event.preventDefault()}
            inline
          >
            Next week
          </Radio>
        </ScheduleFilters>

        {scheduledEvents.map(day => (
          <DayContainer key={day.get('date')}>
            <Header level={2} size="MEDIUM">
              <DayWithDate value={day.get('date')} />{' '}
              <FormattedDate value={day.get('date')} month="long" day="2-digit" />
            </Header>

            <TimePeriodsContainer>
              <TimePeriod>
                <Header level={3} size="SMALL">
                  Morning (AM)
                </Header>

                <EventsContainer value="morning">{this.renderEvent(day.get('morningActivities'))}</EventsContainer>
              </TimePeriod>

              <TimePeriod>
                <Header level={3} size="SMALL">
                  Afternoon (PM)
                </Header>

                <EventsContainer value="afternoon">{this.renderEvent(day.get('afternoonActivities'))}</EventsContainer>
              </TimePeriod>

              <TimePeriod>
                <Header level={3} size="SMALL">
                  Evening Duty (ED)
                </Header>

                <EventsContainer value="evening">{this.renderEvent(day.get('eveningDuties'))}</EventsContainer>
              </TimePeriod>
            </TimePeriodsContainer>
          </DayContainer>
        ))}
      </Page>
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
