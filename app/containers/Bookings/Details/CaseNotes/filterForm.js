import React,{PropTypes} from 'react';
import DatePicker from 'containers/FormContainers/datePicker';

import {reset} from 'redux-form';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form/immutable';
import { createFormAction } from 'redux-form-saga';
import { createStructuredSelector } from 'reselect';
import { selectLocale } from 'containers/LanguageProvider/selectors';
import moment from 'moment';
import { DEFAULT_MOMENT_DATE_FORMAT_SPEC } from 'containers/App/constants';

import './filterForm.scss';

import {
  selectCaseNotesQuery
} from '../../selectors';

import {
  CASE_NOTE_FILTER,
} from '../../constants';

import {
  caseNoteFilterSelectInfo
} from './selectors';

const validate = data => {

  const values = data.toJS();
  let errors = { };

  const startDate = moment(values.startDate, DEFAULT_MOMENT_DATE_FORMAT_SPEC);
  const endDate  = moment(values.endDate, DEFAULT_MOMENT_DATE_FORMAT_SPEC);

  if(startDate && endDate && startDate.isAfter(endDate))
    errors.startDate = 'Start date must come before or equal to the end date';

  if(values.startDate && !values.endDate)
    errors.endDate = 'Please choose an end date';

  return errors;
}

const FilterForm = ({handleSubmit, submitting, error, reset, isMobile, caseNoteFilters, locale}) => {

  const { source, type, subType } = caseNoteFilters;

  return (
    <form className="filter-form" onSubmit={handleSubmit}>

      <div className="form-group">
        <label className="form-label">
          Type
        </label>
        <Field className="form-control" component="select" name="typeValue">
          <option> All </option>
          {type.map(t =>
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          )}
        </Field>
      </div>

      <div className="form-group">
        <label className="form-label">
          Sub-type
        </label>

        <Field className="form-control" component="select" name="subTypeValue">
          <option> All </option>
          {subType.map(st =>
            <option key={st.value} value={st.value}>
              {st.label}
            </option>
          )}
        </Field>
      </div>

      <div className="form-group date-range">
        <label className="form-label date-range-label">
          Date range
        </label>

         <Field name="startDate" component={DatePicker} locale={locale} title="From" />
         <Field name="endDate" component={DatePicker} locale={locale} title="To" />
      </div>

      <div className="buttons">
          <div className="pull-right link reset-filters" onClick={reset}>
            Reset Filters
          </div>

          <button className="button" type="submit" disabled={submitting ||  error} submitting={submitting}>
              Apply filters
          </button>
      </div>

    </form>
  )
}

FilterForm.propTypes = {
  locale: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  reset: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  caseNoteFilters: PropTypes.object.isRequired,
};

FilterForm.defaultProps = {
  locale: 'en',
  error: '',
  isMobile: false,
};


export function mapDispatchToProps() {
  return {
    onSubmit: createFormAction((formData) => (
      {
        type: CASE_NOTE_FILTER.BASE,
        payload: {
          query: {...formData.toJS(),
              dateRange: {
              startDate: formData.toJS().startDate,
            endDate: formData.toJS().endDate
          }, typeSubType:{
              type: formData.toJS().typeValue,
              subType: formData.toJS().subTypeValue
          }},
          resetPagination: true,
          goToPage: '/bookings/details'
        }
      }), [CASE_NOTE_FILTER.SUCCESS, CASE_NOTE_FILTER.ERROR]),
  };
}

const mapStateToProps = createStructuredSelector({
  initialValues: selectCaseNotesQuery(),
  caseNoteFilters: caseNoteFilterSelectInfo(),
  locale: selectLocale(),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'caseNoteFilter',
  validate,
  onSubmitSuccess: (result, dispatch) => dispatch(reset('caseNoteFilter')),
})(FilterForm));
