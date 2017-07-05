import React from 'react';
import PropTypes from 'prop-types';

import {
  AlertHolder,
  AlertItem,
  AlertItemMobile,
  AlertItemMobileDisabled,
  AlertTypeWrapper,
  AlertTypeWrapperMobile,
  AlertCodeWrapperMobile,
  AlertType,
  AlertTypeMobile,
  AlertTypeDescription,
  AlertTypeDescriptionMobile,
  AlertCodeWrapper,
  AlertCodeDescription,
  AlertCodeDescriptionMobile,
  AlertEntryDate,
  AlertEntryDateMobile,
} from './theme';

function AlertList({ alerts, deviceFormat }) {
  return (
    <AlertHolder>
      {alerts.map((alert) => {
        // fancy logic to get the proper date format
        const dateCreated = new Date(alert.dateCreated);

        let expiredAlert = false;
        if (alert.dateExpires !== null) {
          expiredAlert = (new Date(alert.dateExpires) <= new Date());
        }

        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        };
        const createdDateString = dateCreated.toLocaleTimeString('en-us', options);
        const createdDateArray = createdDateString.split(',');

        const codeDataDescription = alert.codeData !== undefined ? alert.codeData.description : '';
        const typeDataDescription = alert.typeData !== undefined ? alert.typeData.description : '';

        const forRender = deviceFormat === 'desktop' ?
          (<AlertItem key={alert.alertId}>
            <AlertTypeWrapper>
              <AlertType>{alert.alertType}</AlertType>
              <AlertTypeDescription>{String(typeDataDescription)}</AlertTypeDescription>
            </AlertTypeWrapper>
            <AlertCodeWrapper>
              <AlertCodeDescription>{codeDataDescription} ({alert.alertCode})</AlertCodeDescription>
              <div>{expiredAlert ? 'Expired' : alert.comment}</div>
              <AlertEntryDate>Entry date: {createdDateArray[0]},{createdDateArray[1]}</AlertEntryDate>
            </AlertCodeWrapper>
          </AlertItem>) :
          (<AlertItemMobile key={alert.alertId}>
          <AlertTypeWrapperMobile>
            <AlertTypeMobile>{alert.alertType}</AlertTypeMobile>
            <AlertTypeDescriptionMobile>{String(typeDataDescription)}</AlertTypeDescriptionMobile>
          </AlertTypeWrapperMobile>
          <AlertCodeWrapperMobile>
            <AlertCodeDescriptionMobile>{codeDataDescription} ({alert.alertCode})</AlertCodeDescriptionMobile>
            <div>{expiredAlert ? 'Expired' : alert.comment}</div>
            <AlertEntryDateMobile>Entry date: {createdDateArray[0]},{createdDateArray[1]}</AlertEntryDateMobile>
          </AlertCodeWrapperMobile>
        </AlertItemMobile>);

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
