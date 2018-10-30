import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { FormattedDate, FormattedTime } from '../../../intl'
import { DETAILS_TABS } from '../../../../containers/Bookings/constants'
import { DateTimeBlock2 } from './sharedCaseNoteComponents'
import { linkOnClick } from '../../../../helpers'
import { PreStyle } from './listItem.theme'
import './details-page.scss'

const AmendmentBlock = ({ dateTime, authorName, text }) => (
  <div className="row amendment add-gutter-top">
    <div className="content">
      <h2 className="heading-small">Amendment</h2>
      <pre>
        <PreStyle>{text}</PreStyle>
      </pre>
      <h2 className="heading-small">
        <DateTimeBlock2 dateTime={dateTime} />
      </h2>

      <div>{authorName}</div>
    </div>
  </div>
)

const sameCreator = ({ currentStaffId, caseNote }) => {
  if (!caseNote) {
    return true
  }
  const caseNoteStaffId = caseNote.get('staffId')
  if (!caseNoteStaffId || !currentStaffId) {
    return true
  }
  return caseNoteStaffId === currentStaffId
}

const CaseNoteDetails = props => {
  const { caseNote, backToCaseNotes, addAmendment, caseNoteId, offenderNo } = props

  if (!caseNote) {
    return <div>Loading..</div>
  }

  const {
    authorName,
    originalNoteText,
    occurrenceDateTime,
    creationDateTime,
    subTypeDescription,
    typeDescription,
    amendments,
  } = caseNote.toJS()

  const amendmentList = amendments.map(am => (
    <AmendmentBlock
      key={am.creationDateTime}
      data-name="AmendmentBlock"
      dateTime={am.creationDateTime}
      authorName={am.authorName}
      text={am.additionalNoteText}
    />
  ))

  return (
    <div className="case-note-details">
      <div className="row add-gutter-top">
        <div className="col-lg-2 add-gutter-bottom">
          <a className="link clickable" {...linkOnClick(() => backToCaseNotes(offenderNo))}>
            &lt; Back to list
          </a>
        </div>

        <div className="col-lg-7">
          <h2 className="heading-medium">
            {typeDescription} {'|'} {subTypeDescription}
          </h2>

          <pre>
            <PreStyle>{originalNoteText}</PreStyle>
          </pre>

          <h2 className="heading-small">
            <DateTimeBlock2 dateTime={creationDateTime} />
          </h2>

          <div>{authorName}</div>

          {occurrenceDateTime && (
            <div>
              <span className="right-padding"> Occurrence date: </span>
              <span>
                <FormattedDate value={occurrenceDateTime} /> - <FormattedTime value={occurrenceDateTime} />
              </span>
            </div>
          )}

          {amendmentList}

          {sameCreator(props) && (
            <div className="add-gutter-top add-gutter-bottom">
              <button type="button" className="button-cancel" onClick={() => addAmendment(offenderNo, caseNoteId)}>
                Make amendment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

CaseNoteDetails.propTypes = {
  caseNote: PropTypes.object.isRequired,
}

export function mapDispatchToProps(dispatch) {
  return {
    backToCaseNotes: offenderNo => dispatch(push(`/offenders/${offenderNo}/${DETAILS_TABS.CASE_NOTES}`)),
    addAmendment: (offenderNo, caseNoteId) =>
      dispatch(push(`/offenders/${offenderNo}/case-notes/${caseNoteId}/amendCaseNote`)),
  }
}

function getCurrentStaffId(state) {
  const auth = state.get('authentication')
  const user = auth && auth.get('user')
  return user && user.staffId
}

const mapStateToProps = (state, props) => ({
  offenderNo: props.offenderNo,
  caseNoteId: props.caseNoteId,
  currentStaffId: getCurrentStaffId(state),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CaseNoteDetails)
