import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form/immutable';
import Button from 'components/Button';

import { Input, SubmissionError } from 'components/FormComponents';

import { QueryForm, CnffItemHolder, CnffHeader, CnffTitle, CnffButtonHolder, DateRange, CnffResetButton } from './caseNoteFilterForm.theme';

// const filterOptions = createFilterOptions({ options: Locations });

const upper = (value) => value && value.toUpperCase();

const SearchForm = (props) => {
  const { handleSubmit, submitting, error, reset, isMobile } = props;
  return (
    <QueryForm onSubmit={handleSubmit}>
      <CnffHeader>
        <CnffTitle>Filters</CnffTitle>
        <CnffResetButton onClick={reset}>Reset</CnffResetButton>
      </CnffHeader>
      <SubmissionError error={error}>{error}</SubmissionError>
      <CnffItemHolder isMobile={isMobile}>
        <Field name="caseNoteTypeFilter" component={Input} type="text" title="Type" placeholder="" normalize={upper} />
      </CnffItemHolder>
      <CnffItemHolder isMobile={isMobile}>
        <Field name="caseNoteSubTypeFilter" component={Input} type="text" title="SubType" placeholder="" normalize={upper} autocomplete="off" spellcheck="false" />
      </CnffItemHolder>
      <DateRange isMobile={isMobile}>
        <Field name="caseNoteDateRangeFilter" component={Input} type="text" title="Date Range" autocomplete="off" />
      </DateRange>
      <CnffItemHolder isMobile={isMobile}>
        <Field name="caseNoteSourceFilter" component={Input} type="text" title="Source" autocomplete="off" />
      </CnffItemHolder>
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
};

SearchForm.defaultProps = {
  error: '',
  isMobile: false,
};

export default reduxForm({
  form: 'caseNoteFilter', // a unique identifier for this form
})(SearchForm);
