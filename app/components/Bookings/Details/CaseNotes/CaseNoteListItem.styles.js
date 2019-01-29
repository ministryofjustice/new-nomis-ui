import styled from 'react-emotion'
import { Link } from 'react-router-dom'
import { GREY_2 } from 'govuk-colours'
import { SPACING, MEDIA_QUERIES, NTA_LIGHT } from '@govuk-react/constants'

export const CaseNote = styled('div')`
  border-bottom: 1px solid ${GREY_2};
  padding-top: ${SPACING.SCALE_3};

  ${MEDIA_QUERIES.LARGESCREEN} {
    display: flex;
    padding-top: ${SPACING.SCALE_5};
    padding-bottom: ${SPACING.SCALE_3};
  }
`

export const CaseNoteCreationDetails = styled('div')`
  margin-bottom: ${SPACING.SCALE_3};

  ${MEDIA_QUERIES.LARGESCREEN} {
    margin-bottom: 0;
    width: 20%;
  }

  span {
    margin-right: ${SPACING.SCALE_1};
    font-weight: 700;

    ${MEDIA_QUERIES.LARGESCREEN} {
      margin-right: 0;
      display: block;
    }
  }
`

export const CaseNoteContent = styled('div')`
  ${MEDIA_QUERIES.LARGESCREEN} {
    flex: 1 0 auto;
    max-width: 55%;
  }
`

export const CaseNoteOccurrence = styled('div')`
  margin-bottom: ${SPACING.SCALE_3};

  span {
    font-weight: 700;
  }
`

export const CaseNoteText = styled('pre')`
  margin-bottom: ${SPACING.SCALE_3};
  font-family: ${NTA_LIGHT};
  white-space: pre-wrap;
`

export const CaseNoteAmendmentButton = styled(Link)`
  display: block;
  margin-bottom: ${SPACING.SCALE_3};
`
