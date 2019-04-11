import styled from 'styled-components'
import { spacing } from '@govuk-react/lib'
import { BORDER_WIDTH, MEDIA_QUERIES } from '@govuk-react/constants'
import { BORDER_COLOUR } from 'govuk-colours'

export const FauxField = styled.div`
  ${spacing.withWhiteSpace({ marginBottom: 6 })}
`

export const ConditionalInset = styled.div`
  ${spacing.withWhiteSpace({ marginBottom: 6 })}
  ${spacing.withWhiteSpace({ padding: { size: 5, direction: 'left' } })}
  border-left: ${BORDER_WIDTH} solid ${BORDER_COLOUR}
`

export const TimeContainer = styled.div`
  ${MEDIA_QUERIES.TABLET} {
    display: flex;

    label {
      :first-of-type {
        margin-right: ${spacing.simple(3)}px;
      }
    }
  }
`

export const ButtonContainer = styled.div`
  button {
    ${MEDIA_QUERIES.TABLET} {
      ${spacing.responsiveMargin({ size: 3, direction: 'right' })}
    }
  }
`
