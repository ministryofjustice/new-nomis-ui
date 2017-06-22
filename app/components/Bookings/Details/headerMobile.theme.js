import styled from 'styled-components';
import colours from 'theme/colours';
// import desktop from 'theme/desktop';
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
  margin: 0;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  height: 443px;

  >div {
    height:100%;
  }
`;

export const FaceImage = styled.div`
  width: ${fixedCols(2)};
  width: 35%;
  height: 263px;
  padding: 25px;
  cursor: pointer;
  img {
    width: 100%;
  }
`;

export const NameIdKeyWorker = styled.div`
  width: ${responsiveCols(4)};
`;


export const InmateName = styled.div`
  font-size: 35px;
  padding-bottom: 15px;
  position: relative;
  margin-top: auto;
`;

export const InformationBlock = styled.div`
  font-size: 28px;
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
  font-size:19px;
`;

export const AlertCodes = styled.div`
  color: ${colours.alertCodes.textColour};
  font-weight: bold;
  display: inline-block;
`;
export const AddCaseNoteButton = styled.div`
  width: 100%;
  padding: 25px;
  font-size: 38px;
  height: initial !important;
`;

export const AddCaseNoteButtonComponent = styled(StyledLink)`
  width: 100%;
  height: 100px;
  font-size: 38px;
  padding: 21px calc(50% - 154px);
`;

export const ContentWrapper = styled.div`
  position: relative;
  height: 263px !important;
  background: ${colours.bookings.details.mobileHeader.background};
`;

export const InformationWrapper = styled.div`
  width: 65%;
  position: absolute;
  top: 0;
  right: 0;
  height: 263px;
  padding: 25px;

  span {
    color: ${colours.bookings.details.mobileHeader.idText};
  }

  officername {
    display: inline-block;
  }
`;

