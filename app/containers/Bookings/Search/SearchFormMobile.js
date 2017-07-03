import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form/immutable';
import Button, { ButtonRow } from 'components/Button';

import { Input, SubmissionError } from 'components/FormComponents';
import { InputLabel, InputGroup } from 'components/FormComponents/Input/input.theme';

import { StyledSelect, FormWrapper } from './searchMobile.theme';

// const filterOptions = createFilterOptions({ options: Locations });

const upper = (value) => value && value.toUpperCase();

const SearchFormMobile = (props) => {
  const { handleSubmit, submitting, error, optionsAndFilterFunc } = props;
  const { options, filterOptions } = optionsAndFilterFunc;
  return (
    <FormWrapper onSubmit={handleSubmit}>
      <SubmissionError error={error}>{error}</SubmissionError>
      <Field name="firstName" component={Input} type="text" title="First Name" placeholder="ex. John"  />
      <Field name="lastName" component={Input} type="text" title="Last Name" placeholder="ex. Doe"  autocomplete="off" spellcheck="false" />
      <Field name="offenderNo" component={Input} type="text" title="Noms #" autocomplete="off" />
      <ButtonRow>
        <Button type="submit" disabled={submitting} submitting={submitting} buttonstyle="link">Search</Button>
      </ButtonRow>
    </FormWrapper>
  );
};

SearchFormMobile.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  // pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  optionsAndFilterFunc: PropTypes.object.isRequired,
};

SearchFormMobile.defaultProps = {
  error: '',
};

export default reduxForm({
  form: 'search', // a unique identifier for this form
})(SearchFormMobile);
