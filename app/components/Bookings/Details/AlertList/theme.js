import styled from 'styled-components';
import colours from 'theme/colours';
import { media } from 'utils/style-utils';

export const AlertHolder = styled.div`
  margin-top: 0 !important;
`;

export const AlertItem = styled.div`
  position: relative;
  display: flex;
  padding: 0 0 20px 0;
  ${media.desktop` padding: 20px 0 20px 0;`}
  border-bottom: 1px solid ${colours.bookings.details.datagrid.gridLineColour};
  color: ${(props) => props.expired ? '#6F777B' : colours.baseFont};
`;

export const AlertTypeWrapper = styled.div`
  width: 40%;
  ${media.desktop`width: 190px;`}
  color: ${(props) => props.expired ? '#6F777B' : colours.bookings.details.alerts.warningTextColour};
`;

export const AlertType = styled.div`
  font-size: 32px;
  ${media.desktop`font-size: 48px;`}
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

export const AlertTypeDescription = styled.div`
  font-size: 14px;
  ${media.desktop`font-size: 19px;`}
  font-weight: bold;
  width: 100%;
  text-align: center;
`;

export const AlertCodeWrapper = styled.div`
  width: 60%;
  padding-top: 8px;
  ${media.desktop`padding-top: 18px;`}
`;

export const AlertCodeDescription = styled.div`
  font-size: 14px;
  ${media.desktop`font-size: 19px;`}
  font-weight: bold;
`;

export const AlertComment = styled(AlertCodeDescription)`
  font-weight: normal;
  font-size: 14px;
  ${media.desktop`font-size: 19px;`}
`;

export const AlertEntryDate = styled.div`
  font-size: 14px;
  ${media.desktop`font-size: 19px;`}
`;
