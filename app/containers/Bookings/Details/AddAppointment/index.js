import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field, formValueSelector } from 'redux-form/immutable'
import { connect } from 'react-redux'
import { Map, List } from 'immutable'
import { createFormAction } from 'redux-form-saga'
import moment from 'moment'
import { toFullName } from '../../../../utils/stringUtils'

import Select from '../../../../components/FormComponents/SelectWithLabel'
import {
  DatePicker,
  momentToLocalizedDate,
  localizedDateToMoment,
} from '../../../../components/FormComponents/DatePicker'
import TimePicker from '../../../../components/FormComponents/TimePicker'
import { TextArea } from '../../../../components/FormComponents'

import { DATE_TIME_FORMAT_SPEC } from '../../../App/constants'

import { loadAppointmentViewModel } from '../../../EliteApiLoader/actions'
import { APPOINTMENT } from '../../../EliteApiLoader/constants'

import { Model as offenderDetailsModel } from '../../../../helpers/dataMappers/offenderDetails'

import { DETAILS_TABS } from '../../constants'
import { viewDetails } from '../../actions'

import './index.scss'

class AddAppointment extends Component {
  componentDidMount() {
    const { loadViewModel, offendersAgencyId, offenderNo, boundViewDetails } = this.props

    if (!offendersAgencyId) {
      boundViewDetails(offenderNo)
    } else {
      loadViewModel(offendersAgencyId)
    }
  }

  componentDidUpdate(prevProps) {
    const { loadViewModel, offendersAgencyId } = this.props

    if (!prevProps.offendersAgencyId && offendersAgencyId) {
      loadViewModel(offendersAgencyId)
    }
  }

  render() {
    const {
      handleSubmit,
      error,
      submitting,
      locale,
      goBackToBookingDetails,
      offenderNo,
      offenderName,
      viewModel,
      eventDate,
    } = this.props

    if (!viewModel) {
      return <div />
    }

    if (error) {
      window.scrollTo(0, 0)
    }

    return (
      <div className="add-appointment">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4 no-left-gutter">
              <h1 className="heading-large">Add new appointment</h1>

              {error && (
                <div className="error-summary">
                  <div className="error-message">{error}</div>
                </div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-md-2 no-left-gutter">
              <span>Name</span>
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
                format={momentToLocalizedDate(locale)}
                parse={localizedDateToMoment(locale)}
                shouldShowDay={date => date.isAfter(moment().subtract(1, 'day'))}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6 col-md-2 no-left-gutter">
              <Field
                name="startTime"
                title="Start time"
                component={TimePicker}
                date={eventDate}
                now={moment()}
                futureTimeOnly
              />
            </div>

            <div className="col-xs-6 col-md-2 no-left-gutter">
              <Field
                className="add-gutter-top"
                name="endTime"
                title="End time (optional)"
                component={TimePicker}
                date={eventDate}
                now={moment()}
                futureTimeOnly
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 no-left-gutter">
              <Field
                name="comment"
                component={TextArea}
                title="Comments (optional)"
                autocomplete="off"
                spellcheck="true"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 no-left-gutter">
              <button className="button add-gutter-margin-right" type="submit" disabled={submitting}>
                {' '}
                Add appointment{' '}
              </button>
              <button
                type="button"
                className="button button-cancel"
                onClick={e => {
                  e.preventDefault()
                  goBackToBookingDetails(offenderNo)
                }}
              >
                {' '}
                Cancel{' '}
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

AddAppointment.propTypes = {
  // mapStateToProps
  offendersAgencyId: PropTypes.string.isRequired,
  offenderNo: PropTypes.string.isRequired,

  // mapDispatchToProps
  boundViewDetails: PropTypes.func.isRequired,
  goBackToBookingDetails: PropTypes.func.isRequired,
  loadViewModel: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch, props) => ({
  boundViewDetails: offenderNo => dispatch(viewDetails(offenderNo, DETAILS_TABS.ADD_APPOINTMENT)),
  goBackToBookingDetails: offenderNo => dispatch(viewDetails(offenderNo, DETAILS_TABS.QUICK_LOOK)),
  loadViewModel: agencyId => dispatch(loadAppointmentViewModel(agencyId)),
  onSubmit: createFormAction(
    formData => ({
      type: APPOINTMENT.ADD,
      payload: {
        ...formData.toJS(),
        offenderNo: props.params.offenderNo,
      },
    }),
    [APPOINTMENT.SUCCESS, APPOINTMENT.ERROR]
  ),
})

const mapStateToProps = (immutableState, props) => {
  const languageState = immutableState.get('language')
  const locale =
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.browserLanguage ||
    languageState.get('locale')

  const { offenderNo } = props.params
  const offenderDetails =
    immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', props.params.offenderNo, 'Data']) ||
    offenderDetailsModel
  const offendersAgencyId = offenderDetails.getIn(['assignedLivingUnit', 'agencyId'])
  const offenderName = toFullName({
    firstName: offenderDetails.get('firstName'),
    lastName: offenderDetails.get('lastName'),
  })

  const eventDate = formValueSelector('addAppointment')(immutableState, 'eventDate')
  const viewModel = (
    immutableState.getIn(['eliteApiLoader', 'AppointmentTypesAndLocations']) ||
    Map({
      appointmentTypes: List([]),
      locations: List([]),
    })
  ).toJS()

  return {
    locale,
    offenderNo,
    offenderDetails,
    offendersAgencyId,
    offenderName,
    eventDate,
    viewModel,
  }
}

export const validate = (form, props) => {
  if (!form) return {}

  const { startTime, endTime, appointmentType, location, eventDate, comment } = form.toJS()
  const error = {}
  const now = moment()
  const isToday = eventDate ? eventDate.isSame(now, 'day') : false

  if (!appointmentType) {
    error.appointmentType = 'Please select an appointment type'
  }

  if (!location) {
    if (props && props.viewModel && (!props.viewModel.locations || props.viewModel.locations.length === 0)) {
      error.location = 'No appointment locations set up; please see your Systems administrator'
    } else {
      error.location = 'Please select a location'
    }
  }

  if (!eventDate) {
    error.eventDate = 'Please select a date'
  } else {
    if (eventDate.isValid() === false) {
      error.eventDate = 'Please enter a valid date'
    }
    if (eventDate.isBefore(now, 'day')) {
      error.eventDate = "Date shouldn't be in the past"
    }
  }

  if (!startTime) {
    error.startTime = 'Please select a start time'
  }

  if (isToday && moment(startTime).isBefore(now)) {
    error.startTime = "Start time shouldn't be in the past"
  }

  if (isToday && moment(endTime).isBefore(now)) {
    error.endTime = "End time shouldn't be in the past"
  }

  if (moment(endTime, DATE_TIME_FORMAT_SPEC).isBefore(moment(startTime, DATE_TIME_FORMAT_SPEC), 'minute')) {
    error.endTime = "End time shouldn't be before Start time"
    error.startTime = "Start time should't be after End time"
  }

  if (comment && comment.length > 3600) {
    error.comment = 'Maximum length should not exceed 3600 characters'
  }

  return error
}

const asForm = reduxForm({
  form: 'addAppointment',
  validate,
  initialValues: Map({}),
})(AddAppointment)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(asForm)
