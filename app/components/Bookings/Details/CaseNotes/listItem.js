import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { FormattedDate, FormattedTime } from 'react-intl';

const Block = styled.div`
   margin-bottom: .5em;
 `;

const Wrapper = styled.div`
  .col-md-6,
  .col-md-12,
  .col-xs-12 {
    padding: 0 !important;
    margin: 0 !important;
  }

  .row{
     display:block;
     margin-bottom: 1.5em;
  }
 `;

const Row = styled.div`
  border-bottom: #F2F2F2 solid 1px;
  margin-bottom: 1em;

  padding: 15px;

  @media(max-width: 992px) {
     padding-left: 0;
  }

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

const RightPadding = styled.span`
   margin-right: 3px;
`;

function AmendmentBlock({ amendment }) {
  const shouldShowTime = Boolean(amendment.creationDateTime && amendment.creationDateTime);

  return (
    <div>
        <AmendmentBox>
          <div>
            <Bold>
              <div>
                  Amendment
              </div>
            </Bold>

            <p>
              {amendment.additionalNoteText}
            </p>

          </div>

          { shouldShowTime && (
            <div>
              <strong>
                <FormattedDate value={Date.parse(amendment.creationDateTime)} />
              </strong>
                <span>&nbsp;-&nbsp;</span>
              <strong>
                <FormattedTime value={amendment.creationDateTime} />
              </strong>
            </div>
          )}
          <div>
            {amendment.authorName}
          </div>
        </AmendmentBox>
    </div>
  );
}

AmendmentBlock.propTypes = {
  amendment: PropTypes.object.isRequired,
};

function CaseNoteListItem(props) {
  const { action, caseNote } = props;

  if (!caseNote) {
    return <div>Loading..</div>
  }

  const { authorName, originalNoteText, amendments, occurrenceDateTime,creationDateTime, subTypeDescription, typeDescription } = caseNote.toJS(); // amendments

  let amendmentList = null;
  if (amendments && amendments.length > 0) {
    amendmentList = amendments.map((am) => <AmendmentBlock amendment={am} key={uuid()} />);
  }

  return (
    <Wrapper>
      <Row onClick={action} className="row">

        <Block className="col-xs-12 col-md-2">
          <Bold>
            <span className="col-md-12">
              <FormattedDate value={Date.parse(creationDateTime)} />
            </span>
            <Separator className="hidden-md hidden-lg hidden-lx"> </Separator>
            <span className="col-md-12">
              <FormattedTime value={creationDateTime} />
            </span>
          </Bold>

          <Separator className="hidden-md hidden-lg hidden-xl"> </Separator>
          <span className="col-md-12">{authorName}</span>
        </Block>

        <div className="col-xs-12 col-md-7">
          <Block>
            <Bold>
              {typeDescription} | {subTypeDescription}
            </Bold>
          </Block>
          {occurrenceDateTime &&
          <Block>
            <RightPadding> Occurrence date: </RightPadding>
            <span>
                <FormattedDate value={occurrenceDateTime} /> - <FormattedTime value={occurrenceDateTime} />
            </span>
          </Block>}
          <Block>
            <p>
              {originalNoteText}
            </p>
            <div>
              {amendmentList}
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
