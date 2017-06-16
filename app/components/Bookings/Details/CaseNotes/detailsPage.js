import React from 'react';
import PropTypes from 'prop-types';

// import Button from 'components/Button';

import AmendCaseNoteModal from 'containers/Bookings/Details/CaseNotes/AmendCaseNoteModal';

import {
  CaseNoteDetailsWrapper,
  CaseNoteDetailsLeft,
  CaseNoteDetailsRight,
  RightHeader,
  ReturnToList,
  CaseNoteText,
  CaseNoteIdBlock,
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

const AmendmentBlock = ({ dateTime, userId, text, source }) => (<Amendment>
  <AmendmentHeader>
    <div>{userId}</div>
    <div>Source: {source}</div>
  </AmendmentHeader>
  <AmendmentTitle>Amended {dateTime}</AmendmentTitle>
  <AmendmentText>{text}</AmendmentText>
</Amendment>);

AmendmentBlock.propTypes = {
  dateTime: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
};

function CaseNoteDetails(props) {
  const { viewList, openAmendModal, displayAmendCaseNoteModal } = props;
  const { authorUserId, creationDateTime, subType, type, subTypeData, typeData, caseNoteId, source, splitInfo } = props.caseNote.toJS(); // amendments
  let amendments = null;
  if (splitInfo.amendments && splitInfo.amendments.length > 0) {
    amendments = splitInfo.amendments.map((am) => <AmendmentBlock dateTime={am.dateTime} key={am.key} userId={am.userId} text={am.text} source={source} />);
  }
  return (
    <div>
      {displayAmendCaseNoteModal ? <AmendCaseNoteModal /> : null}
      <CaseNoteDetailsWrapper>
        <CaseNoteDetailsLeft>
          <CaseNoteIdBlock>Case Note ID: {caseNoteId}</CaseNoteIdBlock>
          <DateTimeBlock creationDateTime={creationDateTime} />
          <AmendmentButton buttonstyle="link" onClick={openAmendModal}>Make amendment</AmendmentButton>
        </CaseNoteDetailsLeft>
        <CaseNoteDetailsRight>
          <RightHeader>
            <div>{authorUserId}</div>
            <div>Source: {source}</div>
          </RightHeader>
          <div>
            <TypeDescriptionBlock typeDetails={{ subType, type, subTypeData, typeData }} />
            <CaseNoteText>{splitInfo.caseNote}</CaseNoteText>
          </div>
          {amendments}
        </CaseNoteDetailsRight>
      </CaseNoteDetailsWrapper>
      <ReturnToList onClick={viewList}>Return to List</ReturnToList>
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
