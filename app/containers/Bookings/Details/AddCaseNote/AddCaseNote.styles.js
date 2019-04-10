import styled from 'styled-components'
import { spacing, typography } from '@govuk-react/lib'
import { MEDIA_QUERIES } from '@govuk-react/constants'
import { LINK_COLOUR, LINK_HOVER_COLOUR } from 'govuk-colours'

export const FauxField = styled.div`
  ${spacing.withWhiteSpace({ marginBottom: 6 })}
`

export const ButtonContainer = styled.div`
  button {
    ${MEDIA_QUERIES.TABLET} {
      ${spacing.responsiveMargin({ size: 3, direction: 'right' })}
    }
  }
`

export const ButtonLink = styled.span`
  ${spacing.responsiveMargin({ size: 3, direction: 'left' })}
  ${typography.font({ size: 19 })};
  cursor: pointer;
  text-decoration: underline;
  color: ${LINK_COLOUR};

  &:hover {
    color: ${LINK_HOVER_COLOUR};
  }
`
