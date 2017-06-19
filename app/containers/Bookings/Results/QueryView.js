import React from 'react';
import PropTypes from 'prop-types';
import Button, { ButtonRow } from 'components/Button';

import { InputLabel, InputGroup } from 'components/FormComponents/Input/input.theme';

// import Locations from '../Search/locations.json';
// import createFilterOptions from '../Search/fastFilterFun';

import { QueryWrapper, QueryItemHolder, QueryValue } from './query.theme';

// const filterOptions = createFilterOptions({ options: Locations });

// const upper = (value) => value && value.toUpperCase();

const QueryView = (props) => {
  const { /* error, optionsAndFilterFunc, */ initialValues, onSubmit } = props;
  // const { options, filterOptions } = optionsAndFilterFunc;

  const firstName = initialValues.firstName ? initialValues.firstName : '';
  const lastName = initialValues.lastName ? initialValues.lastName : '';
  const offenderNo = initialValues.offenderNo ? initialValues.offenderNo : null;
  const locations = initialValues.locations ? initialValues.locations : [];

  return (
    <QueryWrapper>
      <QueryItemHolder>
        <InputLabel htmlFor="firstName">First Name / Alias</InputLabel>
        <QueryValue>{firstName}</QueryValue>
      </QueryItemHolder>
      <QueryItemHolder>
        <InputLabel htmlFor="lastName">Last Name</InputLabel>
        <QueryValue>{lastName}</QueryValue>
      </QueryItemHolder>
      <QueryItemHolder>
        <InputLabel htmlFor="offenderNo">Noms #</InputLabel>
        <QueryValue>{offenderNo}</QueryValue>
      </QueryItemHolder>
      <QueryItemHolder>
        <InputGroup>
          <InputLabel htmlFor="location">Location</InputLabel>
          <QueryValue>{locations.map((location) => `${location} `)}</QueryValue>
        </InputGroup>
      </QueryItemHolder>
      <ButtonRow>
        <Button type="submit" buttonstyle="link" onClick={onSubmit} >Modify</Button>
      </ButtonRow>
    </QueryWrapper>
  );
};

QueryView.propTypes = {
  // error: PropTypes.string,
  // optionsAndFilterFunc: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

QueryView.defaultProps = {
  error: '',
};

export default QueryView;
