import React from 'react';
import PropTypes from 'prop-types';

import EliteOfficerName from 'containers/EliteContainers/OfficerName';

import {
  CaseNoteDetailsWrapper,
  CaseNoteText,
  CaseNoteIdBlock,
  ButtonWrapper,
  NavButton,
  Amendment,
  AmendmentTitle,
  AmendmentText,
  DateTimeBlockWrapper,
} from './detailsPageMobile.theme';

import {
  DateTimeBlock,
  TypeDescriptionBlock,
} from './sharedCaseNoteComponents';

const AmendmentBlock = ({ dateTime, userId, text }) => (<Amendment data-name={'Amendment'}>
  <AmendmentTitle>{text}</AmendmentTitle>
  <AmendmentText><EliteOfficerName username={userId} /></AmendmentText>
  <AmendmentText>Amended {dateTime}</AmendmentText>
</Amendment>);

AmendmentBlock.propTypes = {
  dateTime: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

function CaseNoteDetailsMobile(props) {
  const { viewList } = props;
  const { authorUserId, occurrenceDateTime, subTypeDescription, typeDescription, splitInfo } = props.caseNote.toJS(); // amendments
  let amendments = null;
  if (splitInfo.amendments && splitInfo.amendments.length > 0) {
    amendments = splitInfo.amendments.map((am) => <AmendmentBlock data-name={'AmendmentBlock'} dateTime={am.dateTime} key={am.key} userId={am.userId} text={am.text} />);
  }
  return (
    <div>
      <CaseNoteDetailsWrapper data-name={'CaseNoteDetailsWrapper'}>
        <ButtonWrapper>
          <NavButton buttonstyle="link" to={'/amendCaseNote'}>Add Amendment</NavButton>
        </ButtonWrapper>
        <DateTimeBlockWrapper data-name={'DateTimeBlockWrapper'}>
          <DateTimeBlock data-name={'DateTimeBlock'} creationDateTime={occurrenceDateTime} />
        </DateTimeBlockWrapper>
        <TypeDescriptionBlock style={{ fontSize: '30px' }} data-name={'TypeDescriptionBlock'} typeDetails={{ typeDescription, subTypeDescription }} />
        <CaseNoteText data-name={'CaseNoteText'}>{splitInfo.caseNote}</CaseNoteText>
        <CaseNoteIdBlock data-name={'CaseNoteIdBlock'}><EliteOfficerName username={authorUserId} /></CaseNoteIdBlock>
        {amendments}
        <ButtonWrapper>
          <NavButton buttonstyle="link" onClick={viewList}>Return to List</NavButton>
        </ButtonWrapper>
      </CaseNoteDetailsWrapper>
    </div>
  );
}

CaseNoteDetailsMobile.propTypes = {
  caseNote: PropTypes.object.isRequired,
  viewList: PropTypes.func.isRequired
};

export default CaseNoteDetailsMobile;
