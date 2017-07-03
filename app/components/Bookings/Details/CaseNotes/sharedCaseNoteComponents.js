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
  CaseNoteId,
  MiddleBlock,
  TypeDescription,
  CaseNoteText,
  AssignedOfficer,
  SourceBlock,
  Source,
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
  const { subType, type, subTypeData, typeData } = typeDetails;
  const subTypeString = subTypeData && subTypeData.description ? subTypeData.description : subType;
  const typeString = typeData && typeData.description ? typeData.description : type;
  const typeDescription = `${typeString} - ${subTypeString}`;
  return (<TypeDescription>
    {typeDescription}
  </TypeDescription>);
};

TypeDescriptionBlock.propTypes = {
  typeDetails: PropTypes.object.isRequired,
};


function CaseNoteListItem(props) {
  const { action } = props;
  const { authorUserId, creationDateTime, subType, type, subTypeData, typeData, caseNoteId, source, splitInfo } = props.caseNote.toJS(); // amendments

  return (
    <ListDetailItem onClick={action}>
      <DateTimeIdBlock>
        <DateBlock>
          {moment(creationDateTime).format('DD/MM/YYYY')}
        </DateBlock>
        <TimeBlock>
          {moment(creationDateTime).format('h:mm a')}
        </TimeBlock>
        <CaseNoteId>
          id: {caseNoteId}
        </CaseNoteId>
      </DateTimeIdBlock>
      <MiddleBlock>
        <TypeDescriptionBlock typeDetails={{ subType, type, subTypeData, typeData }} />
        <CaseNoteText>
          {splitInfo.stub}
        </CaseNoteText>
        {splitInfo.amendments ? splitInfo.amendments.map((am) => <JsonBlock json={am} />) : null}
        <AssignedOfficer>
          <EliteOfficerName staffId={authorUserId} />
        </AssignedOfficer>
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
