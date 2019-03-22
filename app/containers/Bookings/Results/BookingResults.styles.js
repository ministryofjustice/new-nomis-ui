import styled from 'styled-components'
import { BREAKPOINTS, SPACING } from '@govuk-react/constants'

// eslint-disable-next-line import/prefer-default-export
export const SortContainer = styled.div`
  display: none;

  @media screen and (min-width: ${BREAKPOINTS.DESKTOP}) {
    display: flex;
    padding: 15px 0;

    div {
      margin-right: ${SPACING.SCALE_3};
    }
  }
`
