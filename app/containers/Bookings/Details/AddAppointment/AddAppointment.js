import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Field } from 'redux-form/immutable'

import InputField from '@govuk-react/input-field'
import GovUkCheckbox from '@govuk-react/checkbox'

import Page from '../../../../components/Page'
import Select from '../../../../components/FormComponents/SelectWithLabel'
import {
  DatePicker,
  localizedDateToMoment,
  momentToLocalizedDate,
} from '../../../../components/FormComponents/DatePicker'
import TimePicker from '../../../../components/FormComponents/TimePicker'
import { TextArea } from '../../../../components/FormComponents'
import { metaType } from '../../../../types'
import EventsView from './EventsView'

import { DATE_ONLY_FORMAT_SPEC } from '../../../App/constants'

import './index.scss'

const Checkbox = ({ input, meta, children }) => (
  <GovUkCheckbox
    name={input.name}
    checked={input.checked}
    onChange={input.onChange}
    onFocus={input.onFocus}
    onBlur={input.onBlur}
    meta={meta}
  >
    {children}
  </GovUkCheckbox>
)
Checkbox.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  }).isRequired,
  meta: metaType.isRequired,
  children: PropTypes.node.isRequired,
}

const NumberInput = ({ input, meta, children, hint }) => (
  <InputField
    input={{
      ...input,
      type: 'number',
    }}
    meta={meta}
    hint={hint}
  >
    {children}
  </InputField>
)

NumberInput.propTypes = {
  hint: PropTypes.node,
  input: PropTypes.shape({
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    value: PropTypes.any,
  }),
  meta: PropTypes.shape({
    active: PropTypes.bool,
    dirty: PropTypes.bool,
    dirtySinceLastSubmit: PropTypes.bool,
    error: PropTypes.any,
    initial: PropTypes.any,
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    submitError: PropTypes.any,
    submitFailed: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    touched: PropTypes.bool,
    valid: PropTypes.bool,
    visited: PropTypes.bool,
  }),
  children: PropTypes.node.isRequired,
}

NumberInput.defaultProps = {
  hint: undefined,
  input: {},
  meta: {},
}

const AddAppointment = ({
  handleSubmit,
  error,
  submitting,
  locale,
  goBackToBookingDetails,
  offenderNo,
  offenderName,
  viewModel,
  existingEvents,
  loadExistingEvents,
  eventDate,
  recurringAppointment,
  lastRepeatDate,
  offendersAgencyId,
}) => {
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

          <EventsView events={existingEvents} eventDate={eventDate} />

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
            <div className="col-md-6 no-left-gutter">
              <Field name="recurringAppointment" title="Recurring appointment" component={Checkbox}>
                This is a recurring appointment
              </Field>
            </div>
          </div>
          {recurringAppointment && (
            <div className="inset">
              <div className="row">
                <div className="col-md-4 no-left-gutter">
                  <Field
                    name="repeatPeriod"
                    title="Repeats"
                    component={Select}
                    options={[
                      { label: 'Daily', value: 'DAILY' },
                      { label: 'Weekdays', value: 'WEEKDAYS' },
                      { label: 'Weekly', value: 'WEEKLY' },
                      { label: 'Fortnightly', value: 'FORTNIGHTLY' },
                      { label: 'Monthly', value: 'MONTHLY' },
                    ]}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 no-left-gutter">
                  <Field
                    name="repeatCount"
                    title="Occurrences"
                    hint={['Up to a maximum of 1 year']}
                    component={NumberInput}
                  >
                    Occurrences
                  </Field>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 no-left-gutter add-gutter-margin-top">
                  <div>Last appointment on</div>
                  <div className="bold">{lastRepeatDate ? lastRepeatDate.format('dddd Do MMMM Y') : '\u2014'}</div>
                </div>
              </div>
            </div>
          )}

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

AddAppointment.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,

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

  goBackToBookingDetails: PropTypes.func.isRequired,
  loadExistingEvents: PropTypes.func.isRequired,
  offendersAgencyId: PropTypes.string.isRequired,
}

AddAppointment.defaultProps = {
  error: '',
  eventDate: undefined,
  existingEvents: undefined,
  recurringAppointment: false,
  lastRepeatDate: undefined,
}

export default AddAppointment
