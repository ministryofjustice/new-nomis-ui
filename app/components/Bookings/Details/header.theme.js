import styled from 'styled-components';
import colours from 'theme/colours';
// import desktop from 'theme/desktop';
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
  margin: 0px 0 55px;
  width: 100%;
  display: flex;
  flex-direct: row;
  align-items: center;
  justify-content: space-between;
  height: 232px;
  >div {
    height:100%;
  }
`;

export const FaceImage = styled.div`
  width: ${fixedCols(2)};
  display: flex;
  img {
    width: 100%;
    align-self: flex-end;
  }
`;

export const NameIdKeyWorker = styled.div`
  width: ${responsiveCols(4)};
  display: flex;
  flex-direction: column;
`;


export const InmateName = styled.div`
  font-weight: bold;
  font-size: 36px;
  padding-bottom: 15px;
  position: relative;
  margin-top: auto;

  &:after {
    width: 24px;
    border-bottom: solid 1px ${colours.bookings.details.lineBetweenName};
    content: '';
    position: absolute;
    left: 0px;
    bottom: 0px;
  }
`;

export const IdLocation = styled.div`
  font-size: 24px;
  padding-top: 25px;
`;

export const AlertsLocation = styled.div`
  width: ${responsiveCols(3)};
  display: flex;
  flex-direction: column;
`;

export const ALBLock = styled.div`
  flex-grow:1;
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
`;
export const AddCaseNoteButton = styled.div`
  width: ${responsiveCols(3)};
`;
