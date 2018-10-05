import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { push } from 'react-router-redux';
import { Map } from 'immutable';
import { List } from 'immutable';

import { connect } from 'react-redux';

import qs from 'querystring';

import PreviousNextNavigation from 'components/PreviousNextNavigation';
import AlertsFilterForm from 'containers/Bookings/Details/Alerts/alertsFilterForm';
import AlertList from 'components/Bookings/Details/AlertList';

import { loadBookingAlerts } from 'containers/EliteApiLoader/actions';

import { Model as alertsModel } from 'helpers/dataMappers/alerts';

class Alerts extends Component {
  componentDidMount() {
    const { loadAlerts, offenderNo, pagination, filter } = this.props;

    loadAlerts(offenderNo, pagination, filter);
  }

  componentDidUpdate(prevProps) {
    if (!Map({ ...prevProps.pagination, ...prevProps.filter }).equals(Map({ ...this.props.pagination, ...this.props.filter }))) {
      this.props.loadAlerts(this.props.offenderNo, this.props.pagination, this.props.filter);
    }
  }

  render() {
    const { alerts, totalResults, pagination, offenderNo, setPagination, setFilter, deviceFormat } = this.props;

    return (
      <div>
        <AlertsFilterForm
          deviceFormat={deviceFormat}
          setFilter={(filterValues) => setFilter(offenderNo, filterValues)}
        />

        <AlertList alerts={alerts} deviceFormat={deviceFormat} />

        <PreviousNextNavigation
          pagination={pagination}
          totalRecords={totalResults}
          pageAction={(pageNumber) => {
            setPagination(offenderNo, { perPage: pagination.perPage, pageNumber }, pageNumber);
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
  filter: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  alerts: ImmutablePropTypes.list.isRequired,
  deviceFormat: PropTypes.string.isRequired,
};

const paginationDefault = { perPage: 10, pageNumber: 0 };

const buildUrl = (offenderNo, queryParams) => `/offenders/${offenderNo}/alerts?${qs.stringify({ ...paginationDefault, ...queryParams })}`;

export function mapDispatchToProps(dispatch, props) {
  return {
    loadAlerts: (id, pagination, filter) => dispatch(loadBookingAlerts(id, pagination, filter)),
    setPagination: (offenderNo, pagination) => dispatch(push(buildUrl(offenderNo, { ...props.location.query, ...pagination }))),
    setFilter: (offenderNo, filter) => dispatch(push(buildUrl(offenderNo, filter))),
  };
}

const mapStateToProps = (immutableState, props) => {
  const alerts = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', props.offenderNo, 'Alerts']) || alertsModel;
  const alertItems = alerts.get('items') || List([]);
  const totalResults = alerts.getIn(['MetaData','TotalRecords']);
  const deviceFormat = immutableState.getIn(['app','deviceFormat']);
  const filter = { fromDate: props.location.query.fromDate, toDate: props.location.query.toDate, alertType: props.location.query.alertType };
  const pagination = { perPage: props.location.query.perPage || 10, pageNumber: props.location.query.pageNumber || 0 };

  return {
    filter,
    pagination,
    offenderNo: props.offenderNo,
    alerts: alertItems,
    totalResults,
    deviceFormat,
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
