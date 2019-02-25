import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import './index.scss'

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

const EventsView = ({ events, eventDate }) =>
  events ? (
    <div className="row">
      <div className="col-md-8 col-xs-12 add-gutter-margin-bottom font-xsmall no-left-padding">
        <div id="other-events" className="shaded add-gutter-padding-bottom">
          <div className="row col-xs-12 add-gutter-margin-top add-gutter-margin-bottom">
            <b>Other scheduled events on this date</b>
          </div>
          {insertForNothingScheduled(events).map((event, index) =>
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
