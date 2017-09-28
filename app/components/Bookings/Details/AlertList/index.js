import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate } from 'react-intl';

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

  if( !alerts || !alerts.length){
    return <h1 className="bold-medium">There are no alerts for this offender.</h1>
  }

  return (
    <AlertHolder>
      {alerts.map((alert, index) => {
          const key = `${alert.alertId},${index}`;
          return (<AlertItem key={key} expired={alert.expired}>
            <AlertTypeWrapper expired={alert.expired}>
              <AlertType>{alert.alertType}</AlertType>
              <AlertTypeDescription>{String(alert.alertTypeDescription)}</AlertTypeDescription>
            </AlertTypeWrapper>
            <AlertCodeWrapper>
              <AlertCodeDescription>{alert.alertCodeDescription} ({alert.alertCode})</AlertCodeDescription>
              {alert.expired ?
                <AlertComment>Expired: <FormattedDate value={Date.parse(alert.dateExpires)} /></AlertComment>
                :
                <AlertComment>{alert.comment}</AlertComment>
              }
              <AlertEntryDate>Entry date: <FormattedDate value={Date.parse(alert.dateCreated)} /></AlertEntryDate>
            </AlertCodeWrapper>
          </AlertItem>);
      })
      }
    </AlertHolder>
  );
}

AlertList.propTypes = {
  alerts: PropTypes.array.isRequired,
};

export default AlertList;
