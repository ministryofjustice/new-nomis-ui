import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form/immutable';
import { createStructuredSelector } from 'reselect';

import { createFormAction } from 'redux-form-saga';

import Button from 'components/Button';

import { SubmissionError } from 'components/FormComponents';

// import DatePicker from 'containers/FormContainers/datePicker';
import DateRangePicker from 'containers/FormContainers/dateRangePicker';
import TypeSubTypeSelectors from 'containers/FormContainers/typeSubTypeSelectors';
import Select from 'components/FormComponents/Select';
import { QueryForm, CnffItemHolder, CnffHeader, CnffTitle, CnffButtonHolder, DateRange, CnffResetButton, CnffTypeSubTypeHolder } from './caseNoteFilterForm.theme';

import { selectCaseNotesQuery } from '../../selectors';
import {
  CASE_NOTE_FILTER,
} from '../../constants';

import {
  caseNoteFilterSelectInfo,
} from './selectors';

// const upper = (value) => value && value.toUpperCase();

const SearchForm = (props) => {
  const { handleSubmit, submitting, error, reset, isMobile, caseNoteFilters } = props;
  const { source, type, subType } = caseNoteFilters;
  const showSource = false;
  return (
    <QueryForm onSubmit={handleSubmit}>
      <CnffHeader>
        <CnffTitle>Filters</CnffTitle>
      </CnffHeader>
      <SubmissionError error={error}>{error}</SubmissionError>
      <CnffTypeSubTypeHolder showSource={showSource} isMobile={isMobile}>
        <Field isMobile={isMobile} name="typeSubType" component={TypeSubTypeSelectors} options={{ types: type, subTypes: subType }} type="text" title="Type" placeholder="" multi />
      </CnffTypeSubTypeHolder>
      <DateRange isMobile={isMobile}>
        <Field name="dateRange" component={DateRangePicker} title="Date Range" />
      </DateRange>
      {showSource ? <CnffItemHolder isMobile={isMobile}>
        <Field name="source" component={Select} options={source} type="text" title="Source" autocomplete="off" multi />
      </CnffItemHolder> : null}
      <CnffButtonHolder isMobile={isMobile}>
        <Button type="submit" disabled={submitting} submitting={submitting} buttonstyle="link">Apply filters</Button>
      </CnffButtonHolder>
    </QueryForm>
  );
};

SearchForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  reset: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  caseNoteFilters: PropTypes.object.isRequired,
};

SearchForm.defaultProps = {
  error: '',
  isMobile: false,
};


export function mapDispatchToProps() {
  return {
    onSubmit: createFormAction((formData) => ({ type: CASE_NOTE_FILTER.BASE, payload: { query: formData.toJS(), resetPagination: true, goToPage: '/bookings/details' } }), [CASE_NOTE_FILTER.SUCCESS, CASE_NOTE_FILTER.ERROR]),
  };
}

const mapStateToProps = createStructuredSelector({
  initialValues: selectCaseNotesQuery(),
  caseNoteFilters: caseNoteFilterSelectInfo(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'caseNoteFilter', // a unique identifier for this form
})(SearchForm));
