import React, { Component } from 'react';

import DesktopAlertsFilterForm from 'components/Bookings/Details/AlertList/desktopAlertsFilterForm';
import MobileAlertsFilterForm from 'components/Bookings/Details/AlertList/mobileAlertsFilterForm';
import { loadAlertTypes } from 'containers/Bookings/actions';

import { selectLocale } from 'containers/LanguageProvider/selectors';
import { selectAlertTypes } from 'containers/Bookings/Details/Alerts/selectors';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form/lib/immutable';
import PropTypes from 'prop-types';

class AlertsFilterForm extends Component {
  componentDidMount() {
    const { dispatchLoadAlertTypes } = this.props;
    dispatchLoadAlertTypes();
  }

  render() {
    const { deviceFormat, alertTypes, handleSubmit, locale } = this.props;

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


const mapDispatchToProps = (dispatch) => ({
  dispatchLoadAlertTypes: () => dispatch(loadAlertTypes()),
});

const mapStateToProps = () => createStructuredSelector({
  alertTypes: selectAlertTypes(),
  locale: selectLocale(),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'alertsFilter' })(AlertsFilterForm));
