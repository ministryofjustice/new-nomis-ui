import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import EliteOfficerName from 'containers/EliteContainers/OfficerName';

import {
  ListDetailItem,
} from 'components/List/listItem';

import {
  DateTimeIdBlock,
  CaseNoteId,
  MiddleBlock,
  TypeDescription,
  CaseNoteText,
  AssignedOfficer,
  SourceBlock,
  Source,
  AmendmentListBlock,
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
  return (<AmendmentListBlock>
    <strong>{amendments.length} Amendment{amendments.length > 1 ? 's' : ''} {amendments[0].dateTime}</strong> - <EliteOfficerName username={amendments[0].userId} />
  </AmendmentListBlock>);
}

AmendmentBlock.propTypes = {
  amendments: PropTypes.array.isRequired,
};

function CaseNoteListItem(props) {
  const { action } = props;
  const { authorUserId, occurrenceDateTime, subType, type, subTypeData, typeData, caseNoteId, source, splitInfo } = props.caseNote.toJS(); // amendments
  const subTypeString = subTypeData ? subTypeData.description : subType;
  const typeString = typeData ? typeData.description : type;
  const typeDescription = `${typeString} - ${subTypeString}`;

  return (
    <ListDetailItem BordersBetween={{ mids: true, bottom: true }} onClick={action}>
      <DateTimeIdBlock>
        <DateTimeBlock creationDateTime={occurrenceDateTime} />
        <CaseNoteId>Case Note ID: {caseNoteId}</CaseNoteId>
      </DateTimeIdBlock>
      <MiddleBlock>
        <TypeAndText>
          <TypeDescription>
            {typeDescription}
          </TypeDescription>
          <CaseNoteText>
            {splitInfo.stub}
          </CaseNoteText>
        </TypeAndText>
        <AssignedOfficer>
          <EliteOfficerName username={authorUserId} />
        </AssignedOfficer>
        {splitInfo.amendments ? AmendmentBlock({ amendments: splitInfo.amendments }) : null}
      </MiddleBlock>
      <SourceBlock>
        <Source>
          {`Source: ${source}`}
        </Source>
      </SourceBlock>
    </ListDetailItem>
  );
}

CaseNoteListItem.propTypes = {
  caseNote: PropTypes.object.isRequired,
  action: PropTypes.func.isRequired,
};

export default CaseNoteListItem;
