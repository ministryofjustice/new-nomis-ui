import styled from 'react-emotion'
import { SPACING, LINE_HEIGHT, FONT_SIZE, FOCUS_WIDTH } from '@govuk-react/constants'
import { Link } from 'react-router-dom'
import { LINK_COLOUR, LINK_HOVER_COLOUR, GREY_1, FOCUS_COLOUR } from 'govuk-colours'

export const NavigationContainer = styled('div')`
  display: flex;
  align-items: center;
`
export const ContextLinkContainer = styled('span')`
  margin-top: ${SPACING.SCALE_2};
  margin-right: ${SPACING.SCALE_3};
  padding-right: ${SPACING.SCALE_3};
  border-right: 1px solid ${GREY_1};
`
export const ContextLink = styled(Link)`
  font-size: ${FONT_SIZE.SIZE_16};
  line-height: ${LINE_HEIGHT.SIZE_16};
  color: ${LINK_COLOUR};
  &:hover,
  &:active {
    color: ${LINK_HOVER_COLOUR};
  }
  &:focus {
    color: black;
    background-color: ${FOCUS_COLOUR};
    outline: ${FOCUS_WIDTH} solid ${FOCUS_COLOUR};
  }
`
export const Breadcrumbs = styled('div')`
  padding-top: ${SPACING.SCALE_3};
`
export const Container = styled('div')`
  padding-top: ${SPACING.SCALE_4};
  @media print {
    padding-top: 0;
  }
`
