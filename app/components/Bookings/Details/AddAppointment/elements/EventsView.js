import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import styled from 'styled-components'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import { spacing, typography } from '@govuk-react/lib'
import { H3 } from '@govuk-react/heading'

const getStatus = (eventStatus, excluded) => {
  if (excluded) {
    return ' (temporarily removed)'
  }
  return ''
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

const StyledEventsView = styled.div`
  ${spacing.withWhiteSpace({ marginBottom: 6 })}
  ${spacing.responsivePadding(3)}
  ${typography.font({ size: 16 })}
  background: #E9F3F9;
`

const Event = styled.div`
  ${spacing.withWhiteSpace({ marginBottom: 2 })}

  &:last-of-type {
    margin-bottom: 0;
  }
`

const EventsView = ({ events, eventDate }) =>
  events ? (
    <StyledEventsView id="other-events">
      <H3 size="SMALL">Other scheduled events on this date</H3>

      {insertForNothingScheduled(events).map((event, index) => (
        <Event data-qa="event">
          {event.nothingScheduled ? (
            // eslint-disable-next-line react/no-array-index-key
            <GridRow key={eventDate + index}>
              <GridCol>{event.eventDescription}</GridCol>
            </GridRow>
          ) : (
            // eslint-disable-next-line react/no-array-index-key
            <GridRow key={eventDate + index}>
              <GridCol setWidth="one-quarter">
                {event.startTime}
                {event.endTime && ' - '}
                {event.endTime}
              </GridCol>
              <GridCol setWidth="three-quarters">
                <strong>
                  {event.eventDescription}
                  {getStatus(event.eventStatus, event.excluded)}
                </strong>
              </GridCol>
            </GridRow>
          )}
        </Event>
      ))}
    </StyledEventsView>
  ) : null

EventsView.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      eventId: PropTypes.number,
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string,
      eventDescription: PropTypes.string.isRequired,
      eventStatus: PropTypes.string,
    })
  ),
  eventDate: PropTypes.instanceOf(moment),
}
EventsView.defaultProps = {
  eventDate: undefined,
  events: undefined,
}

export default EventsView
