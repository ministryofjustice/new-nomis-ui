import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createFormAction } from 'redux-form-saga';
import { createStructuredSelector } from 'reselect';

import { SEARCH, SEARCH_SUCCESS, SEARCH_ERROR } from '../constants';


import SearchForm from './SearchForm';

const QueryModifier = (props) => {
  const { searchOptions, searchQuery } = props;

  return (
    <SearchForm onSubmit={props.onSubmitForm} />
  );
};

QueryModifier.propTypes = {
  searchOptions: PropTypes.array.isRequired,
  searchQuery: PropTypes.object.isRequired,
  onSubmitForm: PropTypes.func.isRequired,
};

QueryModifier.defaultProps = {
};

export function mapDispatchToProps() {
  return {
    onSubmitForm: createFormAction((formData) => ({ type: SEARCH, payload: { query: formData, resetPagination: true } }), [SEARCH_SUCCESS, SEARCH_ERROR]), //onSubmitActions(SEARCH, SEARCH_SUCCESS, SEARCH_ERROR), // (x) => { console.log(x); }, //
  };
}

const mapStateToProps = createStructuredSelector({
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(QueryModifier);
