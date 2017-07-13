import styled from 'styled-components';
import allColours from 'theme/colours';
import { media } from '../../../../utils/style-utils';

// import desktop from 'theme/desktop';
import { responsiveCols } from 'components/CommonTheme/responsiveColumns';

const colours = allColours.bookings.details.caseNotes.list;

export const DateTimeIdBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${responsiveCols(3)};
  ${media.mobile`width: 257px;`}
  align-self: flex-start;
`;

export const DateTimeBlock = styled.div`
  height: 110px;
  ${media.mobile`margin-left: 24px;`}
  ${media.mobile`margin-top: 24px;`}
`;

export const DateBlock = styled.div`
  font-size: 30px;
  font-weight: bold;
`;
export const TimeBlock = styled.div`
  font-size: 25px;
  font-weight: bold;
`;

export const MiddleBlock = styled.div`
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${responsiveCols(8)};
  ${media.mobile`margin-top: 24px;`}
`;

export const TypeAndText = styled.div`
  height:110px;
`;

export const TypeDescription = styled.div`
  padding-top: 5px;
  font-size: 19px;
  font-weight: bold;
  ${media.mobile`margin-bottom: 10px;`}
`;

export const CaseNoteText = styled.div`
  font-size: 18px;
  ${media.mobile`padding-right: 25px;`}
  ${media.mobile`margin-bottom: 30px;`}
`;

export const AssignedOfficer = styled.div`
  font-size: 16px;
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
export const AmendmentSection = styled.div`
  font-weight: bold;
`;
export const AmendmentSubSection = styled.div`
  padding-left: 15px;
`;