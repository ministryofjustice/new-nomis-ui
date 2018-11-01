import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form/immutable'
import moment from 'moment'
import { DatePicker, momentToLocalizedDate, localizedDateToMoment } from '../../../FormComponents/DatePicker'
import SelectWithLabel from '../../../FormComponents/SelectWithLabel'

import './mobileAlertsFilterForm.scss'
import { alertTypesType } from '../../../../containers/Bookings/Details/Alerts/selectors'

const MobileAlertsFilterForm = ({ alertTypes, locale, submitting, error, handleSubmit, reset }) => (
  <details className="govuk-details add-gutter-padding-top">
    <summary className="govuk-details__summary">
      <span className="govuk-details__summary-text">Show filters</span>
    </summary>
    <form className="mobile-alerts-filter-form" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col no-left-gutter">
          <h3 className="bold-medium no-left-gutter">Filters</h3>
        </div>
      </div>

      <div className="row add-gutter-margin-top no-left-gutter">
        <div className="col-sm-12 no-left-gutter no-right-gutter">
          <Field title="Type of alert" component={SelectWithLabel} name="alertType" options={alertTypes} />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 no-left-gutter no-right-gutter">
          {error && <div className="error-message">Start date must be equal to or before the end date</div>}

          <span className="form-label date-range-label add-gutter-margin-bottom add-gutter-margin-top">Added date</span>

          <Field
            name="fromDate"
            showError={error}
            component={DatePicker}
            locale={locale}
            format={momentToLocalizedDate(locale)}
            parse={localizedDateToMoment(locale)}
            title="From"
            shouldShowDay={date => date && date.isBefore(moment())}
          />

          <Field
            name="toDate"
            showError={error}
            component={DatePicker}
            format={momentToLocalizedDate(locale)}
            parse={localizedDateToMoment(locale)}
            locale={locale}
            title="To"
            shouldShowDay={date => date && date.isBefore(moment())}
          />
        </div>

        <div className="row reset-filters">
          <div className="col no-gutters pull-right">
            <button type="button" className="link clickable add-gutter-bottom" onClick={reset}>
              Reset filters
            </button>
          </div>
        </div>

        <div className="col-sm-12 no-left-gutter no-right-gutter">
          <div>
            <button type="submit" className="button" disabled={submitting || error}>
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </form>
  </details>
)

MobileAlertsFilterForm.propTypes = {
  alertTypes: alertTypesType.isRequired,
  locale: PropTypes.string.isRequired,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
}

MobileAlertsFilterForm.defaultProps = {
  error: '',
  submitting: false,
}

export default MobileAlertsFilterForm
