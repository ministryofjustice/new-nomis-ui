import styled from 'styled-components';
import allColours from 'theme/colours';
import { responsiveCols } from 'components/CommonTheme/responsiveColumns';
import { StyledLink } from 'components/Button/button.theme';

const colours = allColours.bookings.details.caseNotes.details;

export const ButtonWrapper = styled.div`
  margin-top: 40px;
  text-align: center;
`;

export const NavButton = styled(StyledLink)`
  display: block;
  width: 100%;
  font-size: 16px;

  &:last {
    margin-top: 0px;
  }
`;

export const CaseNoteDetailsWrapper = styled.div`
  width: 100%;
  padding-left: 25px;
  padding-right: 25px;
  margin-bottom: 60px;
`;

export const CaseNoteDetailsLeft = styled.div`
  width: ${responsiveCols(4)};
  display: flex;
  flex-direction: column;
`;

export const CaseNoteIdBlock = styled.div`
  color:  ${colours.header.textColour};
  margin-bottom: 0px;
  font-size: 18px;
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

export const CaseNoteText = styled.div`
  margin-top:5px;
  font-size: 22px;
`;

export const Amendment = styled.div`
  margin-top: 5px;
  padding: 10px 10px 10px;
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
  font-size: 22px;
`;

export const AmendmentText = styled.div`
  font-size: 18px;
`;

export const ReturnToList = styled.a`
  text-decoration: underline;
  cursor: pointer;
`;

export const DateTimeBlockWrapper = styled.div`
  margin-bottom: 10px;

  div {
    display: inline-block;
    margin-right: 10px;
  }
`;
