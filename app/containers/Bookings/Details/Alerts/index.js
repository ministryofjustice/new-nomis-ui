import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { push } from 'react-router-redux';
import { Map } from 'immutable';

import { List } from 'immutable';

import { connect } from 'react-redux';

import PreviousNextNavigation from 'components/PreviousNextNavigation';
import AlertsFilterForm from 'containers/Bookings/Details/Alerts/alertsFilterForm';
import AlertList from 'components/Bookings/Details/AlertList';

import { loadBookingAlerts } from 'containers/EliteApiLoader/actions';
import { buildPaginationQueryString } from 'utils/stringUtils';

import { Model as alertsModel } from 'helpers/dataMappers/alerts';

class Alerts extends Component {
  componentDidMount() {
    const { loadAlerts, offenderNo, pagination } = this.props;

    loadAlerts(offenderNo, pagination);
  }

  componentDidUpdate(prevProps) {
    if (!Map(prevProps.pagination).equals(Map(this.props.pagination))) {
      this.props.loadAlerts(this.props.offenderNo, this.props.pagination);
    }
  }

  render() {
    const { alerts, totalResults, pagination, offenderNo, setPagination, deviceFormat } = this.props;
    const handleSubmit = () => null;

    return (
      <div>
        <AlertsFilterForm handleSubmit={handleSubmit} deviceFormat={deviceFormat} />
        <AlertList alerts={alerts} deviceFormat={deviceFormat} />

        <PreviousNextNavigation
          pagination={pagination}
          totalRecords={totalResults}
          pageAction={(id) => {
            setPagination(offenderNo, { perPage: pagination.perPage, pageNumber: id }, id);
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
  pagination: PropTypes.object.isRequired,
  alerts: ImmutablePropTypes.list.isRequired,
  deviceFormat: PropTypes.string.isRequired,
};


export function mapDispatchToProps(dispatch) {
  return {
    loadAlerts: (id, pagination) => dispatch(loadBookingAlerts(id, pagination)),
    setPagination: (id, pagination) => dispatch(push(`/offenders/${id}/alerts?${buildPaginationQueryString(pagination)}`)),
  };
}

const mapStateToProps = (immutableState, props) => {
  const alerts = immutableState.getIn(['eliteApiLoader', 'Bookings', 'Details', props.offenderNo, 'Alerts']) || alertsModel;
  const alertItems = alerts.get('items') || List([]);
  const totalResults = alerts.getIn(['MetaData','TotalRecords']);
  const deviceFormat = immutableState.getIn(['app','deviceFormat']);
  const pagination = { perPage: props.location.query.perPage || 10, pageNumber: props.location.query.pageNumber || 0 };

  return {
    pagination,
    offenderNo: props.offenderNo,
    alerts: alertItems,
    totalResults,
    deviceFormat,
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
