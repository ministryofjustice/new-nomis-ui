import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form/immutable'
import Button from '@govuk-react/button'
import moment from 'moment'
import { DatePicker, momentToLocalizedDate, localizedDateToMoment } from '../../../FormComponents/DatePicker'
import SelectWithLabelAndMagicAllOption from '../../../FormComponents/SelectWithLabelAndMagicAllOption'

import './desktopAlertsFilterForm.scss'
import { alertTypesType } from '../../../../containers/Bookings/Details/Alerts/selectors'

const DesktopAlertsFilterForm = ({ alertTypes, locale, submitting, error, handleSubmit, reset }) => (
  <form className="desktop-alerts-filter-form" onSubmit={handleSubmit}>
    <div className="row">
      <div className="col-md-3 no-left-gutter">
        <h3 className="bold-medium no-left-gutter">Filters</h3>
      </div>
    </div>

    <div className="row no-left-gutter">
      <div className="col-md-3 no-left-gutter">
        <Field
          title="Type of alert"
          component={SelectWithLabelAndMagicAllOption}
          name="alertType"
          options={alertTypes}
        />
      </div>

      <div className="col-md-4 no-left-gutter no-right-gutter">
        {error && (
          <div className="error-message">&apos;From&apos; date must be equal to or before the &apos;To&apos; date</div>
        )}

        <Field
          name="fromDate"
          showError={error}
          component={DatePicker}
          locale={locale}
          format={momentToLocalizedDate(locale)}
          parse={localizedDateToMoment(locale)}
          title="Effective date from"
          shouldShowDay={date => date && date.isBefore(moment())}
        />

        <Field
          name="toDate"
          showError={error}
          component={DatePicker}
          format={momentToLocalizedDate(locale)}
          parse={localizedDateToMoment(locale)}
          locale={locale}
          title="Effective date to"
          shouldShowDay={date => date && date.isBefore(moment())}
        />
      </div>

      <div className="col-md-2 no-left-gutter no-right-gutter">
        <Button type="submit" disabled={submitting || error} margin={{ size: 5, direction: 'top' }}>
          Apply filters
        </Button>
      </div>
    </div>
    <div className="row">
      <button type="button" className="link clickable reset-filters" onClick={reset}>
        Clear filters
      </button>
    </div>
  </form>
)

DesktopAlertsFilterForm.propTypes = {
  alertTypes: alertTypesType.isRequired,
  locale: PropTypes.string.isRequired,
  submitting: PropTypes.bool,
  error: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
}

DesktopAlertsFilterForm.defaultProps = {
  error: false,
  submitting: false,
}

export default DesktopAlertsFilterForm
