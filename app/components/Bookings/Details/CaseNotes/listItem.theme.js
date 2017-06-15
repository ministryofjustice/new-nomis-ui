import styled from 'styled-components';
import allColours from 'theme/colours';


// import desktop from 'theme/desktop';
import { responsiveCols } from 'components/CommonTheme/responsiveColumns';

const colours = allColours.bookings.details.caseNotes.list;

export const DateTimeIdBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${responsiveCols(3)};
  align-self: flex-start;
`;

export const DateTimeBlock = styled.div`
  height: 110px;
`;

export const DateBlock = styled.div`
  font-size: 35px;
  font-weight: bold;
`;
export const TimeBlock = styled.div`
  font-size: 25px;
  font-weight: bold;
`;

export const CaseNoteId = styled.div`
  font-size: 16px;
  color: ${colours.altTextColour};
`;

export const MiddleBlock = styled.div`
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${responsiveCols(8)};
`;

export const TypeAndText = styled.div`
  height:110px;
`;

export const TypeDescription = styled.div`
  padding-top: 5px;
  font-size: 19px;
  font-weight: bold;
`;

export const CaseNoteText = styled.div`
  font-size: 19px;
`;

export const AssignedOfficer = styled.div`
  font-size: 16px;
  color: ${colours.altTextColour};
`;

export const SourceBlock = styled.div`
  align-self: flex-start;
  width: ${responsiveCols(2)};
  position: relative;
`;

export const Source = styled.div`
  font-size: 16px;
  position: absolute;
  top: 110px;
  color: ${colours.altTextColour};
`;

export const AmendmentListBlock = styled.div`
  background: ${colours.amendments.backgroundColour};
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 10px;
  margin-top: 20px;
`;
