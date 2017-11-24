import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedDate } from 'react-intl';
import moment from 'moment';

import {
  selectBookingDetailsId,
  selectScheduledActivities,
  selectHeaderDetail,
  selectCurrentFilter,
} from 'containers/Bookings/selectors'

import {
  loadScheduledActivitiesForThisWeek,
  loadScheduledActivitiesForNextWeek,
} from 'containers/Bookings/actions';

import { toFullName } from 'utils/stringUtils';

import './index.scss';

export const Appointment = ({ startTime,endTime, description }) =>
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

class Whereabouts extends Component {

  componentDidMount() {
    const { loadThisWeeksScheduledActivities, bookingId } = this.props;

    loadThisWeeksScheduledActivities(bookingId);
  }

  render() {
    const scheduledActivities = this.props.scheduledActivities;

    if (!scheduledActivities && !scheduledActivities) {
      return <div>Loading scheduled activities....</div>
    }

    const { loadThisWeeksScheduledActivities, loadNextWeeksScheduledActivities, bookingId, currentFilter } = this.props;
    const { thisWeek, nextWeek } = currentFilter.toJS();

    const { firstName, lastName } = this.props.offenderDetails;

    const nameString = toFullName({ firstName, lastName }).replace(',','');

    return (<div className="whereabouts">

      <h1> {`${nameString}s' whereabouts`} </h1>

      <div className="row filters">

        <div className="col-xs-6 col-lg-2 no-left-gutter">
          <div className="form-group">
            <div className="multiple-choice">
              <input checked={thisWeek && 'checked'} type="radio" name="radio-inline-group" value="Yes" onClick={() => loadThisWeeksScheduledActivities(bookingId)}></input>
              <label>This week</label>
            </div>
          </div>
        </div>
        <div className="col-xs-6 col-lg-2 no-left-gutter">
          <div className="multiple-choice">
            <input checked={nextWeek && 'checked'} type="radio" name="radio-inline-group" value="Yes" onClick={() => loadNextWeeksScheduledActivities(bookingId)}></input>
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
      {scheduledActivities.map(entry =>

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
                  {entry.forMorning.map(morning => Appointment({ ...morning }))}
                </div>
              </div>


              <div className="visible-lg-down add-gutter-top add-gutter-bottom">
                <div className="col-lg-12">
                  <b>Afternoon (PM)</b>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="appointment afternoon add-gutter-top">
                  {entry.forAfternoon.map(afternoon => Appointment({ ...afternoon }))}
                </div>
              </div>
          </div>

        </div>)}
    </div>)
  }
}
export function mapDispatchToProps(dispatch) {
  return {
    loadThisWeeksScheduledActivities: (bookingId) => dispatch(loadScheduledActivitiesForThisWeek(bookingId)),
    loadNextWeeksScheduledActivities: (bookingId) => dispatch(loadScheduledActivitiesForNextWeek(bookingId)),
  }
}

const mapStateToProps = createStructuredSelector({
  bookingId: selectBookingDetailsId(),
  scheduledActivities: selectScheduledActivities(),
  offenderDetails: selectHeaderDetail(),
  currentFilter: selectCurrentFilter(),
});

export default connect(mapStateToProps, mapDispatchToProps)(Whereabouts);
