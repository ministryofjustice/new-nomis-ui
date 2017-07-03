import styled from 'styled-components';
import colours from 'theme/colours';

export const AlertHolder = styled.div`

`;

export const AlertItem = styled.div`
  position: relative;
  height: 150px;
  width: 60%;
  border-bottom: 1px solid ${colours.bookings.details.datagrid.gridLineColour};
`;

export const AlertItemMobile = styled(AlertItem)`
  height: 250px;
`;

export const AlertTypeWrapper = styled.div`
    width: 190px;
    padding-top: 18px;
`;

export const AlertTypeWrapperMobile = styled(AlertTypeWrapper)`
    width: 260px;
    padding-top: 40px;
`;

export const AlertType = styled.div`
  font-size: 50px;
  font-weight: bold;
  color: ${colours.bookings.details.alerts.warningTextColour};
  width: 100%;
  text-align: center;
`;

export const AlertTypeMobile = styled(AlertType)`
  font-size: 65px;
`;

export const AlertTypeDescription = styled.div`
  font-size: 19px;
  font-weight: bold;
  color: ${colours.bookings.details.alerts.warningTextColour};
  width: 100%;
  text-align: center;
`;

export const AlertTypeDescriptionMobile = styled(AlertTypeDescription)`
  font-size: 26px;
`;

export const AlertCodeWrapper = styled.div`
  display: inline-block;
  display: block;
  position: absolute;
  top: 0;
  left: 260px;
  height: 115px;
  width: 100%;
  padding-top: 23px;
`;

export const AlertCodeWrapperMobile = styled(AlertCodeWrapper)`
  height: 236px;
  padding-top: 48px;
`;

export const AlertCodeDescription = styled.div`
  font-size: 19px;
  font-weight: bold;
`;

export const AlertCodeDescriptionMobile = styled(AlertCodeDescription)`
  font-size: 30px;
`;

export const AlertEntryDate = styled.div`
  position: absolute;
  bottom: 0;
  font-size: 16px;
  color: ${colours.bookings.details.alerts.greyText};
`;

export const AlertEntryDateMobile = styled(AlertEntryDate)`
  font-size: 27px;
`;

