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
  return (
    <AlertHolder>
      {alerts.map((alert) => {
        const codeDataDescription = alert.codeData !== undefined ? alert.codeData.description : '';
        const typeDataDescription = alert.typeData !== undefined ? alert.typeData.description : '';

        const forRender =
          (<AlertItem key={alert.alertId} expired={alert.expired}>
            <AlertTypeWrapper expired={alert.expired}>
              <AlertType>{alert.alertType}</AlertType>
              <AlertTypeDescription>{String(typeDataDescription)}</AlertTypeDescription>
            </AlertTypeWrapper>
            <AlertCodeWrapper>
              <AlertCodeDescription>{codeDataDescription} ({alert.alertCode})</AlertCodeDescription>
              {alert.expired ?
                <AlertComment>Expired: <FormattedDate value={Date.parse(alert.dateExpires)} /></AlertComment>
                  :
                <AlertComment>{alert.comment}</AlertComment>
              }
              <AlertEntryDate>Entry date: <FormattedDate value={Date.parse(alert.dateCreated)} /></AlertEntryDate>
            </AlertCodeWrapper>
          </AlertItem>);
        return alert.typeData !== undefined && alert.codeData !== undefined ? forRender : null;
      })
      }
    </AlertHolder>
  );
}

AlertList.propTypes = {
  alerts: PropTypes.array.isRequired,
};

export default AlertList;
