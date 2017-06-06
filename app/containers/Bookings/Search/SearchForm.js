import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { reduxForm } from 'redux-form/immutable';
import Button, { ButtonRow, ButtonLink } from 'components/Button';

import { Input, SubmissionError } from 'components/FormComponents';
import { InputLabel, InputGroup } from 'components/FormComponents/Input/input.theme';

import Locations from './locations.json';
import createFilterOptions from './fastFilterFun';

import { StyledSelect, Form, FormHeader, FormTitle, FormResetLink } from './search.theme';

const filterOptions = createFilterOptions({ options: Locations });

const upper = (value) => value && value.toUpperCase();

const SearchForm = (props) => {
  const { handleSubmit, reset, submitting, error } = props;
  return (
    <Form onSubmit={handleSubmit}>
      <FormHeader>
        <FormTitle>Search</FormTitle>
        <FormResetLink onClick={reset}>Reset Search</FormResetLink>
      </FormHeader>
      <SubmissionError error={error}>{error}</SubmissionError>
      <Field name="firstName" component={Input} type="text" title="First Name / Alias" placeholder="ex. John" normalize={upper} />
      <Field name="lastName" component={Input} type="text" title="Last Name" placeholder="ex. Doe" normalize={upper} autocomplete="off" spellcheck="false" />
      <Field name="offenderId" component={Input} type="number" title="NOMS Number" autocomplete="off" />
      <Field name="bookingId" component={Input} type="number" title="Booking Number" autocomplete="off" />
      <InputGroup>
        <InputLabel htmlFor="location">Location</InputLabel>
        <Field
          multi
          name="locations"
          options={Locations}
          filterOptions={filterOptions}
          component={StyledSelect}
        />
      </InputGroup>
      <ButtonRow>
        <ButtonLink to="/" buttonstyle="cancel">Cancel</ButtonLink>
        <Button type="submit" disabled={submitting} submitting={submitting} buttonstyle="link">Search</Button>
      </ButtonRow>
    </Form>
  );
};

SearchForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  // pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

SearchForm.defaultProps = {
  error: '',
};

export default reduxForm({
  form: 'search', // a unique identifier for this form
})(SearchForm);
