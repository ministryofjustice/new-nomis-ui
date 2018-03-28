import PropTypes from 'prop-types';
import React from 'react';
import DatePicker from 'components/FormComponents/DatePicker';
import moment from 'moment';
import { connect } from 'react-redux';
import { reduxForm, Field, formValueSelector } from 'redux-form/immutable';
import { createFormAction } from 'redux-form-saga';
import { createStructuredSelector } from 'reselect';
import { selectLocale } from 'containers/LanguageProvider/selectors';
import TypeAndSubTypeSelector from 'components/Bookings/TypeAndSubTypeSelector';
import { DATE_ONLY_FORMAT_SPEC, DATE_TIME_FORMAT_SPEC } from 'containers/App/constants';
import {
  DETAILS_TABS,
} from 'containers/Bookings/constants';

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

const FilterForm = ({ handleSubmit, submitting, error, caseNoteFilters, locale, typeValue, subTypeValue, resetFields }) => {
  const { type, subType } = caseNoteFilters;

  const dateRangeNotValid = error.dateRangeValid === false;

  return (
    <form className="filter-form" onSubmit={handleSubmit}>

      <div className="row">
        <div className="col-sm-12 col-md-6 no-left-gutter">
          <h3 className="bold-medium no-left-gutter">
            Filters
          </h3>
        </div>
        <div className="col-sm-12 col-md-6 no-left-gutter">
          <label className="form-label date-range-label hidden-md-down">
            Date range
          </label>
          <div className="pull-right link reset-filters-large clickable" onClick={resetFields}>
            Clear filters
          </div>
        </div>
      </div>

      <div className="row add-gutter-margin-top no-left-gutter">

        <div className="col-sm-12 col-md-6 stack-type-subtype no-left-gutter no-right-gutter">
          <TypeAndSubTypeSelector selectedType={typeValue} selectedSubType={subTypeValue} types={type} subTypes={subType} />
        </div>

        <div className="col-sm-12 col-md-4 no-left-gutter no-right-gutter">

          {dateRangeNotValid &&
            <div className="error-message">
                  Start date must be equal to or before the end date
            </div>
          }

          <label className="form-label date-range-label hidden add-gutter-margin-bottom add-gutter-margin-top">
            Date range
          </label>

          <div className="stack-dates">
            <Field
              name="startDate"
              showError={dateRangeNotValid}
              component={DatePicker}
              locale={locale}
              title="From"
              shouldShowDay={(date) => date.isBefore(moment())}
            />

            <Field
              name="endDate"
              showError={dateRangeNotValid}
              component={DatePicker}
              locale={locale}
              title="To"
              shouldShowDay={(date) => date.isBefore(moment())}
            />
          </div>

        </div>

        <div className="row reset-filters-small">
          <div className="col no-gutters pull-right">
            <div className="link clickable add-gutter-bottom" onClick={resetFields}>
              Clear filters
            </div>
          </div>
        </div>

        <div className="col-sm-4 col-md-2 no-left-gutter no-right-gutter">
          <div className="margin30">
            <button className="button" type="submit" disabled={dateRangeNotValid || (submitting || error)}>
              Apply filters
            </button>
          </div>
        </div>
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

export const validate = (form) => {
  const errors = {};

  const values = form.toJS();
  const startDate = moment(values.startDate, DATE_ONLY_FORMAT_SPEC);
  const endDate = moment(values.endDate, DATE_ONLY_FORMAT_SPEC);

  if (endDate.isBefore(startDate,'day')) {
    errors._error = {
      dateRangeValid: false,
    };
  }

  return errors;
};

export function mapDispatchToProps(dispatch, props) {
  return {
    resetFields: () => {
      dispatch(resetCaseNoteFilterFormField('typeValue'));
      dispatch(resetCaseNoteFilterFormField('subTypeValue'));
      dispatch(resetCaseNoteFilterFormField('startDate'));
      dispatch(resetCaseNoteFilterFormField('endDate'));
    },
    validate,
    onSubmit: createFormAction((formData) => (
      {
        type: CASE_NOTE_FILTER.BASE,
        payload: {
          offenderNo: props.offenderNo,
          pagination: {
            perPage: 10,
            pageNumber: 0,
          },
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
          goToPage: `/offenders/${props.offenderNo}/${DETAILS_TABS.CASE_NOTES}/`,
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
