import React from 'react';
import PropTypes from 'prop-types';
import EliteOfficerName from 'containers/EliteContainers/OfficerName';
import AmendCaseNoteModal from 'containers/Bookings/Details/CaseNotes/AmendCaseNoteModal';

import {
  CaseNoteDetailsWrapper,
  CaseNoteDetailsLeft,
  CaseNoteDetailsRight,
  RightHeader,
  CaseNoteText,
  AmendmentButton,
  Amendment,
  AmendmentHeader,
  AmendmentTitle,
  AmendmentText,
} from './detailsPage.theme';

import {
  DateTimeBlock,
  TypeDescriptionBlock,
} from './sharedCaseNoteComponents';

const AmendmentBlock = ({ dateTime, userId, text }) => (<Amendment>
  <AmendmentHeader>
    <EliteOfficerName username={userId} />
  </AmendmentHeader>
  <AmendmentTitle>Amended {dateTime}</AmendmentTitle>
  <AmendmentText>{text}</AmendmentText>
</Amendment>);

AmendmentBlock.propTypes = {
  dateTime: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

function CaseNoteDetails(props) {
  const { viewList, openAmendModal, displayAmendCaseNoteModal } = props;
  const { authorUserId, occurrenceDateTime, subType, type, subTypeData, typeData, splitInfo } = props.caseNote.toJS(); // amendments
  let amendments = null;
  if (splitInfo.amendments && splitInfo.amendments.length > 0) {
    amendments = splitInfo.amendments.map((am) => <AmendmentBlock dateTime={am.dateTime} key={am.key} userId={am.userId} text={am.text} />);
  }
  return (
    <div>
      {displayAmendCaseNoteModal ? <AmendCaseNoteModal /> : null}
      <CaseNoteDetailsWrapper>
        <CaseNoteDetailsLeft>
          <DateTimeBlock creationDateTime={occurrenceDateTime} />
          <AmendmentButton buttonstyle="link" onClick={openAmendModal}>Make amendment</AmendmentButton>
          <AmendmentButton buttonstyle="link" onClick={viewList}>Return to List</AmendmentButton>
        </CaseNoteDetailsLeft>
        <CaseNoteDetailsRight>
          <RightHeader>
            <EliteOfficerName username={authorUserId} />
          </RightHeader>
          <div>
            <TypeDescriptionBlock typeDetails={{ subType, type, subTypeData, typeData }} />
            <CaseNoteText>{splitInfo.caseNote}</CaseNoteText>
          </div>
          {amendments}
        </CaseNoteDetailsRight>
      </CaseNoteDetailsWrapper>
    </div>
  );
}

CaseNoteDetails.propTypes = {
  caseNote: PropTypes.object.isRequired,
  viewList: PropTypes.func.isRequired,
  openAmendModal: PropTypes.func.isRequired,
  displayAmendCaseNoteModal: PropTypes.bool.isRequired,
};

export default CaseNoteDetails;
