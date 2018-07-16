import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { FormattedDate } from 'components/intl';
import uuid from 'uuid/v4';

import { List } from 'immutable';

import {
  AlertHolder,
  AlertItem,
  AlertTypeWrapper,
  AlertType,
  AlertTypeDescription,
  AlertCodeWrapper,
  AlertCodeDescription,
  AlertComment,
  AlertEntryDate,
} from './theme';

function AlertList({ alerts }) {
  if (!alerts.size) {
    return <h1 className="bold-medium">There are no alerts for this offender.</h1>
  }

  return (
    <AlertHolder className="offender-alerts">
      {alerts.map((alert) => (
        <AlertItem key={uuid()} expired={alert.get('expired')}>
          <AlertTypeWrapper expired={alert.get('expired')}>
            <AlertType>{alert.get('alertType')}</AlertType>
            <AlertTypeDescription>{String(alert.get('alertTypeDescription'))}</AlertTypeDescription>
          </AlertTypeWrapper>
          <AlertCodeWrapper>
            <AlertCodeDescription>{alert.get('alertCodeDescription')} ({alert.get('alertCode')})</AlertCodeDescription>
            {alert.get('expired') ?
              <AlertComment>Expired: <FormattedDate value={alert.get('dateExpires')} /></AlertComment>
              :
              <AlertComment>{alert.get('comment')}</AlertComment>
            }
            <AlertEntryDate>Entry date: <FormattedDate value={alert.get('dateCreated')} /></AlertEntryDate>
          </AlertCodeWrapper>
        </AlertItem>)
      )}
    </AlertHolder>
  );
}

AlertList.propTypes = {
  alerts: ImmutablePropTypes.list,
};

AlertList.defaultProps = {
  alerts: List([]),
};

export default AlertList;
