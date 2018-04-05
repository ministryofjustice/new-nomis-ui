import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { List } from 'immutable';

import { connect } from 'react-redux';

import PreviousNextNavigation from 'components/PreviousNextNavigation';
import AlertList from 'components/Bookings/Details/AlertList';

import { loadBookingAlerts } from 'containers/EliteApiLoader/actions';
import { paginationHash } from 'containers/EliteApiLoader/helpers';

import { Model as alertsModel } from 'helpers/dataMappers/alerts';

import {
  setAlertPagination,
} from '../../actions';

class Alerts extends Component {
  componentDidMount() {
    const { loadAlerts, offenderNo, alertsPagination } = this.props;

    loadAlerts(offenderNo, alertsPagination);
  }

  render() {
    const { alerts, totalResults, alertsPagination, offenderNo, setPagination, deviceFormat } = this.props;
    return (
      <div>
        <AlertList alerts={alerts} deviceFormat={deviceFormat} />

        <PreviousNextNavigation
          pagination={alertsPagination} totalRecords={totalResults} pageAction={(id) => {
            setPagination(offenderNo, { perPage: alertsPagination.perPage, pageNumber: id }, id)
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
  offenderNo: PropTypes.string.isRequired,
  alertsPagination: PropTypes.object.isRequired,
  alerts: ImmutablePropTypes.list.isRequired,
  deviceFormat: PropTypes.string.isRequired,
};


export function mapDispatchToProps(dispatch) {
  return {
    loadAlerts: (id, pagination) => dispatch(loadBookingAlerts(id, pagination)),
    setPagination: (id, pagination) => dispatch(setAlertPagination(id, pagination)),
  };
}

const mapStateToProps = (immutableState,props) => {
  const alerts = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', props.offenderNo, 'Alerts']) || alertsModel;
  const pagination = immutableState.getIn(['search', 'details', 'alertsPagination']).toJS();
  const alertItems = alerts.getIn(['Paginations', paginationHash(pagination), 'items']) || List([]);
  const totalResults = alerts.getIn(['MetaData','TotalRecords']);
  const deviceFormat = immutableState.getIn(['app','deviceFormat']);

  return {
    offenderNo: props.offenderNo,
    alerts: alertItems,
    alertsPagination: pagination,
    totalResults,
    deviceFormat,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
