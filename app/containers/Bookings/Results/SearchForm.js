import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form/immutable';
import Button, { ButtonRow } from 'components/Button';

import { Input, SubmissionError } from 'components/FormComponents';
import { InputLabel, InputGroup } from 'components/FormComponents/Input/input.theme';

// import Locations from '../Search/locations.json';
// import createFilterOptions from '../Search/fastFilterFun';

import { StyledSelect } from '../Search/search.theme';

import { QueryForm, QueryItemHolder } from './query.theme';

// const filterOptions = createFilterOptions({ options: Locations });

const upper = (value) => value && value.toUpperCase();

const SearchForm = (props) => {
  const { handleSubmit, submitting, error, optionsAndFilterFunc } = props;
  const { options, filterOptions } = optionsAndFilterFunc;
  return (
    <QueryForm onSubmit={handleSubmit}>
      <SubmissionError error={error}>{error}</SubmissionError>
      <QueryItemHolder>
        <Field name="firstName" component={Input} type="text" title="First Name" placeholder="ex. John" autocomplete="off" />
      </QueryItemHolder>
      <QueryItemHolder>
        <Field name="lastName" component={Input} type="text" title="Last Name" placeholder="ex. Doe" autocomplete="off" spellcheck="false" />
      </QueryItemHolder>
      <QueryItemHolder>
        <Field name="offenderNo" component={Input} type="text" title="Noms #" autocomplete="off" />
      </QueryItemHolder>
      <ButtonRow>
        <Button type="submit" disabled={submitting} submitting={submitting} buttonstyle="link">Search</Button>
      </ButtonRow>
    </QueryForm>
  );
};

SearchForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.string,
  optionsAndFilterFunc: PropTypes.object.isRequired,
};

SearchForm.defaultProps = {
  error: '',
};

export default reduxForm({
  form: 'search', // a unique identifier for this form
})(SearchForm);
