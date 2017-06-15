import React from 'react';
import PropTypes from 'prop-types';

import {
  AlertHolder,
  AlertItem,
  AlertItemMobile,
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
        const d = new Date(alert.dateCreated);
        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        };
        const dateString = d.toLocaleTimeString('en-us', options);
        const dateArray = dateString.split(',');

        const codeDataDescription = alert.codeData !== undefined ? alert.codeData.description : '';
        const typeDataDescription = alert.typeData !== undefined ? alert.typeData.description : '';

        const forRender = deviceFormat === 'desktop' ?
        (<AlertItem key={alert.alertId}>
          <AlertTypeWrapper>
            <AlertType>{alert.alertType}</AlertType>
            <AlertTypeDescription>{String(typeDataDescription).toUpperCase()}</AlertTypeDescription>
          </AlertTypeWrapper>
          <AlertCodeWrapper>
            <AlertCodeDescription>{codeDataDescription} ({alert.alertCode})</AlertCodeDescription>
            <AlertEntryDate>Entry date: {dateArray[0]},{dateArray[1]}</AlertEntryDate>
          </AlertCodeWrapper>
        </AlertItem>) :
        (<AlertItemMobile key={alert.alertId}>
          <AlertTypeWrapperMobile>
            <AlertTypeMobile>{alert.alertType}</AlertTypeMobile>
            <AlertTypeDescriptionMobile>{String(typeDataDescription).toUpperCase()}</AlertTypeDescriptionMobile>
          </AlertTypeWrapperMobile>
          <AlertCodeWrapperMobile>
            <AlertCodeDescriptionMobile>{codeDataDescription} ({alert.alertCode})</AlertCodeDescriptionMobile>
            <AlertEntryDateMobile>Entry date: {dateArray[0]},{dateArray[1]}</AlertEntryDateMobile>
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
