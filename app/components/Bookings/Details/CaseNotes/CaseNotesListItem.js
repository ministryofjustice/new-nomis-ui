import React from 'react'
import PropTypes from 'prop-types'
import Header from '@govuk-react/header'
import ImmutablePropTypes from 'react-immutable-proptypes'
import uuid from 'uuid/v4'

import { FormattedDate, FormattedTime, FormattedDay } from '../../../intl'
import CaseNoteAmendmentBlock from './CaseNoteAmendmentBlock'
import { userType } from '../../../../types'
import {
  CaseNote,
  CaseNoteCreationDetails,
  CaseNoteContent,
  CaseNoteText,
  CaseNoteOccurrence,
  CaseNoteAmendmentButton,
} from './CaseNotesListItem.theme'

const CaseNoteListItem = ({ caseNote, user, offenderNo, caseNoteListReferrer }) => {
  const {
    caseNoteId,
    authorName,
    originalNoteText,
    amendments,
    occurrenceDateTime,
    creationDateTime,
    subTypeDescription,
    typeDescription,
    staffId,
  } = caseNote.toJS()

  const sameCreator = () => {
    if (!caseNote || !staffId || !user.staffId) return true

    return staffId === user.staffId
  }

  return (
    <CaseNote>
      <CaseNoteCreationDetails>
        <FormattedDay value={creationDateTime} />
        <FormattedDate value={creationDateTime} />
        <FormattedTime value={creationDateTime} />
        {authorName}
      </CaseNoteCreationDetails>

      <CaseNoteContent>
        <Header level={2} size="SMALL">
          {typeDescription} | {subTypeDescription}
        </Header>
        {occurrenceDateTime && (
          <CaseNoteOccurrence>
            Occurrence date:{' '}
            <span>
              <FormattedDay value={occurrenceDateTime} /> - <FormattedDate value={occurrenceDateTime} /> -{' '}
              <FormattedTime value={occurrenceDateTime} />
            </span>
          </CaseNoteOccurrence>
        )}
        <CaseNoteText>{originalNoteText}</CaseNoteText>
        {amendments.length > 0 &&
          amendments.map(amendment => <CaseNoteAmendmentBlock amendment={amendment} key={uuid()} />)}
        {sameCreator() && (
          <CaseNoteAmendmentButton
            to={{
              pathname: `/offenders/${offenderNo}/case-notes/${caseNoteId}/amend-case-note`,
              state: { from: caseNoteListReferrer },
            }}
          >
            <button type="button" className="button-cancel">
              Make amendment
            </button>
          </CaseNoteAmendmentButton>
        )}
      </CaseNoteContent>
    </CaseNote>
  )
}

CaseNoteListItem.propTypes = {
  caseNote: ImmutablePropTypes.map.isRequired,
  user: userType.isRequired,
  offenderNo: PropTypes.string.isRequired,
  caseNoteListReferrer: PropTypes.string.isRequired,
}

export default CaseNoteListItem
