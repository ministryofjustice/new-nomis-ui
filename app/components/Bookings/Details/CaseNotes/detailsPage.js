import React from 'react';
import PropTypes from 'prop-types';

// import Button from 'components/Button';

import {
} from 'components/List/listItem';

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

function amendmentBlock({ dateTime, userId, text, source }) {
  return (<Amendment>
    <AmendmentHeader>
      <div>{userId}</div>
      <div>Source: {source}</div>
    </AmendmentHeader>
    <AmendmentTitle>Amended {dateTime}</AmendmentTitle>
    <AmendmentText>{text}</AmendmentText>
  </Amendment>);
}
amendmentBlock.propTypes = {
  dateTime: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
};

function CaseNoteDetails(props) {
  const { viewList } = props;
  const { authorUserId, creationDateTime, subType, type, subTypeData, typeData, caseNoteId, source, splitInfo } = props.caseNote.toJS(); // amendments
  let amendments = null;
  if (splitInfo.amendments && splitInfo.amendments.length > 0) {
    amendments = splitInfo.amendments.map((am) => amendmentBlock({ ...am, source }));
  }
  return (
    <div>
      <CaseNoteDetailsWrapper>
        <CaseNoteDetailsLeft>
          <CaseNoteIdBlock>Case Note ID: {caseNoteId}</CaseNoteIdBlock>
          <DateTimeBlock creationDateTime={creationDateTime} />
          <AmendmentButton buttonstyle="link">Make amendment</AmendmentButton>
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
};

export default CaseNoteDetails;
