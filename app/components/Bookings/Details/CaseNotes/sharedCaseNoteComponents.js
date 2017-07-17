import React from 'react';
import PropTypes from 'prop-types';
import JsonBlock from 'components/JsonBlock';
import moment from 'moment';
import EliteOfficerName from 'containers/EliteContainers/OfficerName';

import {
  ListDetailItem,
} from 'components/List/listItem';

import {
  DateTimeIdBlock,
  DateBlock,
  TimeBlock,
  MiddleBlock,
  TypeDescription,
  CaseNoteText,
  AssignedOfficer,
} from './listItem.theme';

export const DateTimeBlock = ({ creationDateTime }) => <div>
  <DateBlock>
    {moment(creationDateTime).format('DD/MM/YYYY')}
  </DateBlock>
  <TimeBlock>
    {moment(creationDateTime).format('h:mm a')}
  </TimeBlock>
</div>;

DateTimeBlock.propTypes = {
  creationDateTime: PropTypes.string.isRequired,
};

export const TypeDescriptionBlock = ({ typeDetails }) => {
  const { typeDescription, subTypeDescription } = typeDetails;
  return (<TypeDescription>
     {typeDescription} - {subTypeDescription}
  </TypeDescription>);
};

TypeDescriptionBlock.propTypes = {
  typeDetails: PropTypes.object.isRequired,
};


function CaseNoteListItem(props) {
  const { action } = props;
  const { authorUserId, occurrenceDateTime, subTypeDescription, typeDescription, splitInfo } = props.caseNote.toJS(); // amendments

  return (
    <ListDetailItem onClick={action}>
      <DateTimeIdBlock>
        <DateBlock>
          {moment(occurrenceDateTime).format('DD/MM/YYYY')}
        </DateBlock>
        <TimeBlock>
          {moment(occurrenceDateTime).format('h:mm a')}
        </TimeBlock>
      </DateTimeIdBlock>
      <MiddleBlock>
        <TypeDescriptionBlock typeDetails={{ typeDescription, subTypeDescription }} />
        <CaseNoteText>
          {splitInfo.stub}
        </CaseNoteText>
        {splitInfo.amendments ? splitInfo.amendments.map((am) => <JsonBlock json={am} />) : null}
        <AssignedOfficer>
          <EliteOfficerName username={authorUserId} />
        </AssignedOfficer>
      </MiddleBlock>
    </ListDetailItem>
  );
}

CaseNoteListItem.propTypes = {
  caseNote: PropTypes.object.isRequired,
  action: PropTypes.func.isRequired,
};

export default CaseNoteListItem;
