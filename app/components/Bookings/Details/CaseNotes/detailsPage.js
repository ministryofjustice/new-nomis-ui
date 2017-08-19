import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedTime } from 'react-intl';

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
  <AmendmentTitle>{text}</AmendmentTitle>
  <AmendmentHeader>
    <EliteOfficerName username={userId} />
  </AmendmentHeader>
  <AmendmentText>
    <FormattedDate value={Date.parse(dateTime)} /> <FormattedTime value={Date.parse(dateTime)} />
  </AmendmentText>
</Amendment>);

AmendmentBlock.propTypes = {
  dateTime: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

function CaseNoteDetails(props) {
  const { viewList, openAmendModal, displayAmendCaseNoteModal } = props;
  const { authorUserId, occurrenceDateTime, subTypeDescription, typeDescription, splitInfo } = props.caseNote.toJS(); // amendments
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
          <div>
            <TypeDescriptionBlock typeDetails={{ typeDescription, subTypeDescription }} />
            <CaseNoteText>{splitInfo.caseNote}</CaseNoteText>
          </div>
          <RightHeader>
            <EliteOfficerName username={authorUserId} />
          </RightHeader>
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
