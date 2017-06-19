import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

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
  Source,
  AmendmentListBlock,
  DateBlock,
  TimeBlock,
  DateTimeBlock as DTB,
} from './listItemMobile.theme';
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
    <strong>{amendments.length} Amendment{amendments.length > 1 ? 's' : ''} {amendments[0].dateTime}</strong>-<div>{amendments[0].userId}</div>
  </AmendmentListBlock>);
}

AmendmentBlock.propTypes = {
  amendments: PropTypes.array.isRequired,
};

function CaseNoteListItemMobile(props) {
  const { action } = props;
  const { authorUserId, creationDateTime, subType, type, subTypeData, typeData, caseNoteId, source, splitInfo } = props.caseNote.toJS(); // amendments
  const subTypeString = subTypeData ? subTypeData.description : subType;
  const typeString = typeData ? typeData.description : type;
  const typeDescription = `${typeString} - ${subTypeString}`;

  return (
    <ListDetailItem onClick={action}>
      <DateTimeIdBlock>
        <DateTimeBlock creationDateTime={creationDateTime} />
      </DateTimeIdBlock>
      <MiddleBlock>
        <TypeDescription>
          {typeDescription}
        </TypeDescription>
        <CaseNoteText>
          {splitInfo.stub}
        </CaseNoteText>
        <CaseNoteId>Case Note ID: {caseNoteId}</CaseNoteId>
        <AssignedOfficer>
          {authorUserId}
        </AssignedOfficer>
        <Source>
          {`Source: ${source}`}
        </Source>
        {splitInfo.amendments ? AmendmentBlock({ amendments: splitInfo.amendments }) : null}
      </MiddleBlock>
    </ListDetailItem>
  );
}

CaseNoteListItemMobile.propTypes = {
  caseNote: PropTypes.object.isRequired,
  action: PropTypes.func.isRequired,
};

export default CaseNoteListItemMobile;
