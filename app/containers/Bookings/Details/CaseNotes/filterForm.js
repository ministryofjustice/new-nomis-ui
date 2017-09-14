import PropTypes from 'prop-types';
import React from 'react';
import DatePicker from 'containers/FormContainers/datePicker';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form/immutable';
import { createFormAction } from 'redux-form-saga';
import { createStructuredSelector } from 'reselect';
import { selectLocale } from 'containers/LanguageProvider/selectors';
import TypeAndSubTypeSelector from 'components/Bookings/TypeAndSubTypeSelector';

import './filterForm.scss';

import {
  selectCaseNotesQuery,
} from '../../selectors';

import {
  CASE_NOTE_FILTER,
} from '../../constants';

import {
  caseNoteFilterSelectInfo,
} from './selectors';

import {
  resetCaseNoteFilterFormField,
} from '../../actions';

const selector = formValueSelector('caseNoteFilter');

const FilterForm = ({ handleSubmit, submitting, error, caseNoteFilters, locale, dateRangeValid, typeValue, subTypeValue, resetFields }) => {
  const { type, subType } = caseNoteFilters;
  const dateRangeNotValid = dateRangeValid === false;

  return (
    <form className="filter-form" onSubmit={handleSubmit}>

      <h3 className="bold-medium">
        Filters
      </h3>

      <TypeAndSubTypeSelector selectedType={typeValue} selectedSubType={subTypeValue} types={type} subTypes={subType} />

      <div className="form-group date-range">
        <label className="form-label date-range-label">
          Date range
        </label>

        {dateRangeNotValid &&
          <div className="error-message">
                Start date must come before or equal to the end date
          </div>
        }

        <Field name="startDate" showError={dateRangeNotValid} component={DatePicker} locale={locale} title="From" />
        <Field name="endDate" showError={dateRangeNotValid} component={DatePicker} locale={locale} title="To" />
      </div>

      <div className="buttons">
        <div className="pull-right link reset-filters clickable" onClick={resetFields}>
            Clear filters
        </div>
        <button className="button" type="submit" disabled={dateRangeNotValid || (submitting || error)}>
            Apply filters
        </button>
      </div>

    </form>
  );
};

FilterForm.propTypes = {
  locale: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  caseNoteFilters: PropTypes.object.isRequired,
};

FilterForm.defaultProps = {
  locale: 'en',
  error: '',
  isMobile: false,
};


export function mapDispatchToProps(dispatch) {
  return {
    resetFields: () => {
      dispatch(resetCaseNoteFilterFormField('typeValue'));
      dispatch(resetCaseNoteFilterFormField('subTypeValue'));
      dispatch(resetCaseNoteFilterFormField('startDate'));
      dispatch(resetCaseNoteFilterFormField('endDate'));
    },
    onSubmit: createFormAction((formData) => (
      {
        type: CASE_NOTE_FILTER.BASE,
        payload: {
          query: { ...formData.toJS(),
            dateRange: {
              startDate: formData.toJS().startDate,
              endDate: formData.toJS().endDate,
            },
            typeSubType: {
              type: formData.toJS().typeValue,
              subType: formData.toJS().subTypeValue,
            } },
          resetPagination: true,
          goToPage: '/bookings/details',
        },
      }), [CASE_NOTE_FILTER.SUCCESS, CASE_NOTE_FILTER.ERROR]),
  };
}

const mapStateToProps = createStructuredSelector({
  initialValues: selectCaseNotesQuery(),
  caseNoteFilters: caseNoteFilterSelectInfo(),
  typeValue: (state) => selector(state, 'typeValue'),
  subTypeValue: (state) => selector(state, 'subTypeValue'),
  dateRangeValid: (state) => state.getIn(['search', 'details', 'caseNotes', 'dateRangeValid']),
  locale: selectLocale(),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'caseNoteFilter',
})(FilterForm));
