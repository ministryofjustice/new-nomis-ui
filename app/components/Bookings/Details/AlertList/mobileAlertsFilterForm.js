import React from 'react';
import { DatePicker, momentToLocalizedDate, localizedDateToMoment } from 'components/FormComponents/DatePicker';
import SelectWithLabel from 'components/FormComponents/SelectWithLabel';
import { Field } from 'redux-form/immutable';

import moment from 'moment';

import './mobileAlertsFilterForm.scss';


const MobileAlertsFilterForm = ({ alertTypes, dateRangeNotValid, resetFilters, locale, submitting, error, handleSubmit }) => (
  <details className="govuk-details add-gutter-padding-top">
    <summary className="govuk-details__summary"><span className="govuk-details__summary-text">Show filters</span></summary>
    <form className="mobile-alerts-filter-form" onSubmit={handleSubmit} >

      <div className="row">
        <div className="col no-left-gutter">
          <h3 className="bold-medium no-left-gutter">Filters</h3>
        </div>
      </div>

      <div className="row add-gutter-margin-top no-left-gutter">

        <div className="col-sm-12 no-left-gutter no-right-gutter">
          <Field
            title="Type of alert"
            component={SelectWithLabel}
            name="alertType"
            options={alertTypes}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12 no-left-gutter no-right-gutter">

          {dateRangeNotValid &&
          <div className="error-message">
            Start date must be equal to or before the end date
          </div>
          }

          <label className="form-label date-range-label add-gutter-margin-bottom add-gutter-margin-top">
            Date range
          </label>

          <Field
            name="fromDate"
            showError={dateRangeNotValid}
            component={DatePicker}
            locale={locale}
            format={momentToLocalizedDate(locale)}
            parse={localizedDateToMoment(locale)}
            title="From"
            shouldShowDay={(date) => date && date.isBefore(moment())}
          />

          <Field
            name="toDate"
            showError={dateRangeNotValid}
            component={DatePicker}
            format={momentToLocalizedDate(locale)}
            parse={localizedDateToMoment(locale)}
            locale={locale}
            title="To"
            shouldShowDay={(date) => date && date.isBefore(moment())}
          />
        </div>

        <div className="row reset-filters">
          <div className="col no-gutters pull-right">
            <button type="button" className="link clickable add-gutter-bottom" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        </div>

        <div className="col-sm-12 no-left-gutter no-right-gutter">
          <div>
            <button type="submit" className="button" disabled={dateRangeNotValid || (submitting || error)}>
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </form>
  </details>
);

export default MobileAlertsFilterForm;