import { createSelector } from 'reselect';

const selectAlertTypes = () => (state) => state.getIn(['eliteApiLoader', 'AlertTypes']);
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
  selectAlertInfo,
};
