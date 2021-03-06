import React from 'react'
import PropTypes from 'prop-types'
import Heading from '@govuk-react/heading'

import { FormattedDate, FormattedTime, FormattedDay } from '../../../intl'
import { AmendmentBlock, AmendmentText, AmendmentDate } from './CaseNoteAmendmentBlock.styles'

const CaseNoteAmendmentBlock = ({ amendment: { authorName, creationDateTime, additionalNoteText } }) => (
  <AmendmentBlock>
    <Heading level={3} size="SMALL">
      Amendment
    </Heading>
    <AmendmentText>{additionalNoteText}</AmendmentText>

    {creationDateTime && (
      <AmendmentDate>
        <FormattedDay value={creationDateTime} /> - <FormattedDate value={creationDateTime} /> -{' '}
        <FormattedTime value={creationDateTime} />
      </AmendmentDate>
    )}
    {authorName}
  </AmendmentBlock>
)

CaseNoteAmendmentBlock.propTypes = {
  amendment: PropTypes.shape({
    authorName: PropTypes.string.isRequired,
    creationDateTime: PropTypes.string.isRequired,
    additionalNoteText: PropTypes.string.isRequired,
  }).isRequired,
}

export default CaseNoteAmendmentBlock
