import styled from 'react-emotion'
import { SPACING, BREAKPOINTS } from '@govuk-react/constants'
import { spacing, typography } from '@govuk-react/lib'
import { BORDER_COLOUR } from 'govuk-colours'

export const DayContainer = styled('div')`
  ${spacing.responsive({ size: 6, property: 'padding', direction: ['top', 'bottom'] })}
  border-bottom: 1px solid ${BORDER_COLOUR};

  &:last-of-type {
    border-bottom: 0;
  }

  @media print {
    padding: ${SPACING.SCALE_3} 0;
  }
`

export const ScheduleFilters = styled('div')`
  border-bottom: 1px solid ${BORDER_COLOUR};

  &:after {
    clear: both;
    content: '';
    display: table;
  }

  @media print {
    display: none;
  }
`

export const TimePeriodsContainer = styled('div')`
  @media print, (min-width: ${BREAKPOINTS.DESKTOP}) {
    flex: 1;
    display: flex;
  }
`

export const TimePeriod = styled('div')`
  margin-bottom: ${SPACING.SCALE_3};

  &:first-of-type {
    margin-left: 0;
    padding-left: 0;
    border-left: 0;
  }

  &:last-of-type {
    margin-bottom: 0;
  }

  @media print, (min-width: ${BREAKPOINTS.DESKTOP}) {
    display: flex;
    flex-direction: column;
    flex: 1 33.3333%;
    margin-bottom: 0;
    margin-left: ${SPACING.SCALE_3};
  }

  @media print {
    padding-left: ${SPACING.SCALE_3};
    border-left: 1px solid ${BORDER_COLOUR};
  }
`

export const EventsContainer = styled('div')`
  ${spacing.responsivePadding(3)}
  flex: 1;
  background-color: ${props => {
    if (props.value === 'morning') return '#e9f3f9'
    if (props.value === 'afternoon') return '#d5e8f4'
    return '#bedcee'
  }};
  ${typography.font({ size: 19 })};

  @media print {
    padding: 0;
    background: none;
    font-size: 14px;
  }
`
