import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { reduxForm } from 'redux-form/immutable';
import Button, { ButtonRow } from 'components/Button';

import { Input, SubmissionError } from 'components/FormComponents';
import { InputLabel, InputGroup } from 'components/FormComponents/Input/input.theme';

import Locations from '../Search/locations.json';
import createFilterOptions from '../Search/fastFilterFun';

import { StyledSelect } from '../Search/search.theme';

import { QueryForm, QueryItemHolder } from './query.theme';

const filterOptions = createFilterOptions({ options: Locations });

const upper = (value) => value && value.toUpperCase();

const SearchForm = (props) => {
  const { handleSubmit, submitting, error } = props;
  return (
    <QueryForm onSubmit={handleSubmit}>
      <SubmissionError error={error}>{error}</SubmissionError>
      <QueryItemHolder>
        <Field name="firstName" component={Input} type="text" title="First Name / Alias" placeholder="ex. John" normalize={upper} />
      </QueryItemHolder>
      <QueryItemHolder>
        <Field name="lastName" component={Input} type="text" title="Last Name" placeholder="ex. Doe" normalize={upper} autocomplete="off" spellcheck="false" />
      </QueryItemHolder>
      <QueryItemHolder>
        <Field name="offenderId" component={Input} type="number" title="NOMS #" autocomplete="off" />
      </QueryItemHolder>
      <QueryItemHolder>
        <Field name="bookingId" component={Input} type="number" title="Booking #" autocomplete="off" />
      </QueryItemHolder>
      <QueryItemHolder>
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
};

SearchForm.defaultProps = {
  error: '',
};

export default reduxForm({
  form: 'search', // a unique identifier for this form
})(SearchForm);
