import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { formValueSelector, reduxForm } from 'redux-form/immutable'
import { createFormAction } from 'redux-form-saga'
import { Map } from 'immutable'
import moment from 'moment'

import { toFullName } from '../../../../utils/stringUtils'

import { DATE_TIME_FORMAT_SPEC } from '../../../App/constants'

import { loadAppointmentViewModel, loadExistingEvents as lee } from '../../../EliteApiLoader/actions'
import { APPOINTMENT } from '../../../EliteApiLoader/constants'

import { Model as offenderDetailsModel } from '../../../../helpers/dataMappers/offenderDetails'

import { DETAILS_TABS } from '../../constants'
import { viewDetails } from '../../actions'
import AddAppointment from './AddAppointment'

// Assumes start date does not fall on a weekend.
const daysToAddForWeekdaysRepeat = (startDate, repeatCount) => {
  const weekday = startDate.isoWeekday() // 1..7 == Monday .. Sunday. 6, 7 not weekdays.
  const weeks = Math.floor((repeatCount - 1) / 5)
  const remainder = (repeatCount - 1) % 5

  return weeks * 7 + (remainder + weekday > 5 ? remainder + 2 : remainder)
}

export const calculateLastRepeatDate = (startDateTime, repeatPeriod, repeatCount) => {
  if (!(startDateTime && repeatPeriod && repeatCount)) return undefined
  if (repeatCount < 1) return undefined
  const startDate = startDateTime.clone().startOf('day')

  switch (repeatPeriod) {
    case 'DAILY':
      return startDate.add(repeatCount - 1, 'days')

    case 'WEEKDAYS': {
      if (startDate.isoWeekday() > 5) return undefined // Function not defined for weekend start day
      return startDate.add(daysToAddForWeekdaysRepeat(startDate, repeatCount), 'days')
    }

    case 'WEEKLY':
      return startDate.add(repeatCount - 1, 'weeks')

    case 'FORTNIGHTLY':
      return startDate.add((repeatCount - 1) * 2, 'weeks')

    case 'MONTHLY':
      return startDate.add(repeatCount - 1, 'months')

    default:
      return undefined
  }
}

class AddAppointmentContainer extends Component {
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

  render = () => <AddAppointment {...this.props} />
}

AddAppointmentContainer.propTypes = {
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
  recurringAppointment: PropTypes.bool,
  lastRepeatDate: PropTypes.instanceOf(moment),

  // mapDispatchToProps
  boundViewDetails: PropTypes.func.isRequired,
  goBackToBookingDetails: PropTypes.func.isRequired,
  loadViewModel: PropTypes.func.isRequired,
  loadExistingEvents: PropTypes.func.isRequired,
}

AddAppointmentContainer.defaultProps = {
  error: '',
  eventDate: null,
  existingEvents: undefined,
  recurringAppointment: false,
  lastRepeatDate: undefined,
}

const mapDispatchToProps = (dispatch, props) => ({
  boundViewDetails: offenderNo => dispatch(viewDetails(offenderNo, DETAILS_TABS.ADD_APPOINTMENT)),
  goBackToBookingDetails: offenderNo => dispatch(viewDetails(offenderNo, DETAILS_TABS.QUICK_LOOK)),
  loadViewModel: agencyId => dispatch(loadAppointmentViewModel(agencyId)),
  loadExistingEvents: (agencyId, date, offenderNo) => dispatch(lee(agencyId, date, offenderNo)),
  onSubmit: createFormAction(
    formData => {
      const {
        appointmentType,
        location,
        startTime,
        endTime,
        recurringAppointment,
        repeatPeriod,
        repeatCount,
        comment,
      } = formData.toJS()

      const payload = {
        offenderNo: props.match.params.offenderNo,
        detail: {
          appointmentDefaults: {
            appointmentType,
            locationId: location,
            startTime,
            endTime,
            comment,
          },
        },
      }

      if (recurringAppointment) {
        payload.detail.repeat = {
          repeatPeriod,
          count: repeatCount,
        }
      }

      return {
        type: APPOINTMENT.ADD,
        payload,
      }
    },
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

  const formSelector = formValueSelector('addAppointment')
  const eventDate = formSelector(immutableState, 'eventDate')
  const recurringAppointment = formSelector(immutableState, 'recurringAppointment')
  const viewModel = (
    immutableState.getIn(['eliteApiLoader', 'AppointmentTypesAndLocations']) ||
    Map({
      appointmentTypes: [],
      locations: [],
    })
  ).toJS()

  const maybeEvents = immutableState.getIn(['eliteApiLoader', 'ExistingEvents'])
  const existingEvents = maybeEvents && maybeEvents.toJS()

  const lastRepeatDate = calculateLastRepeatDate(
    eventDate,
    formSelector(immutableState, 'repeatPeriod'),
    formSelector(immutableState, 'repeatCount')
  )

  return {
    locale,
    offenderNo,
    offenderDetails,
    offendersAgencyId,
    offenderName,
    eventDate,
    viewModel,
    existingEvents,
    recurringAppointment,
    lastRepeatDate,
  }
}

export const validate = (form, props) => {
  if (!form) return {}

  const {
    startTime,
    endTime,
    appointmentType,
    location,
    eventDate,
    recurringAppointment,
    repeatPeriod,
    repeatCount,
    comment,
  } = form.toJS()
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

  if (recurringAppointment === true) {
    if (repeatCount < 1) {
      error.repeatCount = 'Number of times must be at least 1'
    }
    if (!repeatPeriod) {
      error.repeatPeriod = 'Select a repeat period'
    }
    if (repeatPeriod === 'WEEKDAYS') {
      if (eventDate && eventDate.isoWeekday() > 5) {
        error.repeatPeriod = 'Start day must be Monday - Friday for weekday repeats'
      }
    }
    const lastAppointmentDate = calculateLastRepeatDate(eventDate, repeatPeriod, repeatCount)
    if (
      lastAppointmentDate &&
      lastAppointmentDate.isSameOrAfter(
        now
          .clone()
          .startOf('day')
          .add(1, 'years')
      )
    ) {
      error.repeatCount = 'Date of last appointment must be less than one year from today'
    }
  }

  if (comment && comment.length > 3600) {
    error.comment = 'Maximum length should not exceed 3600 characters'
  }

  return error
}

const theReduxForm = reduxForm({
  form: 'addAppointment',
  validate,
  initialValues: Map({ repeatCount: '1', recurringAppointment: false }),
})(AddAppointmentContainer)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(theReduxForm)
