import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedTime } from 'react-intl';

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

const AmendmentBlock = ({ dateTime, authorName, text }) => (<Amendment>
  <AmendmentTitle>{text}</AmendmentTitle>
  <AmendmentHeader>
    {authorName}
  </AmendmentHeader>
  <AmendmentText>
    <FormattedDate value={Date.parse(dateTime)} /> <FormattedTime value={Date.parse(dateTime)} />
  </AmendmentText>
</Amendment>);

AmendmentBlock.propTypes = {
  dateTime: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

function CaseNoteDetails(props) {
  const { viewList, openAmendModal, displayAmendCaseNoteModal } = props;
  const { authorName, originalNoteText, occurrenceDateTime, subTypeDescription, typeDescription, amendments } = props.caseNote.toJS(); // amendments
  let amendmentList = null;
  if (amendments && amendments.length > 0) {
    amendmentList = amendments.map((am) => <AmendmentBlock data-name={'AmendmentBlock'} dateTime={am.creationDateTime} authorName={am.authorName} text={am.additionalNoteText} />);
  }
  return (
    <div>
      {displayAmendCaseNoteModal ? <AmendCaseNoteModal /> : null}
      <CaseNoteDetailsWrapper>
        <CaseNoteDetailsLeft>
          <DateTimeBlock dateTime={occurrenceDateTime} />
          <AmendmentButton buttonstyle="link" onClick={openAmendModal}>Make amendment</AmendmentButton>
          <AmendmentButton buttonstyle="link" onClick={viewList}>Return to case notes</AmendmentButton>
        </CaseNoteDetailsLeft>
        <CaseNoteDetailsRight>
          <div>
            <TypeDescriptionBlock typeDetails={{ typeDescription, subTypeDescription }} />
            <CaseNoteText>{originalNoteText}</CaseNoteText>
          </div>
          <RightHeader>
            {authorName}
          </RightHeader>
          {amendmentList}
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
