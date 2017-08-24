import React from 'react';
import PropTypes from 'prop-types';
import EliteOfficerName from 'containers/EliteContainers/OfficerName';
import styled from 'styled-components';
import { FormattedDate, FormattedTime } from 'react-intl';

import {
  ListDetailItem,
} from 'components/List/listItem';

const Block = styled.div`
   margin-bottom: .5em;
 `;

const Row = styled.div`
  border-bottom: #F2F2F2 solid 1px;
  margin-bottom: 1em;
`

const Bold = styled.span`
  font-weight: bold;
`

const Separator = styled.span`
  margin-left: .3em;
  margin-right: .3em;
`

const AmendmentBox = styled.div`
   background : #DEE0E2;
   margin-top:  .5em;
   margin-bottom: .5em;
   
   padding-top: .5em;
   padding-left: 1em;
   padding-right: 1em;
   padding-bottom: 1em;
`

function AmendmentBlock({ amendments }) {
  if(!amendments) return <div></div>;

  return (
      <div>
        {amendments.map(amendment =>
        <AmendmentBox key={amendment.key}>

          <div>

            <Bold>
              <div>
                  Amendment
              </div>
              <FormattedDate value={Date.parse(amendment.dateTime)} /> <FormattedTime value={amendment.dateTime} />
            </Bold>

            <Separator>
              -
            </Separator>

            {amendment.userId}
          </div>

          <div>
            {amendment.stub}
          </div>

        </AmendmentBox>
        )}
      </div>
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
         <Bold>
           <FormattedDate value={Date.parse(occurrenceDateTime)} /> <FormattedTime value={occurrenceDateTime} />
         </Bold>

         <Separator>
           -
         </Separator>

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
            {splitInfo.amendments ? AmendmentBlock({ amendments: splitInfo.amendments}) : null}
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
