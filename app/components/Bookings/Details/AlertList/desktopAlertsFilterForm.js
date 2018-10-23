import React from 'react'
import { DatePicker, momentToLocalizedDate, localizedDateToMoment } from 'components/FormComponents/DatePicker'
import SelectWithLabel from 'components/FormComponents/SelectWithLabel'
import { Field } from 'redux-form/immutable'

import moment from 'moment'

import './desktopAlertsFilterForm.scss'

const DesktopAlertsFilterForm = ({ alertTypes, locale, submitting, error, handleSubmit, reset }) => (
  <form className="desktop-alerts-filter-form" onSubmit={handleSubmit}>
    <div className="row">
      <div className="col-md-3 no-left-gutter">
        <h3 className="bold-medium no-left-gutter">Filters</h3>
      </div>
      <div className="col-md-9 no-left-gutter add-gutter-margin-top">
        <label className="form-label date-range-label">Added date</label>
      </div>
    </div>

    <div className="row no-left-gutter">
      <div className="col-md-3 no-left-gutter">
        <Field title="Type of alert" component={SelectWithLabel} name="alertType" options={alertTypes} />
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

      <div className="col-md-2 no-left-gutter no-right-gutter">
        <div className="margin30">
          <button type="submit" className="button" disabled={submitting || error}>
            Apply filters
          </button>
        </div>
      </div>
      <div className="col-md-2">
        <div className="margin30">
          <button type="button" className="link clickable reset-filters" onClick={reset}>
            Reset filters
          </button>
        </div>
      </div>
    </div>
  </form>
)

export default DesktopAlertsFilterForm
