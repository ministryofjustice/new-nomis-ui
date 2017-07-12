import styled from 'styled-components';
import colours from 'theme/colours';
import { media } from '../../../../utils/style-utils';

export const AlertHolder = styled.div`
`;

export const AlertItem = styled.div`
  position: relative;
  height: 150px;
  width: 60%;
  border-bottom: 1px solid ${colours.bookings.details.datagrid.gridLineColour};
  ${media.mobile`height: 250px;`}
  color: ${(props) => props.expired ? colours.bookings.details.alerts.greyText : colours.baseFont};
`;

export const AlertTypeWrapper = styled.div`
    width: 190px;
    ${media.mobile`width: 260px;`}
    padding-top: 18px;
    ${media.mobile`padding-top: 40px;`}
    color: ${(props) => props.expired ? colours.bookings.details.alerts.greyText : colours.bookings.details.alerts.warningTextColour};
`;

export const AlertType = styled.div`
  font-size: 50px;
  ${media.mobile`font-size: 65px;`}
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

export const AlertTypeDescription = styled.div`
  font-size: 19px;
  ${media.mobile`font-size: 26px;`}
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

export const AlertCodeWrapper = styled.div`
  display: inline-block;
  display: block;
  position: absolute;
  top: 0;
  left: 260px;
  height: 115px;
  ${media.mobile`height: 236px;`}
  width: 100%;
  padding-top: 23px;
  ${media.mobile`padding-top: 48px;`}
`;

export const AlertCodeDescription = styled.div`
  font-size: 19px;
  ${media.mobile`font-size: 30px;`}
  font-weight: bold;
`;

export const AlertComment = styled(AlertCodeDescription)`
  font-weight: normal;
  font-size: 16px;
  ${media.mobile`font-size: 26px;`}
`;

export const AlertEntryDate = styled.div`
  position: absolute;
  bottom: 0;
  font-size: 16px;
  ${media.mobile`font-size: 26px;`}
`;