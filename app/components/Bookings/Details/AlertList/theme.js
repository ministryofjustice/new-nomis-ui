import styled from 'styled-components';
import colours from 'theme/colours';
import { media } from 'utils/style-utils';

export const AlertHolder = styled.div`
`;

export const AlertItem = styled.div`
  position: relative;
  height: 250px;
  ${media.desktop`height: 150px;`}
  width: 60%;
  border-bottom: 1px solid ${colours.bookings.details.datagrid.gridLineColour};
  color: ${(props) => props.expired ? colours.bookings.details.alerts.greyText : colours.baseFont};
`;

export const AlertTypeWrapper = styled.div`
    width: 260px;
    ${media.desktop`width: 190px;`}
    padding-top: 40px;
    ${media.desktop`padding-top: 18px;`}
    color: ${(props) => props.expired ? colours.bookings.details.alerts.greyText : colours.bookings.details.alerts.warningTextColour};
`;

export const AlertType = styled.div`
  font-size: 65px;
  ${media.desktop`font-size: 50px;`}
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

export const AlertTypeDescription = styled.div`
  font-size: 26px;
  ${media.desktop`font-size: 19px;`}
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

export const AlertCodeWrapper = styled.div`
  display: inline-block;
  display: block;
  position: absolute;
  top: 0;
  left: 236px;
  height: 115px;
  ${media.desktop`height: 260px;`}
  width: 100%;
  padding-top: 48px;
  ${media.desktop`padding-top: 23px;`}
`;

export const AlertCodeDescription = styled.div`
  font-size: 30px;
  ${media.desktop`font-size: 19px;`}
  font-weight: bold;
`;

export const AlertComment = styled(AlertCodeDescription)`
  font-weight: normal;
  font-size: 26px;
  ${media.desktop`font-size: 16px;`}
`;

export const AlertEntryDate = styled.div`
  position: absolute;
  bottom: 0;
  font-size: 26px;
  ${media.desktop`font-size: 16px;`}
`;
