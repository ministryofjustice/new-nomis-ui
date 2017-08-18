import styled from 'styled-components';
import colours from 'theme/colours';
import { StyledLink } from 'components/Button/button.theme';
import { responsiveCols, fixedCols } from 'components/CommonTheme/responsiveColumns';

export const Location = styled.div`
  width: ${responsiveCols(2)};
  text-align: right;
`;

export const Help = styled.div`
  background: red;
  width: 300px;
  height: 300px;
`;

export const HeaderWrapper = styled.div`
  position: relative;
  padding-top: 20px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2em;
  width:100%;
`;

export const NameIdKeyWorker = styled.div`
  width: ${responsiveCols(4)};
`;

export const InmateName = styled.div`
  font-size: 18px;
  padding-bottom: 15px;
`;

export const InformationBlock = styled.div`
  font-size: 14px;
  padding-top: 0px;
  line-height: 1.3;
`;

export const AlertsLocation = styled.div`
  width: ${responsiveCols(3)};
`;

export const ALBLock = styled.div`
  background: ${colours.bookings.details.alertLocationBackground};
  padding: 15px;
  &:not(:first-child) {
    margin-top: 5px;
  }
  &:not(:last-child) {
    margin-bottom: 5px;
  }
  div:first-child {
    font-size: 19px;
    margin-bottom: 15px;
  }
  div:last-child {
    font-size: 21px;
  }
`;

export const AlertBlock = styled.div`
  font-size:10px;
`;

export const AlertCodes = styled.div`
  color: ${colours.alertCodes.textColour};
  font-weight: bold;
  display: inline-block;
`;

export const AddCaseNoteButton = styled.div`
  margin-top: 30px;
  text-align: center;
`;

export const AddCaseNoteButtonComponent = styled(StyledLink)`
  width: 100%;
  // height: 100px;
  font-size: 16px;
`;

export const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 10px;
  background: ${colours.bookings.details.mobileHeader.background};
`;

export const FaceImage = styled.div`
  width: 40%;
  padding-right: 10px;
  cursor: pointer;
`;

export const InformationWrapper = styled.div`
  width: 60%;
  padding-left: 10px;

  span {
    color: ${colours.bookings.details.mobileHeader.idText};
  }

  officername {
    display: inline-block;
  }
`;
