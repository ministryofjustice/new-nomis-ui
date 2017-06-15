import { createSelector } from 'reselect';
import { selectBookingDetail, selectAlertsPagination } from 'containers/Bookings/selectors';
import { paginationHash } from 'containers/EliteApiLoader/helpers';

const selectAlertsObject = () => createSelector(
  selectBookingDetail(),
  (details) => details.get('Alerts')
);

const selectAlertsPaginationItem = () => createSelector(
  selectAlertsObject(),
  selectAlertsPagination(),
  (alerts, pagination) => {
    const thisPageOfAlerts = alerts ? alerts.getIn(['Paginations', paginationHash(pagination)]) : undefined;
    // Setting some defaults in this selector... maybe this is bad form.
    return thisPageOfAlerts && thisPageOfAlerts.toJS ? thisPageOfAlerts.toJS() : { Status: { Type: 'Not Even Loading' }, items: [] };
  }
);

const selectAlertsStatus = () => createSelector(
  selectAlertsPaginationItem(),
  (alertsState) => alertsState.Status
);

const selectAlertTypes = () => (state) => state.getIn(['eliteApiLoader', 'AlertTypes']);

const selectAlerts = () => createSelector(
  selectAlertsPaginationItem(),
  selectAlertTypes(),
  (alertsState, alertTypes) => alertsState.items.map((alert) => {
    const { alertType, alertCode } = alert;
    const typeData = alertTypes.getIn([alertType, 'Data']);
    const codeData = alertTypes.getIn([alertType, 'Codes', alertCode, 'Data']);
    return {
      ...alert,
      typeData: typeData ? typeData.toJS() : undefined,
      codeData: codeData ? codeData.toJS() : undefined,
    };
  })
);

const selectTotalAlerts = () => createSelector(
  selectAlertsObject(),
  (alerts) => alerts.getIn(['MetaData', 'TotalRecords']),
);

const selectAlertTypeAndCode = () => (_, props) => ({ alertType: props.alertType, alertCode: props.alertCode });

const selectAlertInfo = () => createSelector(
  selectAlertTypes(),
  selectAlertTypeAndCode(),
  (alertTypes, { alertType, alertCode }) => {
    const typeData = alertTypes.getIn([alertType, 'Data']);
    const codeData = alertTypes.getIn([alertType, 'Codes', alertCode, 'Data']);
    return {
      typeData: typeData ? typeData.toJS() : undefined,
      codeData: codeData ? codeData.toJS() : undefined,
    };
  }
);

export {
  selectAlerts,
  selectAlertsStatus,
  selectTotalAlerts,
  selectAlertInfo,
};
