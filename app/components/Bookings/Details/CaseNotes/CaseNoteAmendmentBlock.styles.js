import styled from 'react-emotion'
import { GREY_3 } from 'govuk-colours'
import { SPACING, NTA_LIGHT } from '@govuk-react/constants'

export const AmendmentBlock = styled('div')`
  background: ${GREY_3};
  padding: ${SPACING.SCALE_3};
  margin-bottom: ${SPACING.SCALE_3};
`

export const AmendmentText = styled('pre')`
  margin-bottom: ${SPACING.SCALE_3};
  font-family: ${NTA_LIGHT};
  white-space: pre-wrap;
  word-break: break-all;
`

export const AmendmentDate = styled('div')`
  font-weight: 700;
`
