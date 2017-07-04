import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import AlertList from 'components/Bookings/Details/AlertList';

import { loadBookingAlerts } from 'containers/EliteApiLoader/actions';
import { selectDeviceFormat } from 'selectors/app';
import { selectAlertsPagination, selectBookingDetailsId } from '../../selectors';

import {
  selectAlerts,
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
    const { alerts, totalResults, alertsPagination, bookingId, setPagination, deviceFormat } = this.props;
    return (<div>
      <AlertList alerts={alerts} deviceFormat={deviceFormat} />
    </div>);
  }
}

Alerts.propTypes = {
  loadAlerts: PropTypes.func.isRequired,
  setPagination: PropTypes.func.isRequired,
  bookingId: PropTypes.number.isRequired,
  alertsPagination: PropTypes.object.isRequired,
  alerts: PropTypes.array.isRequired,
  totalResults: PropTypes.number,
  deviceFormat: PropTypes.string.isRequired,
};

Alerts.defaultProps = {
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
  // alertStatus: selectAlertsStatus(),
  alertsPagination: selectAlertsPagination(),
  bookingId: selectBookingDetailsId(),
  totalResults: selectTotalAlerts(),
  deviceFormat: selectDeviceFormat(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
