import React from 'react'
import PropTypes from 'prop-types'
import Heading from '@govuk-react/heading'
import uuid from 'uuid/v4'
import Link from '@govuk-react/link'
import { FormattedDate, FormattedTime, FormattedDay } from '../../../intl'
import CaseNoteAmendmentBlock from './CaseNoteAmendmentBlock'
import { userType, caseNoteType } from '../../../../types'
import {
  CaseNote,
  CaseNoteOccurrenceDetails,
  CaseNoteContent,
  CaseNoteText,
  CaseNoteCreation,
  CaseNoteAmendmentButton,
} from './CaseNoteListItem.styles'

const CaseNoteListItem = ({ caseNote, user, offenderNo, caseNoteListReferrer, iepInformation }) => {
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
  } = caseNote

  const sameCreator = () => {
    if (!caseNote || !staffId || !user.staffId) return true

    return staffId === user.staffId
  }

  const { cellLocation, offenderName } = iepInformation || {}

  const setPrintIepData = () => {
    const iepSlipData = {
      type: subTypeDescription,
      raisedDate: creationDateTime,
      raisedBy: authorName,
      issuedBy: user.name,
      offenderNo,
      offenderName,
      caseNote: originalNoteText,
      cellLocation,
      amendments,
    }

    localStorage.setItem('iepSlip', JSON.stringify(iepSlipData))
  }

  return (
    <CaseNote data-qa="case-note">
      <CaseNoteOccurrenceDetails>
        <FormattedDay value={occurrenceDateTime} />
        <FormattedDate value={occurrenceDateTime} />
        <FormattedTime value={occurrenceDateTime} />
        {authorName}
      </CaseNoteOccurrenceDetails>

      <CaseNoteContent>
        <Heading level={2} size="SMALL">
          {typeDescription} | {subTypeDescription}
        </Heading>
        {creationDateTime && (
          <CaseNoteCreation>
            Creation date:{' '}
            <span>
              <FormattedDay value={creationDateTime} /> - <FormattedDate value={creationDateTime} /> -{' '}
              <FormattedTime value={creationDateTime} />
            </span>
          </CaseNoteCreation>
        )}
        <CaseNoteText>{originalNoteText}</CaseNoteText>
        {amendments &&
          amendments.length > 0 &&
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
        {subTypeDescription.includes('IEP') && (
          <div>
            <Link noVisitedState href="/iep-slip" target="_blank" onClick={setPrintIepData}>
              Print IEP slip
            </Link>
          </div>
        )}
      </CaseNoteContent>
    </CaseNote>
  )
}

CaseNoteListItem.propTypes = {
  caseNote: caseNoteType.isRequired,
  user: userType.isRequired,
  offenderNo: PropTypes.string.isRequired,
  caseNoteListReferrer: PropTypes.string.isRequired,
  iepInformation: PropTypes.shape({ cellLocation: PropTypes.string, offenderName: PropTypes.string }).isRequired,
}

export default CaseNoteListItem
