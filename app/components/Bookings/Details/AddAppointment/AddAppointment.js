import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Field } from 'redux-form/immutable'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import TextArea from '@govuk-react/text-area'
import Button from '@govuk-react/button'

import Page from '../../../Page'
import { DatePicker, localizedDateToMoment, momentToLocalizedDate } from '../../../FormComponents/DatePicker'
import { Select, TimePicker, ButtonCancel } from '../../../FormComponents'
import NumberInput from './elements/NumberInput'
import EventsView from './elements/EventsView'
import Checkbox from './elements/Checkbox'
import { FauxField, ConditionalInset, TimeContainer, ButtonContainer } from './AddAppointment.styles'
import { DATE_ONLY_FORMAT_SPEC } from '../../../../containers/App/constants'

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
    if (newValue) loadExistingEvents(offendersAgencyId, newValue.format(DATE_ONLY_FORMAT_SPEC), offenderNo)
  }

  if (!viewModel) return <div />

  if (error) window.scrollTo(0, 0)

  return (
    <Page title="Add new appointment">
      <div className="add-appointment">
        <form onSubmit={handleSubmit}>
          <GridRow>
            <GridCol setWidth="two-thirds">
              {error && (
                <div className="error-summary">
                  <div className="error-message">{error}</div>
                </div>
              )}

              <FauxField>
                <div>Name</div>
                <strong data-qa="offender-name">
                  {offenderName} ({offenderNo})
                </strong>
              </FauxField>

              <Field name="appointmentType" label="Select type of appointment" component={Select}>
                {viewModel.appointmentTypes.map(type => (
                  <option value={type.code}>{type.description}</option>
                ))}
              </Field>

              <Field name="location" label="Select location" component={Select}>
                {viewModel.locations.map(location => (
                  <option value={location.locationId}>{location.description}</option>
                ))}
              </Field>

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

              <EventsView events={existingEvents} eventDate={eventDate} />

              <TimeContainer>
                <Field
                  name="startTime"
                  title="Start time"
                  component={TimePicker}
                  date={eventDate}
                  now={moment()}
                  futureTimeOnly
                />

                <Field
                  className="add-gutter-top"
                  name="endTime"
                  title="End time (optional)"
                  component={TimePicker}
                  date={eventDate}
                  now={moment()}
                  futureTimeOnly
                />
              </TimeContainer>

              <Field name="recurringAppointment" component={Checkbox}>
                This is a recurring appointment
              </Field>

              {recurringAppointment && (
                <ConditionalInset>
                  <Field name="repeatPeriod" label="Repeats" component={Select} mb={6}>
                    <option value="" disabled hidden>
                      Select
                    </option>
                    <option value="DAILY">Daily</option>
                    <option value="WEEKDAYS">Weekdays</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="FORTNIGHTLY">Fortnightly</option>
                    <option value="MONTHLY">Monthly</option>
                  </Field>

                  <Field name="repeatCount" hint={['Up to a maximum of 1 year']} component={NumberInput} type="number">
                    Occurrences
                  </Field>

                  <div>Last appointment on</div>
                  <strong>{lastRepeatDate ? lastRepeatDate.format('dddd Do MMMM Y') : '\u2014'}</strong>
                </ConditionalInset>
              )}

              <Field name="comment" component={TextArea} autocomplete="off" spellcheck="true" mb={6}>
                Comments (optional)
              </Field>

              <ButtonContainer>
                <Button type="submit" disabled={submitting}>
                  Add appointment
                </Button>
                <ButtonCancel
                  onClick={e => {
                    e.preventDefault()
                    goBackToBookingDetails(offenderNo)
                  }}
                >
                  Cancel
                </ButtonCancel>
              </ButtonContainer>
            </GridCol>
          </GridRow>
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
