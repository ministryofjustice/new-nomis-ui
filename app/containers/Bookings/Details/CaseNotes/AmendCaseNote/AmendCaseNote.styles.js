import styled from 'styled-components'
import { spacing } from '@govuk-react/lib'
import { MEDIA_QUERIES } from '@govuk-react/constants'

// eslint-disable-next-line import/prefer-default-export
export const ButtonContainer = styled.div`
  button {
    ${MEDIA_QUERIES.TABLET} {
      ${spacing.responsiveMargin({ size: 3, direction: 'right' })}
    }
  }
`
