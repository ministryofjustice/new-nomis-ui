import React, { Component } from 'react';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form/lib/immutable';
import PropTypes from 'prop-types';

import DesktopAlertsFilterForm from 'components/Bookings/Details/AlertList/desktopAlertsFilterForm';
import MobileAlertsFilterForm from 'components/Bookings/Details/AlertList/mobileAlertsFilterForm';
import { loadAlertTypes } from 'containers/Bookings/actions';
// import { DATE_ONLY_FORMAT_SPEC } from 'containers/App/constants';

import { selectLocale } from 'containers/LanguageProvider/selectors';
import { selectAlertTypes } from 'containers/Bookings/Details/Alerts/selectors';


class AlertsFilterForm extends Component {

  componentDidMount() {
    const { dispatchLoadAlertTypes } = this.props;
    dispatchLoadAlertTypes();
  }

  render() {
    const { alertTypes, deviceFormat, handleSubmit, locale } = this.props;

    return deviceFormat === 'desktop' ?
      (<DesktopAlertsFilterForm alertTypes={alertTypes} handleSubmit={handleSubmit} locale={locale} />)
      :
      (<MobileAlertsFilterForm alertTypes={alertTypes} handleSubmit={handleSubmit} locale={locale} />);
  }
}

AlertsFilterForm.propTypes = {
  locale: PropTypes.string,
  dispatchLoadAlertTypes: PropTypes.func.isRequired,
};

AlertsFilterForm.defaultProps = {
  locale: 'en',
};


const convertFormValues = (filterValues) => {
  const momentToDateString = (moment) => moment ? moment.format('YYYY-MM-DD') : '';

  const fromDate = momentToDateString(filterValues.get('fromDate'));
  const toDate = momentToDateString(filterValues.get('toDate'));
  const alertType = filterValues.get('alertType');

  return { fromDate, toDate, alertType }
};

const mapDispatchToProps = (dispatch, props) => ({
  dispatchLoadAlertTypes: () => dispatch(loadAlertTypes()),
  onSubmit: (formData) => props.setFilter(convertFormValues(formData)),
});

const mapStateToProps = () => createStructuredSelector({
  alertTypes: selectAlertTypes(),
  locale: selectLocale(),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'alertsFilter' })(AlertsFilterForm));
