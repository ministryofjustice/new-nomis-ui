import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedDate } from 'react-intl';
import moment from 'moment';
import { Link } from 'react-router';

import {
  selectBookingDetailsId,
  selectScheduledEvents,
  selectHeaderDetail,
  selectCurrentFilter,
} from 'containers/Bookings/selectors'

import {
  loadScheduledEventsForThisWeek,
  loadScheduledEventsForNextWeek,
} from 'containers/Bookings/actions';

import { properCase } from 'utils/stringUtils';
import { viewDetails } from '../../actions';
import { DETAILS_TABS } from '../../constants';

import './index.scss';

export const Event = ({ startTime,endTime, description }) =>
<div className="row add-gutter-margin-bottom add-gutter-margin-bottom">

  <div className="col-xl-5 col-lg-6 col-md-6 col-xs-6">
    <span className="whereabouts-startTime">
      {moment(startTime).format('HH:mm')}
    </span>

    {endTime && <span>-</span>}
    <span className="whereabouts-endTime"> {endTime && moment(endTime).format('HH:mm')} </span>
  </div>

  <div className="col-xl-7 col-lg-6 col-md-6 col-xs-6">
    <b>
      {description}
    </b>
  </div>

</div>

export const DayAndDate = ({ value }) => <h1 className="heading-medium whereabouts-day-header">
  {moment(value).format('dddd')}
</h1>

class ScheduledEvents extends Component {

  componentDidMount() {
    const { loadThisWeeksScheduledEvents, bookingId } = this.props;
    loadThisWeeksScheduledEvents(bookingId);
  }

  render() {
    const scheduledEvents = this.props.scheduledEvents;

    if (!scheduledEvents && !scheduledEvents) {
      return <div>Loading scheduled activities....</div>
    }

    const {
      loadThisWeeksScheduledEvents,
      loadNextWeeksScheduledEvents,
      backToQuickLook,
      bookingId,
      currentFilter } = this.props;

    const { thisWeek, nextWeek } = currentFilter.toJS();
    const { firstName, lastName } = this.props.offenderDetails;

    return (<div className="whereabouts add-gutter-top-md-down">

      <Link onClick={() => backToQuickLook(bookingId)} className="link" role="link"> {'<'} Back to quicklook</Link>

      <h1> Scheduled for {`${properCase(firstName)} ${properCase(lastName)}`} </h1>

      <div className="row filters">

        <div className="col-xs-6 col-lg-2 no-left-gutter">
          <div className="form-group">
            <div className="multiple-choice">
              <input checked={thisWeek && 'checked'} type="radio" name="radio-inline-group" value="Yes" onClick={() => loadThisWeeksScheduledEvents(bookingId)}></input>
              <label>This week</label>
            </div>
          </div>
        </div>
        <div className="col-xs-6 col-lg-2 no-left-gutter">
          <div className="multiple-choice">
            <input checked={nextWeek && 'checked'} type="radio" name="radio-inline-group" value="Yes" onClick={() => loadNextWeeksScheduledEvents(bookingId)}></input>
            <label>Next week</label>
          </div>
      </div>

      </div>

      <div className="row hidden-lg-down">
        <div className="col-lg-2"></div>
        <div className="col-lg-5">
          <h1 className="heading-medium">Morning (AM)</h1>
        </div>
        <div className="col-lg-5">
          <h1 className="heading-medium">Afternoon (PM)</h1>
        </div>
      </div>
      {scheduledEvents.map(entry =>

        <div className="row appointment-row">

          <div className="appointments">

              <div className="col-lg-2 no-left-gutter">
                <DayAndDate
                  className="whereabouts-day-header"
                  value={entry.date}
                />
                <FormattedDate
                  className="heading-medium whereabouts-date-header"
                  value={entry.date}
                  month="long"
                  day="2-digit"
                />
              </div>

              <div className="visible-lg-down add-gutter-top">
                <div className="col-lg-12">
                  <b>Morning (AM)</b>
                </div>
              </div>

              <div className="col-lg-5 ">
                <div className="appointment morning add-gutter-top add-gutter-bottom">
                  {entry.forMorning.map(morning => Event({ ...morning }))}
                </div>
              </div>


              <div className="visible-lg-down add-gutter-top add-gutter-bottom">
                <div className="col-lg-12">
                  <b>Afternoon (PM)</b>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="appointment afternoon add-gutter-top">
                  {entry.forAfternoon.map(afternoon => Event({ ...afternoon }))}
                </div>
              </div>
          </div>

        </div>)}

    </div>)
  }
}
export function mapDispatchToProps(dispatch) {
  return {
    loadThisWeeksScheduledEvents: (bookingId) => dispatch(loadScheduledEventsForThisWeek(bookingId)),
    loadNextWeeksScheduledEvents: (bookingId) => dispatch(loadScheduledEventsForNextWeek(bookingId)),
    backToQuickLook: (bookingId) => dispatch(viewDetails(bookingId, DETAILS_TABS.QUICK_LOOK)),
  }
}

const mapStateToProps = createStructuredSelector({
  bookingId: selectBookingDetailsId(),
  scheduledEvents: selectScheduledEvents(),
  offenderDetails: selectHeaderDetail(),
  currentFilter: selectCurrentFilter(),
  bookingDetailsId: selectBookingDetailsId(),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledEvents);
