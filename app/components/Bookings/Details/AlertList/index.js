import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from 'styled-components';
import { List } from 'immutable';

import { FormattedDate } from 'components/intl';
import colours from 'theme/colours';

const Table = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border: none;
  margin-bottom: 1em
`;

const Th = styled.th`
  font-size: 16px;
`;

const ThSixth = styled(Th)`
  width: 16.666%;
`;

const ThThird = styled(Th)`
  width: 33.333%;
`;

const TrBanded = styled.tr`
  &:nth-of-type(even) {
    background: #F6F6F6;
   }
`;

const Td = styled.td`
  overflow: hidden;
  border: none;
  font-size: 16px;
  padding: 25px 15px 25px 0;
`;

const TdAlertType = styled(Td)`
  font-weight: bold;
  color: ${(props) => props.active ? colours.bookings.details.alerts.warningTextColour : '#6F777B'};
`;

const TdAlert = styled(Td)`
  color: ${(props) => props.active ? 'black' : '#6F777B'};
`;

const TdNotes = styled(Td)`
  font-size: 14px;
`;

const P = styled.p`
  margin: 0;
`;

const PMobile = styled(P)`
overflow: hidden;
  font-size: 14px;
  line-height: 1.4;
`;

const PAlertType = styled(PMobile)`
  font-weight: bold;
  color: ${(props) => props.active ? colours.bookings.details.alerts.warningTextColour : '#6F777B'};
`;

const PAlert = styled(PMobile)`
  color: ${(props) => props.active ? 'black' : '#6F777B'};
`;

const MobileAlertRecord = styled.div`
  padding: 11px 0 1px 0;
  font-size: 14pt;
  &:nth-of-type(even) {
    background: #F6F6F6;
  }
`;

const MobileHeading = styled.h3`
  margin-bottom: 12px;
`;

const MobileRow = styled.div`
  padding: 0 0 10px 0;
`;

const MobileColumn = styled.div`
  padding: 0 5px 0 0;
`;

const VerticalSpace = styled.div`
  padding: 20px 0;
`;

const formatName = (alert, firstNameKey, lastNameKey) => {
  const titleCase = (s) => `${s.slice(0,1).toUpperCase()}${s.slice(1).toLowerCase()}`;

  const firstName = alert.get(firstNameKey);
  const lastName = alert.get(lastNameKey);
  if (firstName) {
    return lastName ? `${titleCase(firstName)}, ${titleCase(lastName)}` : titleCase(firstName);
  }
  return lastName ? titleCase(lastName) : null;
};

const formatAlertType = alert => `${String(alert.get('alertTypeDescription'))} (${alert.get('alertType')})`;
const formatAlert = a => `${a.get('alertCodeDescription')} (${a.get('alertCode')})`;

const DesktopAlertItems = ({ alerts, active }) => (
  <Table>
    { active ? <caption className="bold-medium add-gutter-bottom">Active alerts</caption> : <caption className="bold-medium add-gutter-bottom">Inactive alerts</caption> }

    <thead>
      <tr>
        <ThSixth>Type of alert</ThSixth>
        <ThSixth>Alert</ThSixth>
        <ThThird>Notes</ThThird>
        { active ? <ThSixth>Date added</ThSixth> : <ThSixth>Date added / expired</ThSixth> }
        { active ? <ThSixth>Added by</ThSixth> : <ThSixth>Added / Expired by</ThSixth> }
      </tr>
    </thead>
    <tbody>
    {alerts.map(alert => (
      <TrBanded key={alert.get('alertId')}>
        <TdAlertType active={active}>{formatAlertType(alert)}</TdAlertType>
        <TdAlert active={active}>{formatAlert(alert)}</TdAlert>
        <TdNotes>{alert.get('comment') ? alert.get('comment') : '―'}</TdNotes>
        <Td>
          <P><FormattedDate value={alert.get('dateCreated')} /></P>
          { !active && <P><FormattedDate value={alert.get('dateExpires')} /></P> }
        </Td>
        <Td>
          <P>{ formatName(alert, 'addedByFirstName', 'addedByLastName') }</P>
          { !active && <P>{formatName(alert, 'expiredByFirstName', 'expiredByLastName')}</P> }
        </Td>
      </TrBanded>
    ))}
    </tbody>
  </Table>
);

const MobileAlertItems = ({ alerts, active }) => (
  <div>
    { active ? <MobileHeading className="bold-medium">Active alerts</MobileHeading> : <MobileHeading className="bold-medium">Inactive alerts</MobileHeading> }

    {alerts.map(alert => (
      <MobileAlertRecord key={alert.get('alertId')}>
        <MobileRow className="row" >
          <MobileColumn className="col-xs-6">
            <PAlertType active={active}>{formatAlertType(alert)}</PAlertType>
            <PAlert active={active}>{formatAlert(alert)}</PAlert>
          </MobileColumn>
          <MobileColumn className="col-xs-6">
            <PMobile>{alert.get('comment') ? alert.get('comment') : '―'}</PMobile>
          </MobileColumn>
        </MobileRow>
        <MobileRow className="row">
          <MobileColumn className="col-xs-6">
            <PMobile><FormattedDate value={alert.get('dateCreated')} /></PMobile>
            {!active && <PMobile><FormattedDate value={alert.get('dateExpires')} /></PMobile>}
          </MobileColumn>
          <MobileColumn className="col-xs-6">
            <PMobile>{formatName(alert, 'addedByFirstName', 'addedByLastName')}</PMobile>
            {!active && <PMobile>{formatName(alert, 'expiredByFirstName', 'expiredByLastName')}</PMobile>}
          </MobileColumn>
        </MobileRow>
      </MobileAlertRecord>
    ))}
  </div>
);

const ActiveAlertItems = ({ alerts, desktop }) => {
  if (alerts.size < 1) return false;
  return (
    <div>
      {desktop ? <DesktopAlertItems alerts={alerts} active /> : <MobileAlertItems alerts={alerts} active /> }
    </div>
  )
};

const InactiveAlertItems = ({ alerts, desktop }) => {
  if (alerts.size < 1) return false;
  return (
    <div>
      {desktop ? <DesktopAlertItems alerts={alerts} /> : <MobileAlertItems alerts={alerts} /> }
    </div>
  )
};

function AlertList({ alerts, deviceFormat }) {
  if (alerts.size < 1) {
    return <h1 className="bold-medium">There are no alerts for this offender.</h1>
  }

  const activeAlerts = alerts.filter(alert => !alert.get('expired'));
  const expiredAlerts = alerts.filter(alert => alert.get('expired'));
  const desktop = deviceFormat === 'desktop';

  return (
    // The Integration tests use alert-tables class to select content. This class doesn't have any CSS styles attached.
    <div className="alert-tables">
      <ActiveAlertItems alerts={activeAlerts} desktop={desktop} />
      { activeAlerts && expiredAlerts && <VerticalSpace />}
      <InactiveAlertItems alerts={expiredAlerts} desktop={desktop} />
    </div>
  );
}

AlertList.propTypes = {
  alerts: ImmutablePropTypes.list,
};

AlertList.defaultProps = {
  alerts: List([]),
};

export default AlertList;
