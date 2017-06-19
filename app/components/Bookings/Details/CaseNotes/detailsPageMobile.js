import React from 'react';
import PropTypes from 'prop-types';

// import Button from 'components/Button';

import AmendCaseNoteModal from 'containers/Bookings/details/CaseNotes/AmendCaseNoteModal';

import {
  CaseNoteDetailsWrapper,
  CaseNoteText,
  CaseNoteIdBlock,
  AmendmentButton,
  Amendment,
  AmendmentTitle,
  AmendmentText,
  DateTimeBlockWrapper,
} from './detailsPageMobile.theme';

import {
  DateTimeBlock,
  TypeDescriptionBlock,
} from './sharedCaseNoteComponents';

const AmendmentBlock = ({ dateTime, userId, text, source }) => (<Amendment data-name={'Amendment'}>
  <AmendmentTitle>Amended {dateTime}</AmendmentTitle>
  <AmendmentText>{text}</AmendmentText>
  <AmendmentText>{userId}</AmendmentText>
  <AmendmentText>Source: {source}</AmendmentText>
</Amendment>);

AmendmentBlock.propTypes = {
  dateTime: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
};

function CaseNoteDetailsMobile(props) {
  const { viewList, displayAmendCaseNoteModal } = props;
  const { authorUserId, creationDateTime, subType, type, subTypeData, typeData, caseNoteId, source, splitInfo } = props.caseNote.toJS(); // amendments
  let amendments = null;
  if (splitInfo.amendments && splitInfo.amendments.length > 0) {
    amendments = splitInfo.amendments.map((am) => <AmendmentBlock data-name={'AmendmentBlock'} dateTime={am.dateTime} key={am.key} userId={am.userId} text={am.text} source={source} />);
  }
  return (
    <div>
      {displayAmendCaseNoteModal ? <AmendCaseNoteModal /> : null}
      <CaseNoteDetailsWrapper data-name={'CaseNoteDetailsWrapper'}>
        <DateTimeBlockWrapper data-name={'DateTimeBlockWrapper'}>
          <DateTimeBlock data-name={'DateTimeBlock'} creationDateTime={creationDateTime} />
        </DateTimeBlockWrapper>
        <TypeDescriptionBlock style={{ fontSize: '30px' }} data-name={'TypeDescriptionBlock'} typeDetails={{ subType, type, subTypeData, typeData }} />
        <CaseNoteText data-name={'CaseNoteText'}>{splitInfo.caseNote}</CaseNoteText>
        <CaseNoteIdBlock data-name={'CaseNoteIdBlock'}>Case Note ID: {caseNoteId}</CaseNoteIdBlock>
        <CaseNoteIdBlock data-name={'CaseNoteIdBlock'}>{authorUserId}</CaseNoteIdBlock>
        <CaseNoteIdBlock data-name={'CaseNoteIdBlock'}>Source: {source}</CaseNoteIdBlock>
        {amendments}
        <AmendmentButton buttonstyle="link" to={'/amendCaseNote'}>Add amendment</AmendmentButton>
        <AmendmentButton buttonstyle="link" onClick={viewList}>Return to List</AmendmentButton>
      </CaseNoteDetailsWrapper>
    </div>
  );
}

CaseNoteDetailsMobile.propTypes = {
  caseNote: PropTypes.object.isRequired,
  viewList: PropTypes.func.isRequired,
  displayAmendCaseNoteModal: PropTypes.bool.isRequired,
};

export default CaseNoteDetailsMobile;
