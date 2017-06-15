import styled from 'styled-components';
import allColours from 'theme/colours';
// import desktop from 'theme/desktop';
import { responsiveCols } from 'components/CommonTheme/responsiveColumns';

import Button from 'components/Button';

const colours = allColours.bookings.details.caseNotes.details;

export const CaseNoteDetailsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 50px;
  width: 100%;
`;

export const CaseNoteDetailsLeft = styled.div`
  width: ${responsiveCols(4)};
  display: flex;
  flex-direction: column;
`;

export const CaseNoteIdBlock = styled.div`
  color:  ${colours.header.textColour};
  margin-bottom: 35px;
  font-size: 16px;
`;

export const CaseNoteDetailsRight = styled.div`
  width: ${responsiveCols(8)};
  display: flex;
  flex-direction: column;
`;

export const RightHeader = styled.div`
  color:  ${colours.header.textColour};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 50px;
`;

export const AmendmentButton = styled(Button)`
  width: 100%;
  max-width:270px;
  margin-top: 30px;
  margin-bottom: 30px;
`;

export const CaseNoteText = styled.div`
  margin-top:25px;
  margin-bottom: 60px;
  font-size: 19px;
`;

export const Amendment = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 70px;
  margin-bottom: 30px;
  padding: 20px 30px 30px;
  background-color: ${colours.amendments.backgroundColour};
`;

export const AmendmentHeader = styled.div`
  font-size: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: ${colours.amendments.headerTextColour};
`;

export const AmendmentTitle = styled.div`
  font-size: 21px;
  font-weight: bold;
`;

export const AmendmentText = styled.div`
  font-size: 19px;
`;

export const ReturnToList = styled.a`
  text-decoration: underline;
  cursor: pointer;
`;
