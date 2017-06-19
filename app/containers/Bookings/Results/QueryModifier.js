import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createFormAction } from 'redux-form-saga';
import { createStructuredSelector } from 'reselect';

import { SEARCH, SEARCH_SUCCESS, SEARCH_ERROR } from '../constants';
import { selectSearchQuery } from '../selectors';

import SearchForm from './SearchForm';
import QueryView from './QueryView';
import { selectLocationSelectOptionsAndFilterFunc } from '../Search/selectors';

class QueryModifier extends Component {
  constructor(props) {
    super(props);
    this.state = { viewForm: false };

    this.gotoSearchForm = this.gotoSearchForm.bind(this);
  }

  gotoSearchForm() {
    this.setState({ viewForm: true });
  }

  render() {
    const { query, optionsAndFilterFunc } = this.props; //  searchOptions, searchQuery,

    return this.state.viewForm ? <SearchForm optionsAndFilterFunc={optionsAndFilterFunc} initialValues={query} onSubmit={this.props.onSubmitForm} />
      : <QueryView optionsAndFilterFunc={optionsAndFilterFunc} initialValues={query} onSubmit={this.gotoSearchForm} />
    ;
  }
}

QueryModifier.propTypes = {
  optionsAndFilterFunc: PropTypes.object.isRequired,
  // searchOptions: PropTypes.array.isRequired,
  // searchQuery: PropTypes.object.isRequired,
  onSubmitForm: PropTypes.func.isRequired,
  query: PropTypes.object.isRequired,
};

QueryModifier.defaultProps = {
};

export function mapDispatchToProps() {
  return {
    onSubmitForm: createFormAction((formData) => ({ type: SEARCH, payload: { query: formData.toJS(), resetPagination: true } }), [SEARCH_SUCCESS, SEARCH_ERROR]), //onSubmitActions(SEARCH, SEARCH_SUCCESS, SEARCH_ERROR), // (x) => { console.log(x); }, //
  };
}

const mapStateToProps = createStructuredSelector({
  query: selectSearchQuery(),
  optionsAndFilterFunc: selectLocationSelectOptionsAndFilterFunc(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(QueryModifier);
