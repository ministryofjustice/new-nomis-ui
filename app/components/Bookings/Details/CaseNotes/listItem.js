import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import EliteOfficerName from 'containers/EliteContainers/OfficerName';
import styled from 'styled-components';

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


const Block = styled.div`
   margin-bottom: .5em;
 `;

const Row = styled.div`
  border-bottom: #E5E5E5 solid 1px;
  margin-bottom: 1em;
`

const Bold = styled.span`
  font-weight: bold;
`

const DateTimeBlock = ({ creationDateTime }) => <DTB>
    <DateBlock>
      {moment(creationDateTime).format('DD/MM/YYYY')} -  {moment(creationDateTime).format('h:mm a')}
    </DateBlock>
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
    <Row onClick={action}>

       <Block>
         <Bold> {moment(occurrenceDateTime).format('DD/MM/YYYY')} - {moment(occurrenceDateTime).format('h:mm a')} - </Bold>
         <EliteOfficerName username={authorUserId} />
       </Block>

      <Block>
        <Bold>
          {typeDescription} | {subTypeDescription}
        </Bold>
      </Block>

       <Block>
          {splitInfo.stub}
          <div>
            {splitInfo.amendments ? AmendmentBlock({ amendments: splitInfo.amendments }) : null}
          </div>
       </Block>
    </Row>
  );
}

CaseNoteListItem.propTypes = {
  caseNote: PropTypes.object.isRequired,
  action: PropTypes.func.isRequired,
};

export default CaseNoteListItem;
/*
 <ListDetailItem BordersBetween={{ mids: true, bottom: true }} onClick={action}>

 <DateTimeIdBlock>
 <DateTimeBlock creationDateTime={occurrenceDateTime} />

 <div>
 -
 </div>

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
 */