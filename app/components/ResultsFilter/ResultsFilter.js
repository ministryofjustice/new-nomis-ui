import styled from 'styled-components'
import { spacing } from '@govuk-react/lib'
import { GREY_2 } from 'govuk-colours'
import { BREAKPOINTS, SPACING } from '@govuk-react/constants'

// eslint-disable-next-line import/prefer-default-export
const ResultsFilter = styled.div`
  display: none;

  @media screen and (min-width: ${BREAKPOINTS.DESKTOP}) {
    display: flex;
    flex-wrap: wrap;
    border-bottom: ${props => (props.noBorder ? 'none' : `1px solid ${GREY_2}`)};
    ${spacing.withWhiteSpace({ padding: { size: 4, direction: 'bottom' } })}

    div {
      margin-right: ${SPACING.SCALE_3};
    }
  }
`

export default ResultsFilter
