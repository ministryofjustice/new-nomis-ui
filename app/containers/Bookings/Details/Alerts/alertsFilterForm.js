import React, { Component } from 'react'

import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form/lib/immutable'
import PropTypes from 'prop-types'

import DesktopAlertsFilterForm from '../../../../components/Bookings/Details/AlertList/desktopAlertsFilterForm'
import MobileAlertsFilterForm from '../../../../components/Bookings/Details/AlertList/mobileAlertsFilterForm'
import { loadAlertTypes } from '../../actions'

import { selectLocale } from '../../../LanguageProvider/selectors'
import selectAlertTypes, { alertTypesType, alertTypesFilterType } from './selectors'

class AlertsFilterForm extends Component {
  constructor(props) {
    super(props)
    this.doReset = this.doReset.bind(this)
  }

  componentDidMount() {
    const { dispatchLoadAlertTypes, initialFilterValues, change } = this.props
    dispatchLoadAlertTypes()
    const { alertType, fromDate, toDate } = initialFilterValues
    change('alertType', alertType)
    change('fromDate', fromDate)
    change('toDate', toDate)
  }

  doReset() {
    const { reset, setFilter } = this.props
    reset()
    setFilter({ fromDate: '', toDate: '', alertType: '' })
  }

  render() {
    const { alertTypes, deviceFormat, handleSubmit, locale, error } = this.props

    return deviceFormat === 'desktop' ? (
      <DesktopAlertsFilterForm
        alertTypes={alertTypes}
        handleSubmit={handleSubmit}
        locale={locale}
        error={error}
        reset={this.doReset}
      />
    ) : (
      <MobileAlertsFilterForm
        alertTypes={alertTypes}
        handleSubmit={handleSubmit}
        locale={locale}
        error={error}
        reset={this.doReset}
      />
    )
  }
}

AlertsFilterForm.propTypes = {
  initialFilterValues: alertTypesFilterType.isRequired,
  alertTypes: alertTypesType.isRequired,
  locale: PropTypes.string,
  error: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,

  deviceFormat: PropTypes.string.isRequired,
  dispatchLoadAlertTypes: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
}

AlertsFilterForm.defaultProps = {
  locale: 'en',
  error: false,
}

const convertFormValues = filterValues => ({
  fromDate: filterValues.get('fromDate'),
  toDate: filterValues.get('toDate'),
  alertType: filterValues.get('alertType'),
})

export const validate = form => {
  const startDate = form.get('fromDate')
  const endDate = form.get('toDate')
  const invalidDateRange = endDate && startDate && endDate.isBefore(startDate, 'day')
  return invalidDateRange ? { _error: true } : {}
}

const mapDispatchToProps = (dispatch, props) => ({
  dispatchLoadAlertTypes: () => dispatch(loadAlertTypes()),
  onSubmit: formData => props.setFilter(convertFormValues(formData)),
  validate,
})

const mapStateToProps = () =>
  createStructuredSelector({
    alertTypes: selectAlertTypes(),
    locale: selectLocale(),
  })

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'alertsFilter' })(AlertsFilterForm))
