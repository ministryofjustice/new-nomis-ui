import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

export const StyledEvent = styled('div')`
  margin-bottom: ${SPACING.SCALE_3};

  :last-of-type {
    margin-bottom: 0;
  }
`

export const EventType = styled('div')`
  font-weight: 700;
`

const Event = ({ startTime, endTime, type, shortComment, cancelled }) => (
  <StyledEvent>
    <span className="whereabouts-startTime">{moment(startTime).format('HH:mm')}</span>
    {endTime && (
      <Fragment>
        {' '}
        - <span className="whereabouts-endTime"> {moment(endTime).format('HH:mm')} </span>
      </Fragment>
    )}
    <EventType>{type}</EventType>
    {shortComment}
    {cancelled && <span className="cancelled"> (cancelled)</span>}
  </StyledEvent>
)

Event.propTypes = {
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string,
  type: PropTypes.string.isRequired,
  shortComment: PropTypes.string,
  cancelled: PropTypes.bool.isRequired,
}

Event.defaultProps = {
  endTime: null,
  shortComment: '',
}

export default Event
