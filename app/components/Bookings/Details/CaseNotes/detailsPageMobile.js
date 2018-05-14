import React from 'react';
import PropTypes from 'prop-types';

import { FormattedDate, FormattedTime } from 'components/intl';

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
  DateTimeBlock2,
  TypeDescriptionBlock,
} from './sharedCaseNoteComponents';

const AmendmentBlock = ({ dateTime, authorName, text }) => (<Amendment data-name={'Amendment'}>
  <AmendmentTitle>{text}</AmendmentTitle>
  <AmendmentText>{authorName}</AmendmentText>
  <AmendmentText>
    <FormattedDate value={dateTime} /> <FormattedTime value={dateTime} />
  </AmendmentText>
</Amendment>);

AmendmentBlock.propTypes = {
  dateTime: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

function CaseNoteDetailsMobile(props) {
  const { viewList } = props;
  const { authorName, originalNoteText, occurrenceDateTime, subTypeDescription, typeDescription, amendments } = props.caseNote.toJS(); // amendments
  let amendmentList = null;
  if (amendments && amendments.length > 0) {
    amendmentList = amendments.map((am) => <AmendmentBlock data-name={'AmendmentBlock'} dateTime={am.creationDateTime} authorName={am.authorName} text={am.additionalNoteText} />);
  }
  return (
    <div>
      <CaseNoteDetailsWrapper data-name={'CaseNoteDetailsWrapper'}>
        <ButtonWrapper>
          <NavButton buttonstyle="link" to={'/amendCaseNote'}>Make amendment</NavButton>
        </ButtonWrapper>
        <DateTimeBlockWrapper data-name={'DateTimeBlockWrapper'}>
          <DateTimeBlock2 data-name={'DateTimeBlock'} dateTime={occurrenceDateTime} />
        </DateTimeBlockWrapper>
        <TypeDescriptionBlock style={{ fontSize: '30px' }} data-name={'TypeDescriptionBlock'} typeDetails={{ typeDescription, subTypeDescription }} />
        <CaseNoteText data-name={'CaseNoteText'}>{originalNoteText}</CaseNoteText>
        <CaseNoteIdBlock data-name={'CaseNoteIdBlock'}>{authorName}</CaseNoteIdBlock>
        {amendmentList}
        <ButtonWrapper>
          <NavButton buttonstyle="link" onClick={viewList}>Return to case notes</NavButton>
        </ButtonWrapper>
      </CaseNoteDetailsWrapper>
    </div>
  );
}

CaseNoteDetailsMobile.propTypes = {
  caseNote: PropTypes.object.isRequired,
  viewList: PropTypes.func.isRequired,
};

export default CaseNoteDetailsMobile;
