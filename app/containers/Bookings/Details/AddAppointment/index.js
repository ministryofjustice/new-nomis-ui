import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field, formValueSelector } from 'redux-form/immutable'
import { connect } from 'react-redux'
import { Map } from 'immutable'
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

import { DATE_ONLY_FORMAT_SPEC, DATE_TIME_FORMAT_SPEC } from '../../../App/constants'

import { loadAppointmentViewModel, loadExistingEvents as lee } from '../../../EliteApiLoader/actions'
import { APPOINTMENT } from '../../../EliteApiLoader/constants'

import { Model as offenderDetailsModel } from '../../../../helpers/dataMappers/offenderDetails'

import { DETAILS_TABS } from '../../constants'
import { viewDetails } from '../../actions'

import './index.scss'
import Page from '../../../../components/Page'

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
      offendersAgencyId,
      offenderName,
      viewModel,
      existingEvents,
      loadExistingEvents,
      eventDate,
    } = this.props

    const onDateChange = (event, newValue) => {
      if (newValue) {
        loadExistingEvents(offendersAgencyId, newValue.format(DATE_ONLY_FORMAT_SPEC), offenderNo)
      }
    }

    if (!viewModel) {
      return <div />
    }

    if (error) {
      window.scrollTo(0, 0)
    }

    const getHours = timestamp => {
      if (!timestamp) {
        return ''
      }
      return timestamp.substr(0, 2)
    }

    const partition = eventArray => {
      const am = []
      const pm = []
      const ed = []
      eventArray.forEach(e => {
        const hours = Number(getHours(e.startTime))
        if (hours < 12) {
          am.push(e)
        } else if (hours >= 12 && hours < 17) {
          pm.push(e)
        } else {
          ed.push(e)
        }
      })
      return [am, pm, ed]
    }

    const insertForNothingScheduled = eventArray => {
      const slots = partition(eventArray)
      const amPresent = slots[0].length
      const pmPresent = slots[1].length
      if (amPresent && pmPresent) {
        return eventArray
      }
      if (amPresent) {
        return [...slots[0], { nothingScheduled: true, eventDescription: 'PM: nothing scheduled' }, ...slots[2]]
      }
      if (pmPresent) {
        return [{ nothingScheduled: true, eventDescription: 'AM: nothing scheduled' }, ...slots[1], ...slots[2]]
      }
      return [
        { nothingScheduled: true, eventDescription: 'AM: nothing scheduled' },
        { nothingScheduled: true, eventDescription: 'PM: nothing scheduled' },
        ...slots[2],
      ]
    }

    const getStatus = (eventStatus, excluded) => {
      if (excluded) {
        return ' (temporarily removed)'
      }
      return ''
    }

    return (
      <Page title="Add new appointment">
        <div className="add-appointment">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 no-left-gutter">
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
              <div className="col-md-4 no-left-gutter">
                <b>
                  {offenderName} ({offenderNo})
                </b>
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
                  onChange={onDateChange}
                  locale={locale}
                  format={momentToLocalizedDate(locale)}
                  parse={localizedDateToMoment(locale)}
                  shouldShowDay={date => date.isAfter(moment().subtract(1, 'day'))}
                />
              </div>
            </div>

            {existingEvents && (
              <div className="row">
                <div className="col-md-8 col-xs-12 add-gutter-margin-bottom font-xsmall no-left-padding">
                  <div id="other-events" className="shaded add-gutter-padding-bottom">
                    <div className="row col-xs-12 add-gutter-margin-top add-gutter-margin-bottom">
                      <b>Other scheduled events on this date</b>
                    </div>
                    {insertForNothingScheduled(existingEvents).map((event, index) =>
                      event.nothingScheduled ? (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={eventDate + index} className="row add-small-margin-bottom">
                          <div className="col-xs-12">{event.eventDescription}</div>
                        </div>
                      ) : (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={eventDate + index} className="row add-small-margin-bottom">
                          <div className="col-xs-4">
                            {event.startTime}
                            {event.endTime && ' - '}
                            {event.endTime}
                          </div>
                          <div className="col-xs-8">
                            <b>
                              {event.eventDescription}
                              {getStatus(event.eventStatus, event.excluded)}
                            </b>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

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
      </Page>
    )
  }
}

AddAppointment.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,

  // mapStateToProps
  offendersAgencyId: PropTypes.string.isRequired,
  offenderNo: PropTypes.string.isRequired,
  offenderName: PropTypes.string.isRequired,
  eventDate: PropTypes.instanceOf(moment),
  error: PropTypes.string,
  locale: PropTypes.string.isRequired,
  viewModel: PropTypes.shape({
    appointmentTypes: PropTypes.arrayOf(
      PropTypes.shape({ description: PropTypes.string.isRequired, code: PropTypes.string.isRequired })
    ).isRequired,
    locations: PropTypes.arrayOf(
      PropTypes.shape({ description: PropTypes.string.isRequired, locationId: PropTypes.number.isRequired })
    ).isRequired,
  }).isRequired,
  existingEvents: PropTypes.arrayOf(
    PropTypes.shape({
      eventId: PropTypes.number,
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string,
      eventDescription: PropTypes.string.isRequired,
      eventStatus: PropTypes.string,
    })
  ),

  // mapDispatchToProps
  boundViewDetails: PropTypes.func.isRequired,
  goBackToBookingDetails: PropTypes.func.isRequired,
  loadViewModel: PropTypes.func.isRequired,
  loadExistingEvents: PropTypes.func.isRequired,
}

AddAppointment.defaultProps = {
  error: '',
  eventDate: null,
  existingEvents: undefined,
}

const mapDispatchToProps = (dispatch, props) => ({
  boundViewDetails: offenderNo => dispatch(viewDetails(offenderNo, DETAILS_TABS.ADD_APPOINTMENT)),
  goBackToBookingDetails: offenderNo => dispatch(viewDetails(offenderNo, DETAILS_TABS.QUICK_LOOK)),
  loadViewModel: agencyId => dispatch(loadAppointmentViewModel(agencyId)),
  loadExistingEvents: (agencyId, date, offenderNo) => dispatch(lee(agencyId, date, offenderNo)),
  onSubmit: createFormAction(
    formData => ({
      type: APPOINTMENT.ADD,
      payload: {
        ...formData.toJS(),
        offenderNo: props.match.params.offenderNo,
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

  const { offenderNo } = props.match.params
  const offenderDetails =
    immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', offenderNo, 'Data']) || offenderDetailsModel
  const offendersAgencyId = offenderDetails.getIn(['assignedLivingUnit', 'agencyId'])
  const offenderName = toFullName({
    firstName: offenderDetails.get('firstName'),
    lastName: offenderDetails.get('lastName'),
  })

  const eventDate = formValueSelector('addAppointment')(immutableState, 'eventDate')
  const viewModel = (
    immutableState.getIn(['eliteApiLoader', 'AppointmentTypesAndLocations']) ||
    Map({
      appointmentTypes: [],
      locations: [],
    })
  ).toJS()

  const maybeEvents = immutableState.getIn(['eliteApiLoader', 'ExistingEvents'])
  const existingEvents = maybeEvents && maybeEvents.toJS()

  return {
    locale,
    offenderNo,
    offenderDetails,
    offendersAgencyId,
    offenderName,
    eventDate,
    viewModel,
    existingEvents,
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
