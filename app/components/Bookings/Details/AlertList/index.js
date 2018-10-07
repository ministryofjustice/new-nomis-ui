import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from 'styled-components';
import { List } from 'immutable';

import { FormattedDate, FormattedTime } from 'components/intl';
import colours from 'theme/colours';


const Table = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border: none;
  margin-bottom: 2em`;

const Th = styled.th`
  font-size: 16px;
`;

const ThSixth = styled(Th)`
  width: 16.666%;
`;

const ThThird = styled(Th)`
  width: 33.333%;
`;

const Td = styled.td`
  overflow-x: hidden;
  border: none;
  font-size: 16px;
  padding: 25px 15px 25px 0;
`;

const TdAlertType = styled(Td)`
  font-weight: bold;
  color: ${(props) => props.active ? colours.bookings.details.alerts.warningTextColour : '#6F777B'};
`;

const TdNotes = styled(Td)`
  font-size: 14px;
`;

const TrBanded = styled.tr`
  &:nth-of-type(even) {
    background: #F6F6F6;
   }
`;

const P = styled.p`
  margin: 0;
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

const FormattedDateTime = ({ dateTime }) => dateTime && (
  <span>
    <FormattedDate value={dateTime} /> - <FormattedTime value={dateTime} />
  </span>
);

const formatAlertType = alert => `${String(alert.get('alertTypeDescription'))} (${alert.get('alertType')})`;
const formatAlert = a => `${a.get('alertCodeDescription')} (${a.get('alertCode')})`;

const DesktopAlertItems = ({ alerts, active }) => (
  <Table>
    { active ? <caption className="bold-medium">Active alerts</caption> : <caption className="bold-medium">Inactive alerts</caption> }

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
        <Td>{formatAlert(alert)}</Td>
        <TdNotes>{alert.get('comment')}</TdNotes>
        <Td>
          <P><FormattedDateTime dateTime={alert.get('dateCreated')} /></P>
          { !active && <P><FormattedDateTime dateTime={alert.get('dateExpires')} /></P> }
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
    {alerts.map(alert => (
      <div key={alert.get('alertId')}>
        <div>
          {formatAlertType(alert)}

          {formatAlert(alert)}

          <FormattedDateTime dateTime={alert.get('dateCreated')} />
          { !active && <FormattedDateTime dateTime={alert.get('dateExpires')} /> }
        </div>
        <div>
          {alert.get('comment')}

          { formatName(alert, 'addedByFirstName', 'addedByLastName') }
          { !active && formatName(alert, 'expiredByFirstName', 'expiredByLastName') }

        </div>
      </div>
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
    <div>
      <ActiveAlertItems alerts={activeAlerts} desktop={desktop} />
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
