import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedTime } from 'react-intl';
import JsonBlock from 'components/JsonBlock';
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
    <FormattedDate value={Date.parse(creationDateTime)} />
  </DateBlock>
  <TimeBlock>
    <FormattedTime value={Date.parse(creationDateTime)} />
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
          <FormattedDate value={Date.parse(creationDateTime)} />
        </DateBlock>
        <TimeBlock>
          <FormattedTime value={Date.parse(creationDateTime)} />
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
