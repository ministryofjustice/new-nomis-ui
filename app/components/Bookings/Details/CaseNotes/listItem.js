import React from 'react';
import PropTypes from 'prop-types';
import EliteOfficerName from 'containers/EliteContainers/OfficerName';
import styled from 'styled-components';
import { FormattedDate, FormattedTime } from 'react-intl';

const Block = styled.div`
   margin-bottom: .5em;
 `;

const Wrapper = styled.div`
  .col-md-6,
  .col-md-12,
  .col-xs-12 {
    padding:0 !important;
    margin:0 !important;
  }
  
  .row{
     display:block;
     margin-bottom: 1.5em;
  }
 `;

const Row = styled.div`
  border-bottom: #F2F2F2 solid 1px;
  margin-bottom: 1em;
  &:hover{
    background: #f8f8f8;
  }
`;

const Bold = styled.span`
  font-weight: bold;
`;

const Separator = styled.span`
  margin-left: .3em;
  margin-right: .3em;
`;

const AmendmentBox = styled.div`
   background : #DEE0E2;
   margin-top:  .5em;
   margin-bottom: .5em;
   
   padding-top: .5em;
   padding-left: 1em;
   padding-right: 1em;
   padding-bottom: 1em;
`;

function AmendmentBlock({ amendments }) {
  if (!amendments) return <div></div>;

  return (
    <div>
      {amendments.map((amendment) =>
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

            <EliteOfficerName username={amendment.userId} />
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
    <Wrapper>
      <Row onClick={action} className="row">

        <Block className="col-xs-12 col-md-2">
          <Bold>
            <span className="col-md-12">
              <FormattedDate value={Date.parse(occurrenceDateTime)} />
            </span>
            <Separator className="hidden-md hidden-lg hidden-lx"> </Separator>
            <span className="col-md-12">
              <FormattedTime value={occurrenceDateTime} />
            </span>
          </Bold>

          <Separator className="hidden-md hidden-lg hidden-lx"> </Separator>

          <EliteOfficerName username={authorUserId} className="col-md-12" />
        </Block>

        <div className="col-xs-12 col-md-10">
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
        </div>
      </Row>
    </Wrapper>
  );
}

CaseNoteListItem.propTypes = {
  caseNote: PropTypes.object.isRequired,
  action: PropTypes.func.isRequired,
};

export default CaseNoteListItem;
