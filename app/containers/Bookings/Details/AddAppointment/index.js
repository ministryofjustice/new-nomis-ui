import React, { Component } from 'react';
import { reduxForm, Field, formValueSelector } from 'redux-form/immutable';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { createStructuredSelector } from 'reselect';
import { createFormAction } from 'redux-form-saga';
import moment from 'moment';

import Select from 'components/FormComponents/SelectWithLabel';
import DatePicker from 'components/FormComponents/DatePicker';
import TimePicker from 'components/FormComponents/TimePicker';
import { selectLocale } from 'containers/LanguageProvider/selectors';
import { SubmissionError, TextArea } from 'components/FormComponents';
import { DATE_ONLY_FORMAT_SPEC, DATE_TIME_FORMAT_SPEC } from 'containers/App/constants';
import { loadAppointmentViewModel } from 'containers/EliteApiLoader/actions';
import { APPOINTMENT } from 'containers/EliteApiLoader/constants';
import { selectAppointmentTypesAndLocations } from 'containers/EliteApiLoader/selectors';

import { DETAILS_TABS } from '../../constants';
import { selectBookingDetailsId,selectName, selectOffenderAgencyId } from '../../selectors';
import { viewDetails } from '../../actions';


import './index.scss';

class AddAppointment extends Component {

  componentDidMount() {
    const { loadViewModel, offendersAgencyId } = this.props;

    loadViewModel(offendersAgencyId);
  }

  render() {
    const { handleSubmit,error,submitting, locale, goBackToBookingDetails, bookingId, offenderName, viewModel } = this.props;

    if (!viewModel) {
      return <div></div>;
    }

    if (this.props && this.props.error) {
      window.scrollTo(0,0);
    }

    return (<div className="add-appointment">

      <form onSubmit={handleSubmit}>

        <div className="row">
          <div className="col-md-4 no-left-gutter">
            <h1 className="heading-large no-top-gutter">
              Add new appointment
            </h1>

            {error && <div className="error-summary">
              <div className="error-message">
                {error}
              </div>
            </div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-2 no-left-gutter">
            <label>Name</label>
          </div>
        </div>

        <div className="row add-gutter-margin-bottom">
          <div className="col-md-2 no-left-gutter">
            <b> {offenderName} </b>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 no-left-gutter">
            <Field
              name="appointmentType"
              title="Select type of appointment"
              autocomplete="true"
              component={Select}
              options={viewModel.appointmentTypes.map(type => ({
                label: type.description,
                value: type.code,
              }))}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 no-left-gutter">
            <Field
              name="location"
              title="Select location"
              autocomplete="true"
              component={Select}
              options={viewModel.locations.map(location => ({
                label: location.description,
                value: location.locationId,
              }))}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-2 no-left-gutter">
            <Field
              name="eventDate"
              title="Select date"
              component={DatePicker}
              locale={locale}
              shouldShowDay={(date) => date.isAfter(moment().subtract('days',1))}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-xs-6 col-md-2 no-left-gutter">
            <Field
              name="startTime"
              title="Start time"
              component={TimePicker}
            />
          </div>

          <div className="col-xs-6 col-md-2 no-left-gutter">
            <Field
              className="add-gutter-top"
              name="endTime"
              title="End time (optional)"
              component={TimePicker}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 no-left-gutter">
            <Field name="comment" component={TextArea} title="Comments (optional)" autocomplete="off" spellcheck="true" />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 no-left-gutter">
            <button className="button add-gutter-margin-right" type="submit" disabled={submitting}> Add appointment </button>
            <button
              className="button button-cancel" onClick={(e) => {
                e.preventDefault();
                goBackToBookingDetails(bookingId);
              }}
            > Cancel </button>
          </div>
        </div>
      </form>
    </div>)
  }
}


export function mapDispatchToProps(dispatch) {
  return {
    goBackToBookingDetails: (bookingId) => dispatch(viewDetails(bookingId, DETAILS_TABS.OFFENDER_DETAILS)),
    loadViewModel: (agencyId) => dispatch(loadAppointmentViewModel(agencyId)),
    onSubmit: createFormAction((formData) => (
      {
        type: APPOINTMENT.ADD,
        payload: {
          ...formData.toJS(),
        },
      }),
      [APPOINTMENT.SUCCESS, APPOINTMENT.ERROR]),
  };
}


const mapStateToProps = createStructuredSelector({
  locale: selectLocale(),
  bookingId: selectBookingDetailsId(),
  offendersAgencyId: selectOffenderAgencyId(),
  viewModel: selectAppointmentTypesAndLocations(),
  offenderName: selectName(),
});

export const validate = (form) => {
  if (!form) return {};

  const { startTime, endTime, appointmentType, location, eventDate, comment } = form.toJS();
  const error = {};
  const now = moment();
  const isToday = moment(eventDate, DATE_ONLY_FORMAT_SPEC).isSame(now, 'day');

  if (!appointmentType) {
    error.appointmentType = 'Please select an appointment type';
  }

  if (!location) {
    error.location = 'Please select a location';
  }

  if (!eventDate) {
    error.eventDate = 'Please select a date';
  }

  if (eventDate && moment(eventDate, DATE_ONLY_FORMAT_SPEC).isValid() === false) {
    error.eventDate = 'Please enter a valid date';
  }

  if (!startTime) {
    error.startTime = 'Please select a start time';
  }

  if (isToday && moment(startTime).isBefore(now)) {
    error.startTime = "Start time shouldn't be in the past";
  }

  if (isToday && moment(endTime).isBefore(now)) {
    error.endTime = "End time shouldn't be in the past";
  }

  if (moment(eventDate, DATE_ONLY_FORMAT_SPEC).isBefore(now, 'day')) {
    error.eventDate = "Date shouldn't be in the past";
  }

  if (moment(endTime, DATE_TIME_FORMAT_SPEC).isBefore(moment(startTime, DATE_TIME_FORMAT_SPEC), 'minute')) {
    error.endTime = 'End time shouldn\'t be before Start time';
    error.startTime = 'Start time should\'t be after End time';
  }

  if (comment && comment.length > 3600) {
    error.comment = 'Maximum length should not exceed 3600 characters';
  }

  return error;
};

const asForm = reduxForm({
  form: 'addAppointment',
  validate,
  initialValues: Map({
  }),
})(AddAppointment);


export default connect(mapStateToProps, mapDispatchToProps)(asForm);

