import React from 'react'
import PropTypes from 'prop-types'
import Heading from '@govuk-react/heading'
import uuid from 'uuid/v4'
import Link from '@govuk-react/link'
import { FormattedDate, FormattedDay, FormattedTime } from '../../../intl'
import CaseNoteAmendmentBlock from './CaseNoteAmendmentBlock'
import { caseNoteType, userType } from '../../../../types'
import {
  CaseNote,
  CaseNoteAmendmentButton,
  CaseNoteContent,
  CaseNoteCreation,
  CaseNoteOccurrenceDetails,
  CaseNoteText,
} from './CaseNoteListItem.styles'

const CaseNoteListItem = ({ caseNote, user, offenderNo, caseNoteListReferrer, iepInformation }) => {
  const {
    caseNoteId,
    authorName,
    text,
    amendments,
    occurrenceDateTime,
    creationDateTime,
    subType,
    subTypeDescription,
    typeDescription,
    authorUserId,
  } = caseNote

  const sameCreator = () => {
    if (!caseNote || !authorUserId || !user.userId) return false

    // case notes service can return username for old notes
    return authorUserId === user.userId.toString() || authorUserId === user.username
  }

  const { cellLocation, offenderName } = iepInformation || {}

  const setPrintIepData = () => {
    const incentiveLevelSlipData = {
      type: subTypeDescription,
      raisedDate: creationDateTime,
      raisedBy: authorName,
      issuedBy: user.name,
      offenderNo,
      offenderName,
      caseNote: text,
      cellLocation,
      amendments,
    }

    localStorage.setItem('incentiveLevelSlip', JSON.stringify(incentiveLevelSlipData))
  }

  const showPrintIncentiveLevelLink = ['IEP_WARN', 'IEP_ENC'].includes(subType)

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
        <CaseNoteText>{text}</CaseNoteText>
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
            <button data-qa="make-amendment" type="button" className="button-cancel">
              Make amendment
            </button>
          </CaseNoteAmendmentButton>
        )}
        {showPrintIncentiveLevelLink && (
          <div>
            <Link noVisitedState href="/iep-slip" target="_blank" onClick={setPrintIepData}>
              Print Incentive Level slip
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
