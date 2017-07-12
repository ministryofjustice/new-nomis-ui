import React from 'react';
import PropTypes from 'prop-types';

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

function getFormattedDate(formattedDate) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  const dateTemp = new Date(formattedDate);
  const dateString = dateTemp.toLocaleTimeString('en-us', options);
  const dateArray = dateString.split(',');
  return dateArray[0] + ' ,' + dateArray[1];
}

function AlertList({ alerts, deviceFormat }) {
  return (
    <AlertHolder>
      {alerts.map((alert) => {
        const codeDataDescription = alert.codeData !== undefined ? alert.codeData.description : '';
        const typeDataDescription = alert.typeData !== undefined ? alert.typeData.description : '';

        const forRender =
          <AlertItem key={alert.alertId} expired={alert.expired}>
            <AlertTypeWrapper expired={alert.expired}>
              <AlertType>{alert.alertType}</AlertType>
              <AlertTypeDescription>{String(typeDataDescription)}</AlertTypeDescription>
            </AlertTypeWrapper>
            <AlertCodeWrapper>
              <AlertCodeDescription>{codeDataDescription} ({alert.alertCode})</AlertCodeDescription>
              <AlertComment>{alert.expired ? 'Expired: ' + getFormattedDate(alert.dateExpires) : alert.comment}</AlertComment>
              <AlertEntryDate>Entry date: {getFormattedDate(alert.dateCreated)}</AlertEntryDate>
            </AlertCodeWrapper>
          </AlertItem>;
        return alert.typeData !== undefined && alert.codeData !== undefined ? forRender : null;
      })
      }
    </AlertHolder>
  );
}

AlertList.propTypes = {
  alerts: PropTypes.array.isRequired,
  deviceFormat: PropTypes.string.isRequired,
};

export default AlertList;
