import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { LoadingMessage } from 'components/CommonTheme';
import PreviousNextNavigation from 'components/PreviousNextNavigation';
import AlertList from 'components/Bookings/Details/AlertList';

import { loadBookingAlerts } from 'containers/EliteApiLoader/actions';
import { selectDeviceFormat } from 'selectors/app';

import { selectAlertsPagination, selectBookingDetailsId } from '../../selectors';

import {
  selectAlerts,
  selectAlertsStatus,
  selectTotalAlerts,
} from './selectors';

import {
  setAlertPagination,
} from '../../actions';

class Alerts extends PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    const { loadAlerts, bookingId, alertsPagination } = this.props;
    loadAlerts(bookingId, alertsPagination);
  }

  render() {
    const { alerts, alertsStatus, totalResults, alertsPagination, bookingId, setPagination, deviceFormat } = this.props;

    return (
      <div>
        {alertsStatus.Type === 'SUCCESS' ?
          <AlertList alerts={alerts} deviceFormat={deviceFormat} />
          :
          <LoadingMessage>Loading alerts ...</LoadingMessage>
        }
        <PreviousNextNavigation pagination={alertsPagination} totalRecords={totalResults} pageAction={(id) => setPagination(bookingId, { perPage: alertsPagination.perPage, pageNumber: id }, id)} />
      </div>
    );
  }
}

Alerts.propTypes = {
  loadAlerts: PropTypes.func.isRequired,
  alertsStatus: PropTypes.object,
  setPagination: PropTypes.func.isRequired,
  bookingId: PropTypes.number.isRequired,
  alertsPagination: PropTypes.object.isRequired,
  alerts: PropTypes.array.isRequired,
  totalResults: PropTypes.number,
  deviceFormat: PropTypes.string.isRequired,
};

Alerts.defaultProps = {
  alertsStatus: {},
  totalResults: 0,
};

export function mapDispatchToProps(dispatch) {
  return {
    loadAlerts: (id, pagination) => dispatch(loadBookingAlerts(id, pagination)),
    setPagination: (id, pagination) => dispatch(setAlertPagination(id, pagination)),
  };
}

const mapStateToProps = createStructuredSelector({
  alerts: selectAlerts(),
  alertsStatus: selectAlertsStatus(),
  alertsPagination: selectAlertsPagination(),
  bookingId: selectBookingDetailsId(),
  totalResults: selectTotalAlerts(),
  deviceFormat: selectDeviceFormat(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
