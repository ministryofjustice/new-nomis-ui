import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import uuid from 'uuid/v4';
import { Map, List } from 'immutable';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { LoadingMessage } from 'components/CommonTheme';
import PreviousNextNavigation from 'components/PreviousNextNavigation';
import AlertList from 'components/Bookings/Details/AlertList';

import { loadBookingAlerts } from 'containers/EliteApiLoader/actions';
import { selectDeviceFormat } from 'selectors/app';
import { paginationHash } from 'containers/EliteApiLoader/helpers';

import { Model as alertsModel } from 'helpers/dataMappers/alerts';

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

  componentDidMount() {
    const { loadAlerts, bookingId, alertsPagination } = this.props;

    loadAlerts(bookingId, alertsPagination);
  }

  render() {
    const { alerts, totalResults, alertsPagination, bookingId, setPagination, deviceFormat } = this.props;
    return (
      <div>
        <AlertList alerts={alerts} deviceFormat={deviceFormat} />

        <PreviousNextNavigation
          pagination={alertsPagination} totalRecords={totalResults} pageAction={(id) => {
            setPagination(bookingId, { perPage: alertsPagination.perPage, pageNumber: id }, id)
            if (window) window.scrollTo(0,0);
          }}
        />
      </div>
    );
  }
}

Alerts.propTypes = {
  loadAlerts: PropTypes.func.isRequired,
  setPagination: PropTypes.func.isRequired,
  bookingId: PropTypes.number.isRequired,
  alertsPagination: PropTypes.object.isRequired,
  alerts: ImmutablePropTypes.list.isRequired,
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

const mapStateToProps = (immutableState,props) => {
  const alerts = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', Number(props.bookingId), 'Alerts']) || alertsModel;

  const pagination = immutableState.getIn(['search', 'details', 'alertsPagination']).toJS();
  const alertItems = alerts.getIn(['Paginations', paginationHash(pagination), 'items']) || List([]);
  const totalResults = alerts.getIn(['MetaData','TotalRecords']);
  const deviceFormat = immutableState.getIn(['app','deviceFormat']);

  return {
    bookingId: Number(props.bookingId),
    alerts: alertItems,
    alertsPagination: pagination,
    totalResults,
    deviceFormat,
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
