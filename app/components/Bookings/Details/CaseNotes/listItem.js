import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import EliteOfficerName from 'containers/EliteContainers/OfficerName';

import {
  ListDetailItem,
} from 'components/List/listItem';

import {
  DateTimeIdBlock,
  MiddleBlock,
  TypeDescription,
  CaseNoteText,
  AssignedOfficer,
  AmendmentListBlock,
  AmendmentSection,
  AmendmentSubSection,
  DateBlock,
  TimeBlock,
  DateTimeBlock as DTB,
  TypeAndText,
} from './listItem.theme';
const DateTimeBlock = ({ creationDateTime }) => <DTB>
  <DateBlock>
    {moment(creationDateTime).format('DD/MM/YYYY')}
  </DateBlock>
  <TimeBlock>
    {moment(creationDateTime).format('h:mm a')}
  </TimeBlock>
</DTB>;

DateTimeBlock.propTypes = {
  creationDateTime: PropTypes.string.isRequired,
};
function AmendmentBlock({ amendments }) {
  let amendmentBreakdown = null;
  if (amendments && amendments.length > 0) {
    amendmentBreakdown = amendments.map((amendment) => <AmendmentListBlock>{amendment.stub}</AmendmentListBlock>);
  }

  return (
      <AmendmentSection>
        <AmendmentSubSection>{amendments.length} Amendment{amendments.length > 1 ? 's' : ''}</AmendmentSubSection>
        {amendmentBreakdown}
      </AmendmentSection>
  );
}

AmendmentBlock.propTypes = {
  amendments: PropTypes.array.isRequired,
};

function CaseNoteListItem(props) {
  const { action } = props;
  const { authorUserId, occurrenceDateTime, subTypeDescription, typeDescription, splitInfo } = props.caseNote.toJS(); // amendments
  return (
    <ListDetailItem BordersBetween={{ mids: true, bottom: true }} onClick={action}>
      <DateTimeIdBlock>
        <DateTimeBlock creationDateTime={occurrenceDateTime} />
        <AssignedOfficer>
          <EliteOfficerName username={authorUserId} />
        </AssignedOfficer>
      </DateTimeIdBlock>
      <MiddleBlock>
        <TypeAndText>
          <TypeDescription data-name={'TypeDescription'}>
            {typeDescription} - {subTypeDescription}
          </TypeDescription>
          <CaseNoteText data-name={'CaseNoteText'}>
            {splitInfo.stub}
          </CaseNoteText>
        </TypeAndText>
        {splitInfo.amendments ? AmendmentBlock({ amendments: splitInfo.amendments }) : null}
      </MiddleBlock>
    </ListDetailItem>
  );
}

CaseNoteListItem.propTypes = {
  caseNote: PropTypes.object.isRequired,
  action: PropTypes.func.isRequired,
};

export default CaseNoteListItem;
